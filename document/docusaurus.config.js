/*
 * Copyright 2015-2026 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0.
 * See the LICENSE.txt file for the full license.
 * https://www.apache.org/licenses/LICENSE-2.0
 */
// @ts-check
const {themes} = require('prism-react-renderer');
const {GlobExcludeDefault} = require('@docusaurus/utils');
const {onlineOrigins} = require('./hasor-tech/routes');
const {assignProjectSlug} = require('./plugins/document-routes');
const projectVars = require('./plugins/projectVars.js');
const remarkProjectVars = require('./plugins/remark-project-vars.js');

/** @type {import('@docusaurus/types').Config} */
const config = require('./hasor-tech/config')({
    title: 'DataQL - 数据查询语言',
    tagline: 'DataQL 数据查询语言',
    url: process.env.DOCS_URL || onlineOrigins.dataql,
    baseUrl: process.env.DOCS_BASE_URL || '/',
    onBrokenLinks: 'throw',
    markdown: {
        preprocessor: ({fileContent}) => remarkProjectVars.replaceVariables(fileContent, projectVars),
        parseFrontMatter: async ({filePath, fileContent, defaultParseFrontMatter}) => assignProjectSlug(__dirname, filePath,
            await defaultParseFrontMatter({filePath, fileContent: remarkProjectVars.replaceVariables(fileContent, projectVars)})),
        hooks: {
            onBrokenMarkdownLinks: 'throw',
        },
    },
    organizationName: 'HasorTech', // Usually your GitHub org/user name.
    projectName: 'dataql',   // Usually your repo name.
    customFields: {project: projectVars},

    i18n: {
        defaultLocale: 'zh-cn',
        locales: ['zh-cn', 'en'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    path: 'docs/cn/docusaurus-plugin-content-docs/current',
                    routeBasePath: '/',
                    remarkPlugins: [[remarkProjectVars, projectVars]],
                    sidebarPath: require.resolve('./sidebars.js'),
                    editLocalizedFiles: true,
                    editUrl: 'https://gitee.com/hasortech/dataql/blob/dev/document/',
                },
                blog: false,
                pages: process.env.NODE_ENV === 'development' ? {} : {exclude: [...GlobExcludeDefault, 'index.js']},
                sitemap: {filename: 'dataql-sitemap.xml'},
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig: /** @type {import('@docusaurus/preset-classic').ThemeConfig} */ {
        metadata: [
            {name: 'keywords', content: 'sql,dataway,hasor,dataql,开源,开源软件,java开源,开源项目,开源代码'},
            {name: 'description', content: 'DataQL 提供数据查询、转换和脚本扩展；Dataway 将接口编辑、调试、发布及 OpenAPI 文档内嵌到 Hasor、Solon 和 Spring 应用。'}
        ],
        colorMode: {
            disableSwitch: true,
        },
        prism: {
            theme: themes.github,
            darkTheme: themes.dracula,
            additionalLanguages: ['java', 'sql', 'properties', 'bash']
        },
        footer: {
            style: 'dark',
            copyright: `Copyright © ${new Date().getFullYear()} DataQL. Built with Docusaurus.`,
        },
    },
    plugins: [
        [
            require.resolve('./plugins/llms.js'),
            {
                siteTitle: 'DataQL and Dataway',
                overview: 'dataql/overview.md',
                descriptions: {
                    'zh-cn': `DataQL ${projectVars.docsVersion} 使用文档：查询语言、执行引擎、内嵌 Dataway 和框架集成。`,
                    en: `DataQL ${projectVars.docsVersion} documentation: query language, execution engine, embedded Dataway, and framework integration.`,
                },
                depth: 2,
                onRouteError: 'throw',
                content: {
                    enableMarkdownFiles: false,
                    enableLlmsFullTxt: false,
                    includeDocs: true,
                    includeBlog: false,
                    includePages: false,
                    includeGeneratedIndex: false,
                    excludeRoutes: ['**/tags{,/**}', '**/search', '**/404.html'],
                },
            },
        ],
    ],
    themes: [
        [
            require.resolve('@easyops-cn/docusaurus-search-local'),
            {
                hashed: true,
                docsRouteBasePath: ['/dataql/docs', '/dataway/docs'],
                indexBlog: false,
                language: ['en', 'zh'],
            },
        ],
    ],
}, 'dataql');

module.exports = function createConfig() {
    if (process.env.DOCUSAURUS_CURRENT_LOCALE !== 'en') {
        return config;
    }
    const messages = require('./docs/en/code.json');
    return {
        ...config,
        title: messages['site.title'].message,
        tagline: messages['site.tagline'].message,
        themeConfig: {
            ...config.themeConfig,
            metadata: config.themeConfig.metadata.map((entry) => ({
                ...entry,
                content: messages['site.' + entry.name]?.message ?? entry.content,
            })),
        },
    };
};
