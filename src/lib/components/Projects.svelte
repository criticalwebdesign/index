<script>
	// @ts-nocheck

	import { tag, sortField, sortOrder, p2, p2Sorted, projectStore } from '$lib/stores/stores.js';

	// reactive
	$: projects = $projectStore;
	import Project from '$lib/components/Project.svelte';

	$: projects, console.log('projects has changed');

	// function update(_tag, _sortField, _sortOrder) {
	// 	projects = projectStore.updateFilters(_tag, _sortField, _sortOrder);
	// 	projects = projects;
	// 	console.log('👉', projects[0].title);
	// }

	/// "shallow routing" for project views
	// https://kit.svelte.dev/docs/shallow-routing
	import { page } from '$app/stores';
	import { hashStore, showProject, pByKey } from '$lib/stores/stores.js';
	import { onMount } from 'svelte';
	// executes after the component renders to the DOM
	onMount(() => {
		console.log('onMount', document);
		if ($page.url.hash) {
			setTimeout(function () {
				// get current hash in URL
				hashStore.updateHash($page.url.hash);
				// if hash is a project
				if ($pByKey[$hashStore]) showProject.set($pByKey[$hashStore]);
				// otherwise assume a tag
				else projectStore.updateFilters($hashStore, $sortField, $sortOrder);
			}, 1); // 1 "tick"
		}
	});
</script>

<section>
	<!-- <p>hash loaded: {$page.url.hash}</p> -->
	<!-- <p>hash in store: {$hashStore}</p> -->
	<!-- <div>$showProject: {JSON.stringify($showProject)}</div> -->

	<div class="showProject">
		<Project item={$showProject} />
	</div>

	<!-- <div>
		{$tag}
		{$sortField}
		{$sortOrder}
	</div> -->
	<!-- <div>
		Sort by:
		<button
			on:click={() => {
				if ($sortField == 'name') $sortOrder *= -1;
				update($tag, 'name', $sortOrder);
			}}>
			Name
			{#if $sortField == 'name'}
				{$sortOrder > 0 ? '↓' : '↑'}
			{/if}
		</button>
		<button
			on:click={() => {
				if ($sortField == 'start') $sortOrder *= -1;
				update($tag, 'start', $sortOrder);
			}}>
			Date
			{#if $sortField == 'start'}
				{$sortOrder > 0 ? '↓' : '↑'}
			{/if}
		</button>
	</div> -->
	<!-- <div>
		<button
			on:click={() => {
				changeFilter('all');
			}}>
			Filter all
		</button>
		<button
			on:click={() => {
				changeFilter('usability');
			}}>
			Filter usability
		</button>
	</div> -->

	<!-- <div>
		<p>{JSON.stringify($projectStore[0])}</p>
	</div> -->

	<div class="content oneTwoColumns">
		{#each $p2Sorted as item}
			<Project {item} />
		{/each}
		<!-- {#each projects as item}
			<Project {item} />
		{/each} -->
		<!-- {#each $projectStore as item, index}
			<Project {item} />
		{/each} -->
	</div>
</section>

<style>
	/* define globally, though only used if project is showing */
	.showProject :global(.item) {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		width: 100%;
		margin: 0.5rem 0 2rem;
	}
	.showProject :global(.item .projectText),
	.showProject :global(.item .projectMedia) {
		display: flex;
		flex-direction: column;
		flex-basis: 100%;
		flex: 1;
	}
	.showProject :global(.item .projectMedia) {
		/* background-color: rgb(0, 255, 221); */
		order: 1;
	}
	.showProject :global(.item .projectText) {
		/* background-color: rgb(255, 0, 153); */
		order: 2;
		padding: 0 0.5rem;
	}
</style>
