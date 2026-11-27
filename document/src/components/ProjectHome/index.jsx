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
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {usePortalBlogUrl} from '@theme/NavbarItem/ComponentTypes';
import CodeBlock from '@theme/CodeBlock';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import IconExternalLink from '@theme/Icon/ExternalLink';
import LicenseBadge from '@site/static/img/labels/license.svg';
import styles from './index.module.css';

const personQuery = `hint FRAGMENT_SQL_DATA_SOURCE = "ds1"
var query = @@selectSql(id)<%
    SELECT id AS "id", name AS "name", balance AS "balance"
    FROM example_people
    WHERE id = #{id}
%>;
return query(\${id});`;

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
        link: '/dataql/docs/syntax/transform',
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
        link: '/dataql/docs/funx/collect',
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
        link: '/dataql/docs/sql/execute',
    },
};

function ApiExample() {
    return (
        <div className={styles.heroExample}>
            <div className={styles.exampleHeading}>
                <span><Translate id="homepage.hero.example">一段脚本，一个接口</Translate></span>
                <span className={styles.codeLabel}>DataQL + SQL</span>
            </div>
            <div className={styles.endpoint}>
                <span className={styles.method}>POST</span>
                <code>/api/person-query</code>
                <span className={styles.requestParameter}>{'{"id": 1}'}</span>
            </div>
            <CodeBlock language="javascript">{personQuery}</CodeBlock>
            <div className={styles.heroResult}>
                <div className={styles.resultLabel}>
                    <span><Translate id="homepage.hero.result">响应数据 · value</Translate></span>
                    <span className={styles.contentType}>application/json</span>
                </div>
                <CodeBlock language="json">{'{"id": 1, "name": "Alice", "balance": 100}'}</CodeBlock>
            </div>
            <Link className={styles.exampleGuide} to="/dataway/docs/intro/quickstart">
                <Translate id="homepage.hero.guide">查看 SQL 接口示例</Translate>
            </Link>
        </div>
    );
}

function HomepageHero() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <header className={styles.hero}>
            <div className={styles.container}>
                <div className={styles.heroGrid}>
                    <div className={styles.heroCopy}>
                        <div className={styles.heroEyebrow}>
                            <span>DATAWAY + DATAQL</span>
                            <Link to="/dataql/docs/releases/latest" className={styles.version}>v{siteConfig.customFields.project.lastReleaseVer}</Link>
                        </div>
                        <h1>
                            <Translate id="homepage.hero.title">把数据，</Translate>
                            <span><Translate id="homepage.hero.accent">变成可用的 API。</Translate></span>
                        </h1>
                        <p className={styles.heroDescription}>
                            <Translate id="homepage.hero.description">Dataway 将 API 编辑、调试与发布内嵌到 Java 应用。DataQL 用脚本完成数据查询、转换与聚合。</Translate>
                        </p>
                        <div className={styles.actions}>
                            <Link className={styles.primaryButton} to="/dataway/docs/intro/quickstart">
                                <Translate id="homepage.startDataway">开始使用 Dataway</Translate>
                            </Link>
                            <Link className={styles.secondaryButton} to="/dataql/docs/overview">
                                <Translate id="homepage.exploreDataql">了解 DataQL 语言</Translate>
                            </Link>
                        </div>
                        <p className={styles.heroNote}>
                            <Translate id="homepage.hero.note">内嵌应用 · 可视化开发 · 开源免费</Translate>
                        </p>
                        <div className={styles.communityLinks}>
                            <span><Translate id="homepage.community.title">社区交流</Translate></span>
                            <a href="https://qm.qq.com/cgi-bin/qm/qr?k=o4Ue0lHqdr7oLq8ga0vvauXuw41nudbo&jump_from=webapi"
                                target="_blank" rel="noopener noreferrer">
                                <img src="https://img.shields.io/badge/QQ%E7%BE%A41-193943114-orange" height="20"
                                    alt={`${translate({id: 'homepage.community.qq1', message: 'QQ 群 1'})}: 193943114`}/>
                            </a>
                            <a href="https://qm.qq.com/cgi-bin/qm/qr?k=wMahYnxpVZPjrJp0ghQQLJmwM2Lmpmjl&jump_from=webapi"
                                target="_blank" rel="noopener noreferrer">
                                <img src="https://img.shields.io/badge/QQ%E7%BE%A42-641341864-orange" height="20"
                                    alt={`${translate({id: 'homepage.community.qq2', message: 'QQ 群 2'})}: 641341864`}/>
                            </a>
                        </div>
                    </div>
                    <ApiExample/>
                </div>
                <div className={styles.integrationStrip}>
                    <p><Translate id="homepage.integration.strip">接入熟悉的 Java 框架</Translate></p>
                    <div className={styles.frameworkLinks}>
                        <Link to="/dataway/docs/integration/spring">Spring</Link>
                        <Link to="/dataway/docs/integration/solon">Solon</Link>
                        <Link to="/dataway/docs/integration/hasor">Hasor</Link>
                    </div>
                    <Link className={styles.textLink} to="/dataway/docs/integration">
                        <Translate id="homepage.integration.guide">查看整合指南</Translate>
                    </Link>
                </div>
            </div>
        </header>
    );
}

