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

const personQuery = `hint FRAGMENT_SQL_DATA_SOURCE = "ds1"
var query = @@selectSql(id)<%
    SELECT id AS "id", name AS "name", balance AS "balance"
    FROM example_people
    WHERE id = #{id}
%>;
return query(\${id});`;

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
            <Link className={styles.exampleGuide} to="/docs/intro/quickstart">
                <Translate id="homepage.hero.guide">查看 SQL 接口示例</Translate>
            </Link>
        </div>
    );
}

function ConsolePreview({image, title, description, link}) {
    const src = useBaseUrl(`/img/dataway/${image}`);
    return (
        <figure className={styles.consolePreview}>
            <figcaption className={styles.consoleStepCaption}>
                <div className={styles.consoleStepCopy}>
                    <h3>{title}</h3>
                    {' '}<p>{description}</p>
                </div>
                <Link className={clsx(styles.secondaryButton, styles.consoleGuide)} to={link}>
                    <Translate id="homepage.console.more">了解更多</Translate>
                </Link>
            </figcaption>
            <a href={src} target="_blank" rel="noreferrer" className={styles.screenshotLink}>
                <img src={src} alt={description} width="1440" height="500"
                    loading="lazy" decoding="async"/>
            </a>
        </figure>
    );
}

function ConsoleSection() {
    const steps = [
        {
            id: 'editor', image: 'quickstart-published.png', link: '/docs/intro/quickstart',
            title: translate({id: 'homepage.console.step.edit', message: '编写与调试'}),
            description: translate({id: 'homepage.console.edit', message: '用请求参数测试 DataQL 或 SQL 脚本。'}),
        },
        {
            id: 'results', image: 'console-result-handlers.png', link: '/docs/capabilities/management#result-panel',
            title: translate({id: 'homepage.console.step.result', message: '选择响应格式'}),
            description: translate({id: 'homepage.console.result', message: '预览 JSON、文本、表格或图片，也可下载文件。'}),
        },
        {
            id: 'list', image: 'console-list.png', link: '/docs/capabilities/management',
            title: translate({id: 'homepage.console.step.publish', message: '发布与管理'}),
            description: translate({id: 'homepage.console.publish', message: '调用已发布的 API，管理草稿和发布历史。'}),
        },
    ];
    return (
        <section className={clsx(styles.section, styles.container)} aria-labelledby="dataway-title">
            <div className={clsx(styles.sectionHeading, styles.centeredHeading)}>
                <div>
                    <h2 id="dataway-title"><Translate id="homepage.console.title">API 开发工作台</Translate></h2>
                </div>
            </div>
            <div className={styles.consoleWalkthrough}>
                {steps.map(({id, ...step}) => <ConsolePreview key={id} {...step}/>)}
            </div>
        </section>
    );
}

function ApplicationSection() {
    const features = [
        {
            title: translate({id: 'homepage.feature.sources.title', message: '连接多个数据源'}),
            description: translate({id: 'homepage.feature.sources.description', message: '按名称查询数据源，复用应用事务。'}),
            link: '/docs/capabilities/datasources',
            label: 'SQL · Transaction',
        },
        {
            title: translate({id: 'homepage.feature.auth.title', message: '沿用应用的身份认证'}),
            description: translate({id: 'homepage.feature.auth.description', message: '复用登录体系，控制 API 和控制台权限。'}),
            link: '/docs/authorization',
            label: 'Identity · Permission',
        },
        {
            title: translate({id: 'homepage.feature.docs.title', message: '发布标准接口文档'}),
            description: translate({id: 'homepage.feature.docs.description', message: '生成 OpenAPI 和 Swagger 文档，支持在线调用。'}),
            link: '/docs/capabilities/document',
            label: 'OpenAPI · Swagger',
        },
        {
            title: translate({id: 'homepage.feature.results.title', message: '按需输出结果'}),
            description: translate({id: 'homepage.feature.results.description', message: '支持 JSON、CSV 等格式，可自定义结果处理器。'}),
            link: '/docs/capabilities/result-handlers',
            label: 'JSON · CSV · Binary',
        },
    ];
    return (
        <section className={clsx(styles.section, styles.container)} aria-labelledby="application-title">
            <div className={styles.applicationPanel}>
                <div className={styles.applicationIntro}>
                    <h2 id="application-title"><Translate id="homepage.application.title">融入你的应用。</Translate></h2>
                    <p><Translate id="homepage.application.description">集成到 Spring、Solon 或 Hasor，复用数据源和业务服务。</Translate></p>
                    <Link className={styles.lightButton} to="/docs/integration">
                        <Translate id="homepage.application.guide">选择你的框架</Translate>
                    </Link>
                    <div className={styles.storageNote}>
                        <span><Translate id="homepage.application.storageLabel">API 定义与发布记录</Translate></span>
                        <Link to="/docs/metadata"><Translate id="homepage.application.storage">JDBC / Nacos / 自定义存储</Translate></Link>
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
                    quickStartPath="/docs/intro/quickstart" overviewPath="/docs/intro/overview">
                    <ApiExample/>
                </ProjectHero>
                <ConsoleSection/>
                <ApplicationSection/>
                <Participate project="Dataway"/>
            </main>
        </Layout>
    );
}
