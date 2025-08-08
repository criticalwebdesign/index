<script>
	// @ts-nocheck

	import { tag, sortField, sortOrder, p2, p2Sorted, projectList, tagControl } from '$lib/stores/stores.js';
	import { isEmpty, cleanHash } from '$lib/functions';

	// reactive
	// $: projects = $projectList;
	// $: (projects, console.log('projects has changed || page refreshed'));

	/// "shallow routing" for project views
	// https://kit.svelte.dev/docs/shallow-routing
	import { page } from '$app/state';
	import { hashStore, currentProject, pByKey } from '$lib/stores/stores.js';
	import { onMount } from 'svelte';
	import ProjectText from '$lib/components/Project-Text.svelte';
	import ProjectMedia from '$lib/components/Project-Media.svelte';

	console.log('page.url.hash =', page.url.hash);

	if (page.url.hash) {
		// get current hash in URL
		hashStore.saveHash(cleanHash(page.url.hash));
		// if hash is a project
		if ($pByKey[$hashStore]) currentProject.setCurrent($hashStore);
		// otherwise assume a tag
		else projectList.updateFilters($hashStore, $sortField, $sortOrder);
	}

	console.log('$currentProject', $currentProject);
	console.log('$hashStore', $hashStore);
	// console.log('$pByKey[$hashStore]', $pByKey[$hashStore]);

	// // executes after the component renders to the DOM
	// onMount(() => {
	// 	console.log('onMount', document);
	// 	console.log('onMount() > page.url.hash =', page.url.hash);
	// });
</script>

<!-- <pre><code>
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
</code></pre> -->

{#if !isEmpty($currentProject)}
	<section class="displayProject">
		<ProjectText item={$currentProject} projectView={true} />
		<ProjectMedia item={$currentProject} projectView={true} />
	</section>
{/if}

<section class="listOfLinks oneTwoColumns">
	{#each $p2Sorted as item}
		<div class="project">
			{#if item}
				<ProjectMedia {item} projectView={false} />
				<ProjectText {item} projectView={false} />
			{/if}
		</div>
	{/each}
</section>

<style>
	.listOfLinks {
		color: var(--gray-6);
	}

	.project {
		display: block;
		border-top: 1px dotted var(--violet-11);
		/* break-inside: avoid-column; */
	}

	.displayProject {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0.5rem 0;
	}
	/* when a project displayed @ top */

	@media (min-width: 798px) {
		.displayProject {
			flex-direction: row;
			flex-wrap: wrap;
			width: 100%;
			margin: 0.5rem 1rem 2rem;
		}
	}

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
