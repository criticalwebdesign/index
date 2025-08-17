// EXPERIMENTS WITH PRELOADING DATA...


// /** @type {import('./$types').PageLoad} */


// // export function load({ params }) {
// //     return {
// //         // post: {
// //         // 	title: `Title for ${params.slug} goes here`,
// //         // 	content: `Content for ${params.slug} goes here`
// //         // }
// //         hash: 123
// //     };
// // }

//     import { page } from '$app/state';

// /** @type {import('./$types').PageLoad} */ // or LayoutLoad for layout.js
// export function load({ params }) {
//     // const hash = url.hash; // This will give you the hash, including the '#' symbol
//     // console.log('URL Hash:', hash);

//     console.log("params", params)


//     let hash = "";
// 	if (page.url.hash) {
// 		console.log('page.url.hash', page.url.hash);
//         hash = page.url.hash
// 	}


//     // You can then use this hash to fetch data or modify the component's props
//     return {
//         pageHash: hash,
//     };
// }