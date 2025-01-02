<script>
	// @ts-nocheck

	import { tag, sortField, sortOrder, p2, p2Sorted, projectStore, urlStore, count, notesStore } from '$lib/stores/stores.js';
	import { get } from 'svelte/store';
	// reactive
	$: projects = $projectStore;
	import ProjectLink from '$lib/components/Project-Link.svelte';

	$: projects, console.log('projects has changed');

	function update(_tag, _sortField, _sortOrder) {
		projects = projectStore.updateFilters(_tag, _sortField, _sortOrder);
		projects = projects;
		console.log('👉', projects[0].title);
	}

	
	// import { onMount } from 'svelte';
	// $: url = $urlStore;
	// onMount(() => {
	// 	url = $urlStore;
	// });

	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	$: crumbs = [
		{
			url: '',
			title: $tag
		},
		{
			url: '',
			title: $notesStore[$tag]
		}
	];
</script>

<section class="links">
	<Breadcrumbs {crumbs}></Breadcrumbs>
	<div class="columns">
		{#each $p2Sorted as item}
			<ProjectLink {item} />
		{/each}
	</div>
</section>

<style>
	.links {
		color: var(--gray-6);
	}
</style>
