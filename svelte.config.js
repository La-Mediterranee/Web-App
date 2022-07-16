import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

import node from '@sveltejs/adapter-node';
import netlify from '@sveltejs/adapter-netlify';
import cvWorker from '@sveltejs/adapter-cloudflare-workers';
import adapterStatic from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV === 'development';

/**
 * @type {import("./src/lib/types/index").KitConfig}
 */
const kitConfig = {
	// target: '#svelte',
	files: {
		// serviceWorker: '..',
		// template: 'index.html',
	},
	serviceWorker: {
		register: false,
		files: filepath => !/\.DS_STORE/.test(filepath),
	},
	adapter: node(),
	// adapter: adapterStatic(),
	// adapter: netlify(),
	// adapter: cvWorker({
	// 	esbuild(defaultOptions) {
	// 		return {
	// 			...defaultOptions,
	// 			target: 'es2015',
	// 			plugins: [],
	// 		};
	// 	},
	// }),
	// router: false,
	paths: {
		// assets: 'https://cdn.la-mediterranee.at',
	},
	prerender: {
		enabled: true,
		crawl: true,
		onError: 'continue',
		entries: ['*'],
	},
};

const preprocess = sveltePreprocess({
	// babel: {
	// 	presets: [
	// 		[
	// 			'@babel/preset-env',
	// 			{
	// 				loose: true,
	// 				modules: false,
	// 				targets: {
	// 					// ! Very important. Target es6+
	// 					esmodules: true
	// 				}
	// 			}
	// 		]
	// 	]
	// },
	typescript: {
		tsconfigFile: './tsconfig.json',
	},
	scss: {
		includePaths: ['src/styles', 'theme', 'node_modules'],
	},
	postcss: {
		plugins: [
			autoprefixer({
				env: 'development',
			}),
		],
	},
	sourceMap: dev,
	preserve: ['ld+json', 'application/ld+json'],
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		dev,
	},
	preprocess: preprocess,
	kit: kitConfig,
};
export default config;
