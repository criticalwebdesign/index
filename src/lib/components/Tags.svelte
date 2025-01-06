<script>
	// @ts-nocheck

	import { isLegitTagName } from '$lib/functions';
	import { notesStore, tag, projectStore } from '$lib/stores/stores.js';
	import { get } from 'svelte/store';
	$: notes = $notesStore;
	import Tag from '$lib/components/Tag.svelte';

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

<section>
	<!-- Prints all the tags - now using MultiSelect search field -->
	<span class="tags">
		{#each Object.entries(notes) as [val, note]}
			{#if isLegitTagName(val)}
				<Tag {val} {note} />
			{/if}
		{/each}
	</span>

	<Breadcrumbs {crumbs}></Breadcrumbs>
</section>

<style>
	.tags {
		display: none;
	}
	@media screen and (min-width: 798px) {
		.tags {
			display: block;
		}
	}
</style>
