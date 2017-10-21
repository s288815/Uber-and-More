// Plugins
import json from 'rollup-plugin-json';

export default {
	input: './js/main.js',
	// input: './js/login.js',
	output: {
		file: './js/bundle.js',
		// file: './js/login.bundle.js',
		format: 'iife',
		sourcemap: 'inline',
		// moduleName: 'MyBundle',
		globals: {
			jquery: '$',
		},
		// banner
		// footer
		intro: 'window.globalVar = window.globalVar || {};'
		// outro
	},
	cache: true,
	plugins: [
		json()
		// ...
	],
	watch: {
		include: 'js/**',
		// exclude: 'node_modules/**',
	}
}

// https://code.lengstrof.com/learn-rollup-js/