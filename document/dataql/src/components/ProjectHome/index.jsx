/*
 * Copyright 2015-2026 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0.
 * See the LICENSE.txt file for the full license.
 * https://www.apache.org/licenses/LICENSE-2.0
 */
import Community from '@site/hasor-tech/Community';
import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import Translate, {translate} from '@docusaurus/Translate';
import useBaseUrl from '@docusaurus/useBaseUrl';
import CodeBlock from '@theme/CodeBlock';
import LicenseBadge from '@site/static/img/labels/license.svg';
import styles from './index.module.css';

const examples = {
    transform: {
        script: `var people = [
    {"name": "Alice", "age": 25},
    {"name": "Bob", "age": 30}
];

return people => [{
    "name",
    "nextAge": age + 1
}];`,
        result: `[
    {"name": "Alice", "nextAge": 26},
    {"name": "Bob", "nextAge": 31}
]`,
        link: '/docs/syntax/transform',
    },
    group: {
        script: `import 'net.hasor.dataql.host.function.basic.CollectionUdfSource'
    as collect;

var rows = [
    {"name": "Alice", "team": "dev"},
    {"name": "Bob", "team": "sales"},
    {"name": "Carol", "team": "dev"}
];
return collect.groupBy(rows, 'team');`,
        result: `{
    "dev": [
        {"name": "Alice", "team": "dev"},
        {"name": "Carol", "team": "dev"}
    ],
    "sales": [
        {"name": "Bob", "team": "sales"}
    ]
}`,
        link: '/docs/funx/collect',
    },
    sql: {
        script: `hint FRAGMENT_SQL_DATA_SOURCE = "ds1"
hint FRAGMENT_SQL_OPEN_PACKAGE = "off"

var people = @@selectSql()<%
    SELECT id AS "id", name AS "name", balance AS "balance"
    FROM example_people
    ORDER BY id
%>;
return people();`,
        result: `[
    {"id": 1, "name": "Alice", "balance": 100},
    {"id": 2, "name": "Bob", "balance": 200}
]`,
        link: '/docs/sql/execute',
    },
};

function QueryPanels({example}) {
    return (
        <div className={styles.queryGrid}>
            <div className={styles.queryCode}>
                <div className={styles.codeHeading}><span>DataQL</span><span><Translate id="homepage.query.script">查询脚本</Translate></span></div>
                <CodeBlock language="javascript">{example.script}</CodeBlock>
            </div>
            <div className={styles.queryResult}>
                <div className={styles.codeHeading}><span>JSON</span><span><Translate id="homepage.query.result">示例结果</Translate></span></div>
                <CodeBlock language="json">{example.result}</CodeBlock>
            </div>
        </div>
    );
}

