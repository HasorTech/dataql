/*
 * Copyright 2015-2026 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0.
 * See the LICENSE.txt file for the full license.
 * https://www.apache.org/licenses/LICENSE-2.0
 */
package net.hasor.dataql.sqlproc.documentation;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import net.hasor.dataql.host.HostConfiguration;
import net.hasor.dataql.host.QueryManager;
import net.hasor.dataql.sqlproc.execute.support.ConnectionProvider;
import org.h2.jdbcx.JdbcDataSource;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class SqlTypeHandlerScenariosTest {
    private Connection   keeper;
    private QueryManager manager;

    @BeforeEach
    public void initialize() throws Exception {
        JdbcDataSource source = new JdbcDataSource();
        source.setURL("jdbc:h2:mem:type_scenario_" + UUID.randomUUID());
        this.keeper = source.getConnection();
        try (Statement statement = this.keeper.createStatement()) {
            statement.execute("CREATE TABLE preferences (id INT PRIMARY KEY, document VARCHAR(4000))");
            statement.execute("CREATE TABLE people (id INT PRIMARY KEY, name VARCHAR(30))");
            statement.execute("INSERT INTO people VALUES (1, 'Alice'), (2, 'Bob')");
        }
        HostConfiguration host = new HostConfiguration();
        host.addAttachment(ConnectionProvider.class, (name, hints) -> source.getConnection());
        this.manager = new QueryManager(host);
    }

    @AfterEach
    public void close() throws Exception {
        if (this.keeper != null) {
            this.keeper.close();
        }
    }

    @Test
    public void scalarAndTemporalExamples() throws Exception {
        assertEquals(Timestamp.valueOf("2026-10-05 12:34:56").getTime(), this.execute(this.script("timestamp.dql")));
        assertEquals("中文测试", this.execute(this.script("unicode-text.dql")));
        assertEquals(Map.of("amount", new BigDecimal("123.45"), "enabled", true), this.execute(this.script("decimal-and-boolean.dql")));
        assertEquals(1, this.execute(this.script("boolean-update.dql")));
        assertEquals("2026-10-05T12:34:56+08:00", this.execute(this.script("offset-timestamp.dql")));
        Map<?, ?> row = (Map<?, ?>) this.execute(this.script("nullable-fields.dql"));
        assertNull(row.get("name"));
        assertEquals(Timestamp.valueOf("2026-10-05 12:34:56").getTime(), row.get("createdAt"));
    }

    private Object execute(String script) throws Exception {
        return this.manager.newBuilder().createQuery(script).execute().getData().unwrap();
    }

    @Test
    public void arrayValuesAndInExpansion() throws Exception {
        String integers = this.script("integer-array.dql");
        assertEquals(List.of(1, 2, 3), this.execute(integers));
        assertEquals(List.of(), this.execute(integers.replace("[1, 2, 3]", "[]")));
        assertEquals(Arrays.asList(null, null), this.execute(integers.replace("[1, 2, 3]", "[null, null]")));
        assertNull(this.execute(integers.replace("[1, 2, 3]", "null")));
        assertEquals(Arrays.asList(1.25, null, 2.0), this.execute(this.script("decimal-array.dql")));
        assertThrows(Exception.class, () -> this.execute(integers.replace("[1, 2, 3]", "[1, 'bad']")));
        List<?> rows = (List<?>) this.execute(this.script("array-in-expansion.dql"));
        assertEquals(2, rows.size());
    }

    @Test
    public void jsonObjectsRoundTripWithoutDoubleEncoding() throws Exception {
        String save = this.script("save-json-object.dql");
        assertEquals(1, this.execute(save));
        assertEquals(Map.of("name", "Alice", "firstTag", "java"), this.execute(this.script("read-json-object.dql")));
        String listSave = save.substring(0, save.indexOf("return save(")) + this.script("save-json-array.dql");
        assertEquals(1, this.execute(listSave));
        assertEquals("[1,null,3]", this.execute("var q = @@selectSql()<% SELECT document FROM preferences WHERE id = 2 %>; return q();"));
        assertEquals(1, this.execute(save.replace("return save(1,", "return save(3,").replace("{'name':'Alice', 'tags':['java','dataql'], 'nickname':null}", "null")));
        assertNull(this.execute("var q = @@selectSql()<% SELECT document FROM preferences WHERE id = 3 %>; return q();"));
    }

    @Test
    public void explicitHandlerExample() throws Exception {
        String script = this.script("explicit-handler.dql");
        assertEquals("ALICE", this.execute(script));
        assertNull(this.execute(script.replace("query('Alice')", "query(null)")));
    }

    private String script(String scenario) throws IOException {
        try (InputStream input = getClass().getResourceAsStream("/sql-type-scenarios/" + scenario)) {
            assertNotNull(input, "Missing SQL type scenario: " + scenario);
            return new String(input.readAllBytes(), StandardCharsets.UTF_8);
        }
    }
}
