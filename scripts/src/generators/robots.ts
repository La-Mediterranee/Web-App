import fs from 'fs';

export function generateRobotsTxt(sitemaps: string[], config: SitemapConfig) {
	const file: string[] = [];

	const defaultPolicy: RobotsPolicy[] = [
		{
			userAgent: '*',
			allow: ['/'],
		},
	];

	for (const policy of config.robotsTxt?.policies || defaultPolicy) {
		file.push(
			`# ${policy.userAgent}
            User-Agent: ${policy.userAgent}
            ${policy.allow?.map((path: string) => {
				return `Allow: ${path}`;
			})}
            ${policy.disallow?.map((path: string) => {
				return `Disallow: ${path}`;
			})}`
		);
	}

	file.push(
		`# Host
    Host: ${config.siteUrl}`
	);

	for (const sitemap of sitemaps) {
	}

	for (const addSitemap of config.robotsTxt?.additionalSitemaps || []) {
	}
}
