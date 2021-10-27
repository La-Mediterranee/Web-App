import path, { resolve } from 'path';
import { existsSync, readdirSync, readFileSync } from 'fs';

import type { PWAConfig } from '../config/config.js';

// const inScripts = process.cwd().includes('scripts') ? path.resolve(process.cwd(), '..') : process.cwd();
const inScripts = process.cwd();

export function getPath(...pathSegment: string[]): string {
	// return path.resolve(process.cwd(), ...pathSegment);
	return path.resolve(inScripts, ...pathSegment);
}

export async function loadFile<T>(path: string): Promise<T> {
	try {
		//@ts-ignore
		const file = await import(path);
		return file.default ? file.default : file;
	} catch (e) {
		console.log('require used');
		return require(path);
	}
}

export async function getAppHtmlConfigFile(otherPath: string = '') {
	// The testing between reading the whole dir and filtering resulted in
	// a faster result than checking for the file with each extension.
	// This has, I think, mostly to do with the extra syscall it had to do
	// and if we would check for more extensions it would be
	// even slower
	const configDir = getPath(otherPath);
	if (existsSync(configDir)) {
		const match = readdirSync(configDir).find((path) => new RegExp('pwa.config.(cjs|mjs|js|ts)').test(path));
		if (match) {
			const path = getPath(otherPath, match);
			return loadFile<PWAConfig>(path);
		}

		throw new Error(`pwa.config.(cjs|mjs|js) doesn't exist.`);
	}

	throw new Error("Config directory doesn't exist");
}

export async function getSiteMapConfigFile(otherPath: string = '') {
	const configDir = getPath(otherPath);
	if (existsSync(configDir)) {
		const match = readdirSync(configDir).find((path) => new RegExp('kit-sitemap.(cjs|mjs|js)').test(path));
		if (match) {
			const path = getPath(otherPath, match);
			return loadFile<SitemapConfig>(path);
		}

		throw new Error(`kit-sitemap.(cjs|mjs|js) doesn't exist.`);
	}

	throw new Error("Config directory doesn't exist");
}

// got this from Eloquent JavaScript
function req<T>(filename: string): T {
	let code = readFileSync(resolve(__dirname, filename)).toString();
	let module = { exports: {} };
	let wrapper = Function('req, exports, module', code);
	wrapper(req, module.exports, module);
	return module.exports as T;
}

export const stylesheets = (() => {
	let stylesheets: string[] = [];
	return {
		links: stylesheets,
		push: (stylesheet: string) => {
			stylesheets.push(stylesheet);
		},
	};
})();