function ConsolePreview({image, title, description, link}) {
    const src = useBaseUrl(`/img/dataway/${image}`);
    return (
        <figure className={styles.consolePreview}>
            {title && <figcaption className={styles.consoleStepCaption}>
                <div className={styles.consoleStepCopy}>
                    <h3>{title}</h3>
                    {' '}<p>{description}</p>
                </div>
                <Link className={clsx(styles.secondaryButton, styles.consoleGuide)} to={link}>
                    <Translate id="homepage.console.more">了解更多</Translate>
                </Link>
            </figcaption>}
            <a href={src} target="_blank" rel="noreferrer" className={styles.screenshotLink}>
                <img src={src} alt={description} width="1440" height="500"
                    loading="lazy" decoding="async"/>
            </a>
            {!title && <figcaption>
                <span>{description}</span>
                <div className={styles.consoleLinks}>
                    <Link to={link}><Translate id="homepage.console.details">查看操作说明</Translate></Link>
                    <a href={src} target="_blank" rel="noreferrer" className={styles.fullImage}>
                        <Translate id="homepage.console.expand">查看大图</Translate><IconExternalLink/>
                    </a>
                </div>
            </figcaption>}
        </figure>
    );
}

function ConsoleSection({showSequence = false, expanded = false}) {
    const steps = [
        {
            id: 'editor', image: 'quickstart-published.png', link: '/dataway/docs/intro/quickstart',
            title: translate({id: 'homepage.console.step.edit', message: '编写与调试'}),
            description: translate({id: 'homepage.console.edit', message: '用请求参数测试 DataQL 或 SQL 脚本。'}),
        },
        {
            id: 'results', image: 'console-result-handlers.png', link: '/dataway/docs/capabilities/management#result-panel',
            title: translate({id: 'homepage.console.step.result', message: '选择响应格式'}),
            description: translate({id: 'homepage.console.result', message: '预览 JSON、文本、表格或图片，也可下载文件。'}),
        },
        {
            id: 'list', image: 'console-list.png', link: '/dataway/docs/capabilities/management',
            title: translate({id: 'homepage.console.step.publish', message: '发布与管理'}),
            description: translate({id: 'homepage.console.publish', message: '调用已发布的 API，管理草稿和发布历史。'}),
        },
    ];
    return (
        <section className={clsx(styles.section, styles.container)} aria-labelledby="dataway-title">
            <div className={clsx(styles.sectionHeading, expanded && styles.centeredHeading)}>
                <div>
                    {showSequence && <p className={styles.eyebrow}>01 / DATAWAY</p>}
                    <h2 id="dataway-title"><Translate id="homepage.console.title">API 开发工作台</Translate></h2>
                    {!expanded && <p><Translate id="homepage.console.description">在浏览器里编写、调试和发布 API。</Translate></p>}
                </div>
                {!expanded && <Link className={styles.textLink} to="/dataway/docs/intro/overview">
                    <Translate id="homepage.console.overview">认识 Dataway 框架</Translate>
                </Link>}
            </div>
            {expanded ? <div className={styles.consoleWalkthrough}>
                {steps.map(({id, ...step}) => <ConsolePreview key={id} {...step}/>)}
            </div> : <Tabs defaultValue="editor" className={styles.consoleTabList} lazy>
                {steps.map(({id, title, ...step}, index) => (
                    <TabItem key={id} value={id} label={String(index + 1).padStart(2, '0') + '  ' + title}>
                        <ConsolePreview {...step}/>
                    </TabItem>
                ))}
            </Tabs>}
        </section>
    );
}

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

