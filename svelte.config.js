import * as path from 'node:path';

import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';

import { platform } from 'node:os';
import { fstat, readFileSync } from 'node:fs';
import { typesafeI18nPlugin } from 'typesafe-i18n/rollup/rollup-plugin-typesafe-i18n';

import node from '@sveltejs/adapter-node';
import netlify from '@sveltejs/adapter-netlify';
import cvWorker from '@sveltejs/adapter-cloudflare-workers';
import adapterStatic from '@sveltejs/adapter-static';
import browserslist from 'browserslist';

/**
 * @param {string | readonly string[]} browserslistConfig
 */
function browserslistToEsbuild(browserslistConfig) {
	if (!browserslistConfig) {
		// the path from where the script is run
		const path = process.cwd();

		// read config if none is passed
		browserslistConfig = browserslist.loadConfig({ path });
	}

	const SUPPORTED_ESBUILD_TARGETS = ['es', 'chrome', 'edge', 'firefox', 'ios', 'node', 'safari'];

	const replaces = {
		ios_saf: 'ios',
		android: 'chrome',
	};

	const separator = ' ';

	return (
		browserslist(browserslistConfig)
			// transform into ['chrome', '88']
			.map(b => b.split(separator))
			// replace the similar browser
			.map(b => {
				if (replaces[b[0]]) {
					b[0] = replaces[b[0]];
				}

				return b;
			})
			// 11.0-12.0 --> 11.0
			.map(b => {
				if (b[1].includes('-')) {
					b[1] = b[1].slice(0, b[1].indexOf('-'));
				}

				return b;
			})
			// 11.0 --> 11
			.map(b => {
				if (b[1].endsWith('.0')) {
					b[1] = b[1].slice(0, -2);
				}

				return b;
			})
			// only get the ones supported by esbuild
			.filter(b => SUPPORTED_ESBUILD_TARGETS.includes(b[0]))
			// only get the oldest version
			.reduce((/** @type string[][] */ acc, b) => {
				console.log(acc, b);
				const existingIndex = acc.findIndex(br => br[0] === b[0]);

				if (existingIndex !== -1) {
					acc[existingIndex][1] = b[1];
				} else {
					acc.push(b);
				}
				return acc;
			}, [])
			// remove separator
			.map(b => b.join(''))
	);
}

const pkg = JSON.parse(
	readFileSync('./package.json', {
		encoding: 'utf-8',
	}),
);

/**
 * @returns {import("./src/lib/types/index").ViteConfig}}
 */
function vite() {
	// const external =
	// 	process.env.NODE_ENV === 'development'
	// 		? ['whatwg-url', 'node-fetch']
	// 		: ['firebase/messaging'];

	const browserslist = browserslistToEsbuild(
		'last 5 major versions and >= 0.1% and supports es6-module and supports es6-module-dynamic-import',
	);

	console.debug(browserslist);

	return {
		build: {
			target: browserslist,
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
			// external: external,
		},
		esbuild: {
			legalComments: 'none',
		},
		server: {
			https: {
				cert: readFileSync(
					platform() === 'linux'
						? './config/example.com+5.windows.pem'
						: './config/example.com+5.pem',
				),
				key: readFileSync(
					platform() === 'linux'
						? './config/example.com+5-key.windows.pem'
						: './config/example.com+5-key.pem',
				),
			},
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
	sourceMap: process.env.NODE_ENV === 'development' ? true : false,
	preserve: ['ld+json'],
});

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// compilerOptions,
	preprocess: preprocess,
	kit: kitConfig,
};
export default config;
