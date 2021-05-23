import * as path from 'path';
import sveltePreprocess from 'svelte-preprocess';
// import netlify from '@sveltejs/adapter-netlify';
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
// const { dependencies } = require('./package.json');

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: sveltePreprocess({
		scss: {
			includePaths: ['theme', 'node_modules']
		}
	}),
	kit: {
		// adapter: netlify(),
		target: '#svelte',
		vite: () => ({
			// ssr: {
			// 	noExternal: Object.keys(dependencies || {})
			// },
			// plugins: [],
			resolve: {
				alias: {
					$utils: path.resolve('./src/utils')
				}
			}
		})
	}
};
export default config;
// const sveltePreprocess = require('svelte-preprocess');
// const pkg = require('./package.json');
// const node = require('@sveltejs/adapter-node');
// const netlify = require('@sveltejs/adapter-netlify');
// const path = require('path');
