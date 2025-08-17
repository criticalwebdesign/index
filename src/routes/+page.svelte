<script>
	// @ts-nocheck

	import About from '$lib/components/About.svelte';
	import Tags from '$lib/components/Tags.svelte';
	import Projects from '$lib/components/Projects.svelte';

	import {
		hashStore,
		currentProject,
		pByKey,
		tag,
		sortField,
		sortOrder,
		p2,
		p2Sorted,
		projectList,
		tagControl
	} from '$lib/stores/stores.js';
	import { page } from '$app/state';
	if (page.url.hash) {
		// console.log('page.url.hash', page.url.hash);
	}


    // EXPERIMENTS WITH PRELOADING DATA...


	// function getData() {
	// 	return new Promise((resolve) => {
	// 		setTimeout(() => {
	// 			resolve({ foo: 1, bar: 2 });
	// 		}, 100);
	// 	});
	// }
	// let data = getData();



	// /** @type {import('./$types').PageProps} */
	// let { data } = $props();
</script>

<!-- <h1>+page.svelte  pageHash {JSON.stringify(data)}</h1> -->

<About />
<Tags />
<!-- {#await data}
	<p>hold on, loading data...</p>
{:then value} -->
	<Projects />
<!-- {/await} -->

{#if false}
<pre><code>
<button
			on:click={(e) => {
				currentProject.click('#arttab.xyz');
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}}>#arttab.xyz</button> 
<button
			on:click={(e) => {
				currentProject.click('#networkeffect.io');
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}}>#networkeffect.io</button>

<b><i>Reactive</i></b>

$tag={$tag} $sortField={$sortField} $sortOrder={$sortOrder}
page.state: {JSON.stringify(page.state)}
$hashStore: {$hashStore}
$currentProject.title: {JSON.stringify($currentProject.title)}


<b><i>Static</i></b>

page.url.href: {page.url.href}
page.url.hash: {page.url.hash}
$tagControl: {$tagControl}
$p2 [{$p2.length}]: {JSON.stringify($p2)}
$p2Sorted [{$p2Sorted.length}]: {JSON.stringify($p2Sorted)}
$projectList [{$projectList.length}]: {JSON.stringify($projectList)}
</code></pre>
{/if}

<style>
    	/* pre {
		font: 11px/18px monospace;
		columns: 2;
		padding: 1rem;
		background-color: #333;
		margin: 1rem 0;
	}
	pre b {
		font-size: 1rem;
	}
	pre button {
		display: inline-block;
	} */
</style>
