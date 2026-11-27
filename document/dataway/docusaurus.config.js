/*
 * Copyright 2015-2026 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0.
 * See the LICENSE.txt file for the full license.
 * https://www.apache.org/licenses/LICENSE-2.0
 */
// @ts-check
const {themes} = require('prism-react-renderer');
const {onlineOrigins} = require('./hasor-tech/routes');
const {assignProjectSlug} = require('./plugins/document-routes');
const {projectVars, replaceVariables} = require('./plugins/projectVars.js');

/** @type {import('@docusaurus/types').Config} */
const config = require('./hasor-tech/config')({
    title: 'Dataway - 数据网关',
    tagline: 'Dataway 数据网关',
    url: process.env.DOCS_URL || onlineOrigins.dataway,
    baseUrl: process.env.DOCS_BASE_URL || '/',
    onBrokenLinks: 'throw',
    markdown: {
        preprocessor: ({fileContent}) => replaceVariables(fileContent),
        parseFrontMatter: async ({filePath, fileContent, defaultParseFrontMatter}) => assignProjectSlug(__dirname, filePath,
            await defaultParseFrontMatter({filePath, fileContent: replaceVariables(fileContent)})),
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
                    routeBasePath: 'docs',
                    sidebarPath: require.resolve('./sidebars.js'),
                    editLocalizedFiles: true,
                    editUrl: 'https://gitee.com/hasortech/dataql/blob/dev/document/dataway/',
                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig: /** @type {import('@docusaurus/preset-classic').ThemeConfig} */ {
        metadata: [
            {name: 'keywords', content: 'sql,dataway,hasor,dataql,开源,开源软件,java开源,开源项目,开源代码'},
            {name: 'description', content: 'Dataway 将接口编辑、调试、发布及 OpenAPI 文档内嵌到 Hasor、Solon 和 Spring 应用。'}
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
            copyright: `Copyright © ${new Date().getFullYear()} Dataway. Built with Docusaurus.`,
        },
    },
    plugins: [
        [
            require.resolve('./plugins/llms.js'),
            {
                siteTitle: 'Dataway',
                overview: 'dataway/intro/overview.md',
                descriptions: {
                    'zh-cn': `Dataway ${projectVars.lastReleaseVer} 使用文档：配置、开发和发布 API。`,
                    en: `Dataway ${projectVars.lastReleaseVer} documentation: configure, develop and publish APIs.`,
                },
                depth: 2,
                logLevel: 0, // Route exclusions below are expected.
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
                indexBlog: false,
                language: ['en', 'zh'],
            },
        ],
    ],
}, 'dataway');

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
