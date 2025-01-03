<script>
	// @ts-nocheck

	import { isLegitTagName } from '$lib/functions';
	import { notesStore, tag, projectStore, count } from '$lib/stores/stores.js';
	import { get } from 'svelte/store';
	$: notes = $notesStore;
	import Tag from '$lib/components/Tag.svelte';

	function toggleMedia() {
		document.querySelector('.content').classList.toggle('showMedia');
		let items = document.querySelector('.item.showMedia');
		if (items) items.classList.toggle('showMedia');
	}
	function toggleDescriptions() {
		document.querySelector('.content').classList.toggle('showDescriptions');
		let items = document.querySelector('.item.showDescriptions');
		if (items) items.classList.toggle('showDescriptions');
	}

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
	<span class="tags">
		{#each Object.entries(notes) as [val, note]}
			{#if isLegitTagName(val)}
				<Tag {val} {note} />
			{/if}
		{/each}
	</span>
	<!-- <span class="sortMethods">
		Sort by:
		<button class="sort" id="byName">name</button>
		<button class="sort" id="byStartDate">date</button>
	</span> -->
	<span class="show">
		<!-- Show: -->
		<label for="showDescriptionsBtn">📄</label>
		<input type="checkbox" id="showDescriptionsBtn" on:click={toggleDescriptions} />
		<label for="showMediaBtn">🖼️</label>
		<input type="checkbox" id="showMediaBtn" on:click={toggleMedia} />
	</span>

	<Breadcrumbs {crumbs}></Breadcrumbs>

</section>