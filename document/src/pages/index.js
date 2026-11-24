/*
 * Copyright 2015-2026 the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0. See LICENSE.txt.
 */
import React from 'react';
import {Redirect, useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {dataqlProjectsPath} from '@site/hasor-tech/routes';

export default function DevelopmentHome() {
    const {search, hash} = useLocation();
    const pathname = useBaseUrl(dataqlProjectsPath);
    return <Redirect to={{pathname, search, hash}}/>;
}
