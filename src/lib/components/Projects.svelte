<script>
	// @ts-nocheck

	import { tag, sortField, sortOrder, p2, p2Sorted, projectStore, count } from '$lib/stores/stores.js';
	import { get } from 'svelte/store';
	// reactive
	$: projects = $projectStore;
	import ProjectLink from '$lib/components/ProjectLink.svelte';

	$: projects, console.log('projects has changed');

	function update(_tag, _sortField, _sortOrder) {
		projects = projectStore.updateFilters(_tag, _sortField, _sortOrder);
		projects = projects;
		console.log('👉', projects[0].name);
	}
</script>

<!-- {JSON.stringify(projects)} -->

<!-- <p>The count is {$count}</p>
<button on:click={count.increment}>+</button>
<button on:click={count.decrement}>-</button>
<button on:click={count.reset}>reset</button> -->

<section>
	<div>
		{$tag}
		{$sortField}
		{$sortOrder}
	</div>
	<div>
		Sort by:
		<button
			on:click={() => {
				if ($sortField == 'name') $sortOrder *= -1;
				update($tag, 'name', $sortOrder);
			}}>
			Name
			{#if $sortField == 'name'}
				{$sortOrder > 0 ? '↑' : '↓'}
			{/if}
		</button>
		<button
			on:click={() => {
				if ($sortField == 'start') $sortOrder *= -1;
				update($tag, 'start', $sortOrder);
			}}>
			Date
			{#if $sortField == 'start'}
				{$sortOrder > 0 ? '↑' : '↓'}
			{/if}
		</button>
	</div>
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

	<div class="content columns">
		{#each $p2Sorted as item}
			<ProjectLink {item} />
		{/each}
		<!-- {#each projects as item}
			<ProjectLink {item} />
		{/each} -->
		<!-- {#each $projectStore as item, index}
			<ProjectLink {item} />
		{/each} -->
	</div>
</section>
