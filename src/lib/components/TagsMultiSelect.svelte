<script>
	// @ts-nocheck

	import { tag, sortField, sortOrder, projectStore, notesStore } from '$lib/stores/stores.js';
	import { isLegitTagName } from '$lib/functions';

	import MultiSelect from 'svelte-multiselect';

	const tagsArray = Object.keys($notesStore)
		// filter only the tags
		.filter((tag) => isLegitTagName(tag))
		// case-insensitive sort
		.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

	// "all" to front
	tagsArray.unshift(tagsArray.splice(tagsArray.indexOf('all'), 1)[0]);

	// console.log('tagsArray', tagsArray);
	let selected = ['all'];
</script>

<MultiSelect
	bind:selected
	options={tagsArray}
	minSelect={1}
	maxSelect={1}
	--sms-options-bg="var(--violet-12)"
	--sms-text-color="var(--indigo-5)"
	--sms-max-width="15"
	let:option
	on:change={(event) => {
		console.log(`${event.detail.type}: '${event.detail.option}'`);
		if ($tag == event.detail.option) $sortOrder *= -1;
		projectStore.updateFilters(event.detail.option, $sortField, $sortOrder);
	}} />

<!-- <code style="display: inline-block;">{JSON.stringify(selected)}</code> -->

<style>
	/* .options * {
background-color: red !important;
} */
</style>