function LanguageSection({showSequence = false, projectPage = false}) {
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
                <div className={clsx(styles.sectionHeading, projectPage && styles.centeredHeading)}>
                    <div>
                        {showSequence && <p className={styles.eyebrow}>02 / DATAQL</p>}
                        <h2 id="dataql-title"><Translate id="homepage.language.title">让数据，成为你需要的样子。</Translate></h2>
                        {!projectPage && <p><Translate id="homepage.language.description">用表达式、函数和结构转换组织数据。既能在 Dataway 中开发 API，也能在 Java 应用中独立运行。</Translate></p>}
                    </div>
                    {!projectPage && <Link className={styles.textLink} to="/dataql/docs/tutorial/first-query">
                        <Translate id="homepage.language.guide">从第一个脚本开始</Translate>
                    </Link>}
                </div>
                {projectPage ? <div>
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
                </div> : <>
                    <Tabs defaultValue="transform" lazy>
                        {Object.entries(steps).map(([id, {title, description}]) => (
                            <TabItem key={id} value={id} label={title}>
                                <QueryPanels example={examples[id]}/>
                                <div className={styles.queryCaption}>
                                    <p>{description}</p>
                                    <Link to={examples[id].link}><Translate id="homepage.query.syntax">查看完整用法</Translate></Link>
                                </div>
                            </TabItem>
                        ))}
                    </Tabs>
                    <div className={styles.languageLinks}>
                        <Link to="/dataway/docs/dataql-engine"><Translate id="homepage.language.engine">在 Java 中独立使用引擎</Translate></Link>
                        <Link to="/dataway/docs/engine/functions"><Translate id="homepage.language.udf">把应用方法扩展为函数</Translate></Link>
                        <Link to="/dataway/docs/dataql-engine/sql"><Translate id="homepage.language.sql">接入 SQL 执行器</Translate></Link>
                    </div>
                </>}
            </div>
        </section>
    );
}

