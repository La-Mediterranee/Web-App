import * as path from 'path';

import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

import { readFileSync } from 'fs';
import { typesafeI18nPlugin } from 'typesafe-i18n/rollup/rollup-plugin-typesafe-i18n';

import node from '@sveltejs/adapter-node';
import netlify from '@sveltejs/adapter-netlify';
import cvWorker from '@sveltejs/adapter-cloudflare-workers';
import adapterStatic from '@sveltejs/adapter-static';

const pkg = JSON.parse(
	readFileSync('./package.json', {
		encoding: 'utf-8',
	}),
);

/**
 * @returns {import("./src/lib/types/index").ViteConfig}}
 */
function vite() {
	const external =
		process.env.NODE_ENV === 'development'
			? ['whatwg-url', 'node-fetch']
			: ['firebase/messaging'];

	return {
		build: {
			target: 'es2015',
			minify: 'terser',
			terserOptions: {
				ecma: 2015,
				module: true,
				compress: {
					keep_fargs: false,
				},
				format: {
					comments: false,
				},
			},
			// sourcemap: true,
			rollupOptions: {
				plugins: [
					// visualizer({
					// 	template: 'treemap',
					// 	sourcemap: true,
					// 	gzipSize: true,
					// }),
					typesafeI18nPlugin(),
				],
			},
		},
		optimizeDeps: {
			// exclude: Object.keys(pkg.dependencies),
		},
		ssr: {
			external: external,
		},
		esbuild: {
			legalComments: 'none',
		},
		server: {
			// https: true,
			// proxy: {
			// 	'/api': {
			// 		target: 'http://localhost:5000',
			// 		changeOrigin: true,
			// 	},
			// },
		},
		css: {
			preprocessorOptions: {
				scss: {
					// additionalData: `$injectedColor: orange;`
					// prependData:
				},
			},
		},
		resolve: {
			alias: {
				types: path.resolve('./src/lib/types'),
				$pages: path.resolve('./src/pages/'),
				$loaders: path.resolve('./src/routes/_loaders'),
				$i18n: path.resolve('./src/i18n'),
				$utils: path.resolve('./src/lib/utils'),
				$components: path.resolve('./src/lib/components'),
				$firebase: path.resolve('./src/lib/utils/firebase.ts'),
				$stores: path.resolve('./src/lib/stores'),
			},
		},
	};
}

/**
 * @type {import("./src/lib/types/index").KitConfig}
 */
const kitConfig = {
	// target: '#svelte',
	files: {
		// serviceWorker: '..',
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
	prerender: {
		enabled: true,
		crawl: true,
		onError: 'continue',
		entries: ['*'],
	},
	vite: vite,
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
	defaults: {
		markup: 'html',
		script: 'typescript',
		style: 'scss',
	},
	scss: {
		includePaths: ['src/styles', 'theme', 'node_modules'],
	},
	postcss: {
		plugins: [autoprefixer()],
	},
	sourceMap: process.env.NODE_ENV === 'development' ? true : false,
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// compilerOptions,
	preprocess: preprocess,
	kit: kitConfig,
};
export default config;