function LanguageSection() {
    const steps = {
        transform: {
            title: translate({id: 'homepage.query.tab.transform', message: '结构转换'}),
            description: translate({id: 'homepage.query.transform', message: '选择字段、计算新值，一次转换得到所需的数据结构。'}),
        },
        group: {
            title: translate({id: 'homepage.query.tab.group', message: '分组聚合'}),
            description: translate({id: 'homepage.query.group', message: '导入内置函数，按字段分组，组合为新的结果。'}),
        },
        sql: {
            title: translate({id: 'homepage.query.tab.sql', message: 'SQL 查询'}),
            description: translate({id: 'homepage.query.sql', message: '通过 SQL 执行器访问数据库。此例使用示例工程中已配置的 ds1 数据源。'}),
        },
    };

    return (
        <section className={styles.languageSection} aria-labelledby="dataql-title">
            <div className={styles.container}>
                <div className={clsx(styles.sectionHeading, styles.centeredHeading)}>
                    <div>
                        <h2 id="dataql-title"><Translate id="homepage.language.title">让数据，成为你需要的样子。</Translate></h2>
                    </div>
                </div>
                <div>
                    {['transform', 'sql', 'group'].map(id => {
                        const {title, description} = steps[id];
                        return (
                            <article className={styles.queryStep} key={id} aria-labelledby={`dataql-${id}-title`}>
                                <div className={styles.queryStepIntro}>
                                    <h3 id={`dataql-${id}-title`}>{title}</h3>
                                    <p>{description}</p>
                                    <Link className={clsx(styles.secondaryButton, styles.queryStepGuide)} to={examples[id].link}>
                                        <Translate id="homepage.query.more">了解更多</Translate>
                                    </Link>
                                </div>
                                <QueryPanels example={examples[id]}/>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function ProjectHero({name, tagline, description, quickStartPath, overviewPath, children}) {
    return (
        <header className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.heroGrid}>
                    <div className={styles.heroCopy}>
                        <h1>{name}{' '}<span>{tagline}</span></h1>
                        <p className={styles.heroDescription}>{description}</p>
                        <div className={styles.actions}>
                            <Link className={styles.primaryButton} to={quickStartPath}>
                                <Translate id="homepage.projectHero.quickStart">快速开始</Translate>
                            </Link>
                            <Link className={styles.secondaryButton} to={overviewPath}>
                                <Translate id="homepage.projectHero.overview" values={{name}}>{'认识 {name}'}</Translate>
                            </Link>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </header>
    );
}

const dataSources = [
    ['MySQL', 'mysql.svg'], ['PostgreSQL', 'postgresql.svg'], ['Hive', 'hive.svg'],
    ['ClickHouse', 'clickhouse.svg'], ['MongoDB', 'mongodb.svg'], ['Redis', 'redis.svg'],
    ['Elasticsearch', 'elastic.svg'], ['Milvus', 'milvus.svg'],
];
const services = [['HTTP', 'http.png'], ['Dubbo', 'dubbo.png'], ['Java', 'java.svg']];

function IntegrationIcons({items}) {
    const base = useBaseUrl('/img/project-home/');
    return <ul className={styles.integrationIcons}>
        {items.map(([name, file]) => <li key={name}>
            <img src={base + file} width="44" height="44" alt={name} title={name}/>
        </li>)}
    </ul>;
}

function DataqlIntegrations() {
    return <section className={styles.integrationBand} aria-labelledby="dataql-integrations">
        <div className={clsx(styles.container, styles.integrationLayout)}>
            <h2 id="dataql-integrations"><Translate id="homepage.dataql.integrations">接入多种数据源与服务</Translate></h2>
            <IntegrationIcons items={[...dataSources, ...services]}/>
        </div>
    </section>;
}

function Participate({project}) {
    return <section className={styles.participation} aria-labelledby="participation-title">
        <div className={styles.container}>
            <Community>
                <div className={styles.participationHeading}>
                    <h2 id="participation-title"><Translate id="homepage.participation.title">加入社区</Translate></h2>
                    <a className={styles.licenseBadge} href="https://www.apache.org/licenses/LICENSE-2.0.html"
                       target="_blank" rel="noopener noreferrer" aria-label="Apache License 2.0">
                        <LicenseBadge aria-hidden="true" focusable="false"/>
                    </a>
                </div>
                <p><Translate id="homepage.participation.description" values={{project}}>{'交流使用经验、反馈问题，参与 {project} 的改进。'}</Translate></p>
            </Community>
        </div>
    </section>;
}

export function DataqlHome() {
    const description = translate({id: 'homepage.dataql.description', message: '用脚本查询、转换和聚合数据，可在 Java 应用或 Dataway 接口中运行。'});
    return (
        <Layout title="DataQL" description={description}>
            <main className={clsx(styles.home, styles.projectHome, styles.dataqlHome)}>
                <ProjectHero name="DataQL" description={description}
                    tagline={<Translate id="homepage.dataql.tagline">专为结构转换而生</Translate>}
                    quickStartPath="/docs/tutorial/first-query" overviewPath="/docs/overview">
                    <div className={styles.heroExample}>
                        <div className={styles.exampleHeading}>
                            <span><Translate id="homepage.query.script">查询脚本</Translate></span>
                            <span className={styles.codeLabel}>DataQL</span>
                        </div>
                        <CodeBlock language="javascript">{`var price = 20;
var quantity = 3;
return {"quantity": quantity, "total": price * quantity};`}</CodeBlock>
                        <div className={styles.heroResult}>
                            <div className={styles.resultLabel}>
                                <span><Translate id="homepage.query.result">示例结果</Translate></span>
                                <span className={styles.contentType}>JSON</span>
                            </div>
                            <CodeBlock language="json">{'{"quantity": 3, "total": 60}'}</CodeBlock>
                        </div>
                    </div>
                </ProjectHero>
                <DataqlIntegrations/>
                <LanguageSection/>
                <Participate project="DataQL"/>
            </main>
        </Layout>
    );
}
