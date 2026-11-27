// Licensed under the Apache License, Version 2.0. See LICENSE.txt.
import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useThemeConfig} from '@docusaurus/theme-common';
import NavbarLogo from '@theme-original/Navbar/Logo';
import {useSite} from '@theme/NavbarItem/ComponentTypes';

export default function ProjectNavbarLogo() {
    const {active, localProjects} = useSite();
    const {navbar: {logo, title}} = useThemeConfig();
    const portal = useBaseUrl(logo.href || '/');
    const brand = useBaseUrl(active?.icon.replace(/\.svg$/, '-brand.svg') ?? logo.src);
    const favicon = useBaseUrl(`img/favicon/${(active ?? localProjects[0]).id}.svg`);

    return (
        <>
            <Head><link rel="icon" href={favicon} /></Head>
            {active ? (
                <Link className="navbar__brand" to={portal} target={logo.target}>
                    <div className="navbar__logo"><img src={brand} alt="" /></div>
                    <b className="navbar__title text--truncate">{title}</b>
                </Link>
            ) : <NavbarLogo />}
        </>
    );
}
