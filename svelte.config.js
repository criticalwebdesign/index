import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
// console.log(123, process.env.NODE_ENV); // FYI

import adapter from '@sveltejs/adapter-auto';
/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter()
	}
};



// import adapter from '@sveltejs/adapter-static';
// /** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	kit: {
//         paths: {
//             // this did not work on github, internal routes returned 404
//             // base: process.env.NODE_ENV === 'production' ? '/givememydata' : ''
//             base: process.argv.includes('dev') ? '' : '/critical-web-design-index'
// 		},

// 		adapter: adapter({
// 			pages: 'build',
// 			assets: 'build',
//             // this did not work on github, internal routes returned 404
// 			// fallback: null,
// 			fallback: '404.html', // to specify a fallback page for SPA mode
// 			precompress: false,
// 			strict: true
// 		})
// 	},
// 	preprocess: [vitePreprocess({})]

// };



export default config;