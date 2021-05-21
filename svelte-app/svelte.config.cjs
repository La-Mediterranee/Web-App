const sveltePreprocess = require('svelte-preprocess');
const node = require('@sveltejs/adapter-node');
const pkg = require('./package.json');
const path = require('path');
// const netlify = require('@sveltejs/adapter-netlify');

/** @type {import('@sveltejs/kit').Config} */
module.exports = {
	preprocess: sveltePreprocess({
		scss: {
			includePaths: ['theme', 'node_modules']
		}
	}),
	kit: {
		adapter: node(),
		// adapter: netlify(),
		target: '#svelte',
		vite: {
			ssr: {
				noExternal: Object.keys(pkg.dependencies || {})
			},
			// plugins: [],
			resolve: {
				alias: {
					$utils: path.resolve('./src/utils')
				}
			}
		}
	}
};
