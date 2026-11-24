// Licensed under the Apache License, Version 2.0. See the LICENSE.txt file for details.
const path = require('node:path');
const {default: getSlug} = require('@docusaurus/plugin-content-docs/lib/slug.js');
const {DefaultNumberPrefixParser} = require('@docusaurus/plugin-content-docs/lib/numberPrefix.js');

function projectDocSlug(slug) {
    const match = /^\/(dataway|dataql)(?=\/|$)/.exec(slug);
    return match ? match[0] + '/docs' + slug.slice(match[0].length) : '/dataql/docs' + slug;
}

function assignProjectSlug(siteDir, filePath, parsed) {
    const relative = path.relative(siteDir, filePath).split(path.sep).join('/');
    const match = /^docs\/[^/]+\/docusaurus-plugin-content-docs\/current\/(.+\.mdx?)$/.exec(relative);
    if (!match) return parsed;
    const source = match[1];
    const frontMatter = parsed.frontMatter;
    const filename = path.posix.basename(source, path.posix.extname(source));
    const parsePrefixes = frontMatter.parse_number_prefixes !== false;
    const slug = getSlug({
        baseID: frontMatter.id ?? (parsePrefixes ? DefaultNumberPrefixParser(filename).filename : filename),
        frontMatterSlug: frontMatter.slug,
        source,
        sourceDirName: path.posix.dirname(source),
        stripDirNumberPrefixes: parsePrefixes,
    });
    return {...parsed, frontMatter: {...frontMatter, slug: projectDocSlug(slug)}};
}

module.exports = {assignProjectSlug, projectDocSlug};
