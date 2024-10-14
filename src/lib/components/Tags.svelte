<script>
	// @ts-nocheck

	import { base } from '$app/paths';
	import { notesStore, tag, projectStore, count } from '$lib/stores/stores.js';
	import { get } from 'svelte/store';
	import { isLegitTagName } from '$lib/functions';

	$: notes = $notesStore;
	import Tag from '$lib/components/Tag.svelte';
</script>

<section class="tags sticky">
	<span class="">
		{#each Object.entries(notes) as [val, note]}
			{#if isLegitTagName(val)}
				<Tag {val} {note} />
			{/if}
		{/each}
	</span>
</section>

<style>
	.tags {
		color: var(--gray-7);
	}
</style>
