/*
 * Copyright 2015-2026 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0.
 * See the LICENSE.txt file for the full license.
 * https://www.apache.org/licenses/LICENSE-2.0
 */
const {version: lastReleaseVer, lastReleaseTime} = require('../package.json');

function releaseNotesPath(version) {
    const series = version.split('.').slice(0, 2).join('.');
    return `${series}.x/v${version.replace(/-SNAPSHOT$/, '')}.md`;
}

const projectVars = {
    lastReleaseVer,
    lastReleaseNotesPath: releaseNotesPath(lastReleaseVer),
    lastReleaseTime,
};

function replaceVariables(value) {
    return value.replace(/@project\.([A-Za-z][A-Za-z0-9_]*)@/g, (token, name) => {
        if (!Object.hasOwn(projectVars, name) || typeof projectVars[name] !== 'string') {
            throw new Error(`Unknown or invalid project variable: ${token}`);
        }
        return projectVars[name];
    });
}

module.exports = {projectVars, replaceVariables};
