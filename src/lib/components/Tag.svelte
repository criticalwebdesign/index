<script>
	// @ts-nocheck
	export let val, note;
	// console.log(tag, note);
	import { page } from '$app/stores';
	import { tag, sortField, sortOrder, projectStore } from '$lib/stores/stores.js';
		// show button active https://learn.svelte.dev/tutorial/classes
		let active = false;
</script>

<button
	class="tag"
	class:active={$tag === val}
	title={note}
	data-tag={val}
	on:click={(e) => {
	console.log('current >', $tag, 'clicked > ', e.target.dataset.tag, val);
		// console.log(e.target.dataset.tag);
		// window.location.hash = val;
		// console.log($page);
		if ($tag == val) $sortOrder *= -1;
		projectStore.updateFilters(val, $sortField, $sortOrder);
	}}>
	{val.replace('-', ' ')}
	{#if $tag == val}
		{$sortOrder > 0 ? '↓' : '↑'}
	{/if}
</button>
<style>
	.tag {
		background: var(--violet-12);
		color: var(--indigo-5);
		min-width: 2rem;
		margin-right: 0.3rem;
	}

	.tag:hover {
		background: var(--violet-10);
		color: var(--indigo-3);
	}

	.tag.active {
		background: var(--violet-8);
		color: var(--indigo-2);
	}

	.tag.active:hover {
		background: var(--violet-9);
		color: var(--indigo-2);
	}
</style>