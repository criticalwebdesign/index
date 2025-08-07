<script>
	// @ts-nocheck

	import { tag, sortField, sortOrder, p2, p2Sorted, projectStore } from '$lib/stores/stores.js';
	import { isEmpty } from '$lib/functions';
	// reactive
	$: projects = $projectStore;

	$: projects, console.log('projects has changed || page refreshed');

	/// "shallow routing" for project views
	// https://kit.svelte.dev/docs/shallow-routing
	import { page } from '$app/state';
	import { hashStore, projectToShow, pByKey } from '$lib/stores/stores.js';
	import { onMount } from 'svelte';
	// executes after the component renders to the DOM
	onMount(() => {
		console.log('onMount', document);

		if (page.url.hash) {
			setTimeout(function () {
				// get current hash in URL
				hashStore.updateHash(`#${page.url.hash}`);
				// if hash is a project
				if ($pByKey[$hashStore]) projectToShow.set($pByKey[$hashStore]);
				// otherwise assume a tag
				else projectStore.updateFilters($hashStore, $sortField, $sortOrder);
			}, 1); // 1 "tick"
		}
	});

	import ProjectText from '$lib/components/Project-Text.svelte';
	import ProjectMedia from '$lib/components/Project-Media.svelte';
</script>

<p>page.url.hash: {page.url.hash}</p>
<p>$currentHash: {$currentHash}</p>
<p>$hashStore: {$hashStore}</p>
<div>$projectToShow: {JSON.stringify($projectToShow)}</div>
{#if !isEmpty($projectToShow)}
	<section class="displayProject">
		<ProjectText item={$projectToShow} projectView={true} />
		<ProjectMedia item={$projectToShow} projectView={true} />
	</section>
{/if}

<section class="listOfLinks oneTwoColumns">
	<!-- <pre>
		$tag={$tag} $sortField={$sortField} $sortOrder={$sortOrder}
	</pre> -->

	<!-- <pre><code>
		{JSON.stringify($projectStore[0])}
	</code></pre> -->

	{#each $p2Sorted as item}
		<div class="project">
			{#if item}
				<ProjectText {item} projectView={false} />
				<ProjectMedia {item} projectView={false} />
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
</style>
