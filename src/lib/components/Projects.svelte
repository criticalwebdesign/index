<script>
	// @ts-nocheck

	import { tag, sortField, sortOrder, p2, p2Sorted, projectStore, count } from '$lib/stores/stores.js';
	import { get } from 'svelte/store';
	// reactive
	$: projects = $projectStore;
	import Project from '$lib/components/Project.svelte';

	$: projects, console.log('projects has changed');

	function update(_tag, _sortField, _sortOrder) {
		projects = projectStore.updateFilters(_tag, _sortField, _sortOrder);
		projects = projects;
		console.log('👉', projects[0].name);
	}

	/// "shallow routing" for project views
	// https://kit.svelte.dev/docs/shallow-routing
	import { page } from '$app/stores';
	import { showProject } from '$lib/stores/stores.js';
</script>

<section>
	<!-- {#if $page.state.showProjectOnLoad}
		{$page.state.showProjectOnLoad}
	{/if} -->
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

	<!-- {#if $showProject.name}
		{$showProject.name}
	{/if} -->

	<div class="content columns">
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
