// import { config } from 'dotenv';
import { writeFileSync } from 'fs';
import { join, resolve } from 'path';
import { generateRobotsTxt } from './robots.js';

import type { PathOrFileDescriptor } from 'fs';

const BLOG_PATH = '';

const defaultConfig = {};
const DEFAULT_PAGE_PRIORITY = 0.7;
const DEFAULT_CHANGE_FREQUENZY = 'monthly';
const DEFAULT_BASE_FILENAME = 'sitemap';

const config: SitemapConfig = {
	siteUrl: encodeURIComponent(''),
	changefreq: 'daily',
	priority: 0.7,
	sitemapSize: 5000,
	// generateRobotsTxt: true,
	exclude: ['/protected-page', '/awesome/secret-page'],
	alternateRefs: [
		{
			href: 'https://es.example.com',
			hreflang: 'es',
		},
		{
			href: 'https://fr.example.com',
			hreflang: 'fr',
		},
	],
	// robotsTxtOptions: {},
} as const;

const TIMESTAMP = new Date().toISOString();

// const __dirname = resolve();

function xmlTemplate(content: string) {
	return `<?xml version="1.0" encoding="UTF-8" ?>\n<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0" xmlns:pagemap="http://www.google.com/schemas/sitemap-pagemap/1.0" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${content}</urlset>`;
}

// TIMESTAMP
function render(pages: SitemapField[]) {
	const sitemap = xmlTemplate(
		pages
			.map((element) => {
				const fields = `<loc>${element.loc}</loc>
			<lastmod>${element.lastmod}</lastmod>
			<changefreq>${element.changefreq}</changefreq>
			<priority>${element.priority || DEFAULT_PAGE_PRIORITY}</priority>`;

				return `<url>${fields}</url>\n`;
			})
			.join('')
	);

	return sitemap;
}

export function generateSitemap(path: PathOrFileDescriptor, pages: SitemapField[]) {
	writeFileSync(path, render(pages));
}

// const location = path.join(__dirname, BLOG_PATH);
// const pages = getPages(location);

// export function generateSitemap(path: string, pages: SitemapField[]) {
// 	fs.writeFileSync(sitemapFile, render(pages));
// }

// function getPages(location: fs.PathLike) {
// 	const pages: SitemapField[] = [];

// 	fs.readdirSync(location);

// 	const pages = fs.readdirSync(location).reduce((accumulator, currentValue) => {
// 		if (path.extname(currentValue) === '.svelte' && path.basename(currentValue).indexOf('__') !== 0) {
// 			accumulator.push(`${siteUrl}/${currentValue.replace('.svelte', '/').replace('index/', '')}`);
// 		}

// 		return accumulator;
// 	}, []);

// 	return pages;
// }

// import fs from 'fs';
// import fg from 'fast-glob';
// import { create } from 'xmlbuilder2';
// import pkg from '../package.json';

// const getUrl = (url) => {
// 	const trimmed = url.slice(6).replace('index.html', '');
// 	return `${pkg.url}/${trimmed}`;
// };

// async function createSitemap() {
// 	const sitemap = create({ version: '1.0' }).ele('urlset', {
// 		xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
// 	});

// 	const pages = await fg(['build/**/*.html']);

// 	pages.forEach((page) => {
// 		const url = sitemap.ele('url');
// 		url.ele('loc').txt(getUrl(page));
// 		url.ele('changefreq').txt('weekly');
// 	});

// 	const xml = sitemap.end({ prettyPrint: true });

// 	fs.writeFileSync('build/sitemap.xml', xml);
// }
