/*
 * Copyright 2015-2026 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0.
 * See the LICENSE.txt file for the full license.
 * https://www.apache.org/licenses/LICENSE-2.0
 */
package net.hasor.dataql.sqlproc;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import net.hasor.dataql.host.HostConfiguration;
import net.hasor.dataql.host.Query;
import net.hasor.dataql.host.QueryManager;
import net.hasor.dataql.sqlproc.execute.support.ConnectionProvider;
import net.hasor.dataql.sqlproc.execute.support.ExecuteContext;
import net.hasor.dataql.sqlproc.execute.support.ExecuteContextImpl;
import net.hasor.dataql.sqlproc.execute.transaction.TransactionProvider;
import net.hasor.dataql.util.JsonUtils;
import org.h2.jdbcx.JdbcDataSource;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SqlExecutionScenariosTest {
    @Test
    public void positionParameters() throws Exception {
        this.assertScenario("positional-order.dql", "\"Alice\"");
        this.assertScenario("positional-reuse.dql", "1");
        this.assertScenario("positional-options.dql", "\"Alice\"");
    }

    @Test
    public void namedParametersAndExpressions() throws Exception {
        for (String scenario : List.of("named-reuse.dql", "named-nested-values.dql", "named-special-property.dql", "named-like.dql", "named-expression.dql")) {
            this.assertScenario(scenario, "\"Alice\"");
        }
        this.assertScenario("named-null.dql", "0");
    }

    @Test
    public void textReplacement() throws Exception {
        this.assertScenario("dynamic-order.dql", "[{\"id\":2,\"name\":\"Bob\",\"age\":30},{\"id\":1,\"name\":\"Alice\",\"age\":25}]");
        this.assertScenario("dynamic-table.dql", "2");
    }

    @Test
    public void ruleParameters() throws Exception {
        this.assertScenario("optional-condition.dql", "[{\"name\":\"Bob\",\"age\":30}]");
        this.assertScenario("rule-collection.dql", "[{\"name\":\"Alice\"},{\"name\":\"Bob\"}]");
    }

    @Test
    public void xmlConditionsAndPrefixes() throws Exception {
        String people = "[{\"id\":1,\"name\":\"Alice\"},{\"id\":2,\"name\":\"Bob\"}]";
        this.assertScenario("xml-if.dql", people);
        this.assertScenario("xml-choose.dql", "[{\"id\":1,\"name\":\"Alice\"}]");
        this.assertScenario("xml-where.dql", "[{\"id\":2,\"name\":\"Bob\"}]");
        this.assertScenario("xml-trim.dql", people);
        this.assertScenario("xml-set.dql", "1");
    }

    @Test
    public void xmlForeachAndEmptyCollections() throws Exception {
        String script = this.readScenario("xml-foreach.dql");
        this.assertScript(script, "[{\"id\":1,\"name\":\"Alice\"},{\"id\":2,\"name\":\"Bob\"}]");
        this.assertScript(script.replace("return find([1, 2]);", "return find([]);"), "[]");
        this.assertScript(script.replace("return find([1, 2]);", "return find(null);"), "[]");
        this.assertScenario("xml-foreach-insert.dql", "2");
    }

    @Test
    public void xmlBindIncludeAndCdata() throws Exception {
        this.assertScenario("xml-bind.dql", "[{\"id\":1,\"name\":\"Alice\"}]");
        this.assertScenario("xml-include.dql", "[{\"id\":1,\"name\":\"Alice\"},{\"id\":2,\"name\":\"Bob\"}]");
        this.assertScenario("xml-cdata.dql", "[{\"NAME\":\"Alice\"}]");
    }

    @Test
    public void explicitJdbcTypesAndJsonHandler() throws Exception {
        this.assertScenario("jdbc-type.dql", "1");
        this.assertScenario("type-handler.dql", "\"{\\\"name\\\":\\\"Alice\\\",\\\"tags\\\":[\\\"java\\\",\\\"dataql\\\"]}\"");
    }

    @Test
    public void resultPackagingAndSelection() throws Exception {
        this.assertScenario("result-query-rows.dql", "[{\"id\":1,\"name\":\"Alice\"}]");
        this.assertScenario("result-query-value.dql", "\"Alice\"");
        this.assertScenario("result-column-names.dql", "[{\"userId\":1,\"userName\":\"Alice\"},{\"userId\":2,\"userName\":\"Bob\"}]");
        this.assertScenario("result-selection.dql", "{\"#result-set-1\":2}");
    }

    @Test
    public void transactionCommitAndRollback() throws Exception {
        String script = this.readScenario("transaction-transfer.dql");
        this.assertTransaction(script, null, "\"done\"", 90, 110, null);
        this.assertTransaction(script.replace("change(2, 10)", "change(999, 10)"), "Target account not found", null, 100, 100, null);
        this.assertTransaction(this.transactionSetup() + this.readScenario("transaction-required.dql"), "Cancel transfer", null, 100, 100, null);
    }

    private String transactionSetup() throws Exception {
        String script = this.readScenario("transaction-transfer.dql");
        return script.substring(0, script.indexOf("return tran.required"));
    }

    @Test
    public void independentAndNestedTransactions() throws Exception {
        String script = this.transactionSetup() + this.readScenario("transaction-requires-new.dql");
        this.assertTransaction(script, "Cancel outer transaction", null, 100, 110, null);
        this.assertTransaction(script.replace("tran.requiresNew", "tran.nested"), "Cancel outer transaction", null, 100, 100, null);
    }

    @Test
    public void mandatoryAndNeverRequireTheExpectedContext() throws Exception {
        String setup = this.transactionSetup();
        String mandatory = this.readScenario("transaction-mandatory.dql");
        this.assertTransaction(setup + mandatory, null, "1", 110, 100, null);
        this.assertTransaction(setup + mandatory.replace("tran.mandatory", "tran.never"), "propagation NEVER", null, 100, 100, null);
        String direct = "return tran.mandatory(() -> { return change(1, 10); });";
        this.assertTransaction(setup + direct, "propagation MANDATORY", null, 100, 100, null);
        this.assertTransaction(setup + direct.replace("tran.mandatory", "tran.never"), null, "1", 110, 100, null);
    }

    @Test
    public void isolationHintReachesTheJdbcConnection() throws Exception {
        String script = this.readScenario("transaction-isolation.dql");
        this.assertTransaction(script, null, "{\"first\":100,\"second\":100}", 100, 100, Connection.TRANSACTION_READ_COMMITTED);
        this.assertTransaction(script.replace("READ_COMMITTED", "SERIALIZABLE"), null, "{\"first\":100,\"second\":100}", 100, 100, Connection.TRANSACTION_SERIALIZABLE);
    }

    private void assertTransaction(String script, String expectedFailure, String expectedJson, int first, int second, Integer isolation) throws Exception {
        JdbcDataSource source = new JdbcDataSource();
        source.setURL("jdbc:h2:mem:transaction_scenario_" + UUID.randomUUID());
        try (Connection keeper = source.getConnection(); TransactionProvider provider = new TransactionProvider((name, hints) -> source.getConnection())) {
            try (Statement statement = keeper.createStatement()) {
                statement.execute("CREATE TABLE accounts (id INT PRIMARY KEY, balance INT)");
                statement.execute("INSERT INTO accounts VALUES (1,100),(2,100)");
            }
            HostConfiguration host = new HostConfiguration();
            host.addAttachment(ConnectionProvider.class, provider);
            List<Integer> observedIsolation = new ArrayList<>();
            if (isolation != null) {
                host.getAttachment(ExecuteContext.class).addInterceptor(invocation -> {
                    try (Connection connection = provider.findConnection(invocation.getSqlInfo().sourceName(), invocation.getSqlInfo().hints())) {
                        observedIsolation.add(connection.getTransactionIsolation());
                        return invocation.proceed();
                    }
                });
            }
            Query query = new QueryManager(host).newBuilder().createQuery(script);
            if (expectedFailure != null) {
                Exception failure = assertThrows(Exception.class, query::execute);
                assertTrue(failure.getMessage().contains(expectedFailure), failure.getMessage());
            } else {
                this.assertData(JsonUtils.readValue(expectedJson, Object.class), query.execute().getData().unwrap());
            }
            try (Statement statement = keeper.createStatement(); ResultSet balances = statement.executeQuery("SELECT balance FROM accounts ORDER BY id")) {
                assertTrue(balances.next());
                assertEquals(first, balances.getInt(1));
                assertTrue(balances.next());
                assertEquals(second, balances.getInt(1));
                assertFalse(balances.next());
            }
            if (isolation != null) {
                assertEquals(List.of(isolation, isolation), observedIsolation);
            }
        }
    }

    @Test
    public void pagingExamples() throws Exception {
        this.assertScenario("page-query.dql", "{\"rows\":[{\"id\":2,\"name\":\"Bob\"}],\"total\":2,\"currentPage\":2}");
        this.assertScenario("page-navigation.dql", "{\"first\":[{\"id\":1,\"name\":\"Alice\"}],\"second\":[{\"id\":2,\"name\":\"Bob\"}]}");
    }

    @Test
    public void nestedRuleExamples() throws Exception {
        String people = "[{\"id\":1,\"name\":\"Alice\"},{\"id\":2,\"name\":\"Bob\"}]";
        this.assertScenario("rule-query.dql", "[{\"id\":2,\"name\":\"Bob\"}]");
        this.assertScenario("nested-condition-collection.dql", people);
        this.assertScenario("nested-group.dql", people);
        this.assertScenario("nested-branch.dql", "[]");
        this.assertScenario("nested-loop.dql", "[{\"name\":\"Alice\"},{\"name\":\"Bob\"}]");
    }

    @Test
    public void statementRuleSqlBlocks() throws Exception {
        String alice = "[{\"id\":1,\"name\":\"Alice\",\"age\":25,\"enabled\":1}]";
        String both = "[{\"id\":1,\"name\":\"Alice\",\"age\":25,\"enabled\":1},{\"id\":2,\"name\":\"Bob\",\"age\":30,\"enabled\":1}]";
        this.assertRule("and.sql", "name, minAge", "'Alice', 18", "selectSql", alice);
        this.assertRule("and.sql", "name, minAge", "null, null", "selectSql", both);
        this.assertRule("or.sql", "name, id", "'Alice', 2", "selectSql", both);
        this.assertRule("set.sql", "name, changeAge, age, id", "'Alice', true, null, 1", "updateSql", "1");
        this.assertRule("if-text.sql", "name, newest", "'Alice', true", "selectSql", alice);
        this.assertRule("in.sql", "ids", "[1,2,3]", "selectSql", both);
        this.assertRule("in.sql", "ids", "[]", "selectSql", both);
        this.assertRule("case.sql", "name, minAge", "'Alice', 30", "selectSql", alice);
        this.assertRule("case.sql", "name, minAge", "null, null", "selectSql", both);
        this.assertRule("arg.sql", "id", "1", "selectSql", alice);
        this.assertRule("pairs.sql", "names", "['Alice','Bob']", "selectSql", "[{\"name\":\"Alice\"},{\"name\":\"Bob\"}]");
    }

    private void assertRule(String scenario, String parameters, String values, String fragment, String expectedJson) throws Exception {
        String sql = this.readScenario(scenario);
        String script = "hint FRAGMENT_SQL_OPEN_PACKAGE = 'off';\n" + "hint FRAGMENT_SQL_COLUMN_CASE = 'lower';\n" + "var invoke = @@" + fragment + "(" + parameters + ")<%" + sql + "%>;\n" + "return invoke(" + values + ");";
        this.assertScript(script, expectedJson);
    }

    private void assertScenario(String scenario, String expectedJson) throws Exception {
        this.assertScript(this.readScenario(scenario), expectedJson);
    }

    private String readScenario(String scenario) throws IOException {
        try (InputStream input = getClass().getResourceAsStream("/sql-scenarios/" + scenario)) {
            assertNotNull(input, "Missing SQL scenario: " + scenario);
            return new String(input.readAllBytes(), StandardCharsets.UTF_8);
        }
    }

    private void assertScript(String script, String expectedJson) throws Exception {
        JdbcDataSource source = new JdbcDataSource();
        source.setURL("jdbc:h2:mem:sql_scenario_" + UUID.randomUUID());
        try (Connection keeper = source.getConnection()) {
            try (Statement statement = keeper.createStatement()) {
                statement.execute("CREATE TABLE people (id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY, name VARCHAR(100), age INT, enabled INT DEFAULT 1)");
                statement.execute("INSERT INTO people(name, age) VALUES ('Alice',25),('Bob',30)");
            }
            HostConfiguration host = new HostConfiguration();
            host.addAttachment(ConnectionProvider.class, (name, hints) -> source.getConnection());
            ((ExecuteContextImpl) host.getAttachment(ExecuteContext.class)).addMacro("adult", "age >= 18");
            List<String> statements = new ArrayList<>();
            host.getAttachment(ExecuteContext.class).addInterceptor(invocation -> {
                statements.add(invocation.getSqlInfo().queryString());
                return invocation.proceed();
            });
            Object actual = new QueryManager(host).newBuilder().createQuery(script).execute().getData().unwrap();
            this.assertData(JsonUtils.readValue(expectedJson, Object.class), actual);
            assertFalse(statements.isEmpty(), "The scenario must execute JDBC");
        }
    }

    private void assertData(Object expected, Object actual) {
        if (expected instanceof Number && actual instanceof Number) {
            assertEquals(0, new BigDecimal(expected.toString()).compareTo(new BigDecimal(actual.toString())));
        } else if (expected instanceof List<?> expectedList && actual instanceof List<?> actualList) {
            assertEquals(expectedList.size(), actualList.size());
            for (int index = 0; index < expectedList.size(); index++) {
                this.assertData(expectedList.get(index), actualList.get(index));
            }
        } else if (expected instanceof Map<?, ?> expectedMap && actual instanceof Map<?, ?> actualMap) {
            assertEquals(expectedMap.keySet(), actualMap.keySet());
            for (Object key : expectedMap.keySet()) {
                this.assertData(expectedMap.get(key), actualMap.get(key));
            }
        } else {
            assertEquals(expected, actual);
        }
    }
}