function ApplicationSection({showSequence = false}) {
    const features = [
        {
            title: translate({id: 'homepage.feature.sources.title', message: '连接多个数据源'}),
            description: translate({id: 'homepage.feature.sources.description', message: '按名称查询数据源，复用应用事务。'}),
            link: '/dataway/docs/capabilities/datasources',
            label: 'SQL · Transaction',
        },
        {
            title: translate({id: 'homepage.feature.auth.title', message: '沿用应用的身份认证'}),
            description: translate({id: 'homepage.feature.auth.description', message: '复用登录体系，控制 API 和控制台权限。'}),
            link: '/dataway/docs/authorization',
            label: 'Identity · Permission',
        },
        {
            title: translate({id: 'homepage.feature.docs.title', message: '发布标准接口文档'}),
            description: translate({id: 'homepage.feature.docs.description', message: '生成 OpenAPI 和 Swagger 文档，支持在线调用。'}),
            link: '/dataway/docs/capabilities/document',
            label: 'OpenAPI · Swagger',
        },
        {
            title: translate({id: 'homepage.feature.results.title', message: '按需输出结果'}),
            description: translate({id: 'homepage.feature.results.description', message: '支持 JSON、CSV 等格式，可自定义结果处理器。'}),
            link: '/dataway/docs/capabilities/result-handlers',
            label: 'JSON · CSV · Binary',
        },
    ];
    return (
        <section className={clsx(styles.section, styles.container)} aria-labelledby="application-title">
            <div className={styles.applicationPanel}>
                <div className={styles.applicationIntro}>
                    {showSequence && <p className={styles.eyebrow}>03 / IN YOUR APPLICATION</p>}
                    <h2 id="application-title"><Translate id="homepage.application.title">融入你的应用。</Translate></h2>
                    <p><Translate id="homepage.application.description">集成到 Spring、Solon 或 Hasor，复用数据源和业务服务。</Translate></p>
                    <Link className={styles.lightButton} to="/dataway/docs/integration">
                        <Translate id="homepage.application.guide">选择你的框架</Translate>
                    </Link>
                    <div className={styles.storageNote}>
                        <span><Translate id="homepage.application.storageLabel">API 定义与发布记录</Translate></span>
                        <Link to="/dataway/docs/metadata"><Translate id="homepage.application.storage">JDBC / Nacos / 自定义存储</Translate></Link>
                    </div>
                </div>
                <div className={styles.featureGrid}>
                    {features.map(feature => (
                        <Link key={feature.link} className={styles.feature} to={feature.link}>
                            <span className={styles.featureLabel}>{feature.label}</span>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

function GetStartedSection() {
    return (
        <section className={clsx(styles.container, styles.getStarted)} aria-labelledby="get-started-title">
            <div>
                <p className={styles.eyebrow}><Translate id="homepage.start.eyebrow">开始构建</Translate></p>
                <h2 id="get-started-title"><Translate id="homepage.start.title">从第一个接口，到你的业务。</Translate></h2>
                <p><Translate id="homepage.start.description">跟随 Spring 示例发布一个 SQL 查询接口，或从一段 DataQL 脚本开始。</Translate></p>
            </div>
            <div className={styles.actions}>
                <Link className={styles.primaryButton} to="/dataway/docs/intro/quickstart"><Translate id="homepage.start.quickstart">发布第一个 API</Translate></Link>
                <Link className={styles.secondaryButton} to="/dataql/docs/tutorial/first-query"><Translate id="homepage.start.language">学习 DataQL</Translate></Link>
            </div>
        </section>
    );
}

export default function ProjectsHome() {
    const blogUrl = usePortalBlogUrl('dataql');
    return (
        <Layout description={translate({id: 'homepage.description', message: '通过 Dataway 在 Java 应用中编辑、调试和发布 API，使用 DataQL 查询、转换与聚合数据。支持 Spring、Solon、Hasor、多数据源和 OpenAPI 文档。'})}>
            <main className={styles.home}>
                <HomepageHero/>
                <ConsoleSection showSequence/>
                <LanguageSection showSequence/>
                <ApplicationSection showSequence/>
                <GetStartedSection/>
                <div className={clsx(styles.container, styles.community)}>
                    <a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank" rel="noreferrer">Apache License 2.0</a>
                    <a href="https://gitee.com/hasortech/dataql/tree/dev/example" target="_blank" rel="noreferrer"><Translate id="homepage.community.examples">示例源码</Translate></a>
                    <a href="mailto:zyc@byshell.org"><Translate id="homepage.community.contact">联系作者</Translate></a>
                    <Link href={blogUrl}><Translate id="homepage.community.blog">阅读博客</Translate></Link>
                </div>
            </main>
        </Layout>
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

export function DatawayHome() {
    const description = translate({id: 'homepage.dataway.description', message: '连接应用已有的数据源和业务服务，通过配置发布 API。'});
    return (
        <Layout title="Dataway" description={description}>
            <main className={clsx(styles.home, styles.projectHome, styles.datawayHome)}>
                <ProjectHero name="Dataway" description={description}
                    tagline={<Translate id="homepage.dataway.tagline">数据网关</Translate>}
                    quickStartPath="/dataway/docs/intro/quickstart" overviewPath="/dataway/docs/intro/overview">
                    <ApiExample/>
                </ProjectHero>
                <ConsoleSection expanded/>
                <ApplicationSection/>
                <Participate project="Dataway"/>
            </main>
        </Layout>
    );
}

export function DataqlHome() {
    const description = translate({id: 'homepage.dataql.description', message: '用脚本查询、转换和聚合数据，可在 Java 应用或 Dataway 接口中运行。'});
    return (
        <Layout title="DataQL" description={description}>
            <main className={clsx(styles.home, styles.projectHome, styles.dataqlHome)}>
                <ProjectHero name="DataQL" description={description}
                    tagline={<Translate id="homepage.dataql.tagline">专为结构转换而生</Translate>}
                    quickStartPath="/dataql/docs/tutorial/first-query" overviewPath="/dataql/docs/overview">
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
                <LanguageSection projectPage/>
                <Participate project="DataQL"/>
            </main>
        </Layout>
    );
}
