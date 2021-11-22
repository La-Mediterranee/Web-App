/** @type {import("eslint").ESLint} */
module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended'],
	plugins: ['svelte3', '@typescript-eslint'],
	ignorePatterns: ['*.cjs', 'node_modules/*'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': require('typescript'),
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2019,
	},
	env: {
		browser: true,
		es2017: true,
		node: true,
		serviceworker: true,
		worker: true,
	},
	rules: {
		'no-unused-vars': 'warn',
		'no-mixed-spaces-and-tabs': 0, // disable rule
	},
};
