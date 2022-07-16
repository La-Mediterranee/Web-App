import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import * as fsSync from 'node:fs';
import browserslist from 'browserslist';

import { platform } from 'node:os';
import { fstat, readFileSync } from 'node:fs';
import { sveltekit } from '@sveltejs/kit/vite';
// import { typesafeI18nPlugin } from 'typesafe-i18n/rollup/rollup-plugin-typesafe-i18n';

import type { UserConfig } from 'vite';

/**
 * @param {string | readonly string[]} browserslistConfig
 */
function browserslistToEsbuild(browserslistConfig: string | readonly string[]): string[] {
	if (!browserslistConfig) {
		// the path from where the script is run
		const path = process.cwd();

		// read config if none is passed
		browserslistConfig = browserslist.loadConfig({ path })!;
	}

	const SUPPORTED_ESBUILD_TARGETS = ['es', 'chrome', 'edge', 'firefox', 'ios', 'node', 'safari'];

	const replaces = {
		ios_saf: 'ios',
		android: 'chrome',
	};

	const SEPERATOR = ' ';

	return (
		browserslist(browserslistConfig)
			// transform into ['chrome', '88']
			.map(b => b.split(SEPERATOR))
			// replace the similar browser
			.map(b => {
				b[0] = replaces[b[0]] ? replaces[b[0]] : b[0];
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
			.reduce((acc, b) => {
				const existingIndex = acc.findIndex(br => br[0] === b[0]);

				if (existingIndex !== -1) {
					acc[existingIndex][1] = b[1];
				} else {
					acc.push(b);
				}

				return acc;
			}, [] as string[][])
			// remove separator
			.map(b => b.join(''))
	);
}

const pkg = JSON.parse(
	readFileSync('./package.json', {
		encoding: 'utf-8',
	}),
);

function createViteConfig(): UserConfig {
	// const external =
	// 	dev
	// 		? ['whatwg-url', 'node-fetch']
	// 		: ['firebase/messaging'];

	const browserslist = browserslistToEsbuild(
		'last 5 major versions and >= 0.1% and supports es6-module and supports es6-module-dynamic-import',
	);
	return {
		plugins: [sveltekit()],
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
					// typesafeI18nPlugin(),
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
						? './config/app-cert.windows.pem'
						: './config/example.com+5.pem',
				),
				key: readFileSync(
					platform() === 'linux'
						? './config/app-key.windows.pem'
						: './config/example.com+5-key.pem',
				),
			},
			host: true,
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

export default createViteConfig();
