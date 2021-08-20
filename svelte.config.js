import * as path from 'path';
import sveltePreprocess from 'svelte-preprocess';
import autoprefixer from 'autoprefixer';
import node from '@sveltejs/adapter-node';
import netlify from '@sveltejs/adapter-netlify';
import adapterStatic from '@sveltejs/adapter-static';

import { visualizer } from 'rollup-plugin-visualizer';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sveltePreprocess({
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
		defaults: {
			script: 'typescript',
			style: 'scss',
		},
		scss: {
			includePaths: ['theme', 'src/styles', 'node_modules'],
		},
		postcss: {
			plugins: [autoprefixer()],
		},
		sourceMap: process.env.NODE_ENV === 'development' ? true : false,
	}),
	kit: {
		// adapter: netlify(),
		adapter: node(),
		// adapter: adapterStatic(),
		target: '#svelte',
		// router: false,
		prerender: {
			enabled: true,
			crawl: true,
			// @ts-ignore
			onError: 'continue',
			pages: ['*'],
		},
		vite: () => ({
			// build: {
			// 	// target: 'es2015',
			// 	sourcemap: true,
			// 	rollupOptions: {
			// 		plugins: [
			// 			visualizer({
			// 				template: 'treemap',
			// 				sourcemap: true,
			// 				gzipSize: true
			// 			})
			// 		]
			// 	}
			// },
			server: {
				proxy: {
					'/api': {
						target: 'http://localhost:8080',
						changeOrigin: true,
					},
					'/koa': {
						target: 'http://localhost:5000',
						changeOrigin: true,
					},
				},
			},
			resolve: {
				alias: {
					types: path.resolve('./src/lib/@types'),
					$utils: path.resolve('./src/lib/utils'),
					$firebase: path.resolve('./src/lib/utils/firebase.ts'),
					$stores: path.resolve('./src/lib/stores'),
					$components: path.resolve('./src/lib/components'),
				},
			},
		}),
	},
};
export default config;
