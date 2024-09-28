<script>
	// @ts-nocheck

	import { isLegitTagName } from '$lib/functions';
	import { notesStore, tag, projectStore, count } from '$lib/stores/stores.js';
	import { get } from 'svelte/store';
	$: notes = $notesStore;
	import Tag from '$lib/components/Tag.svelte';

	function toggleMedia() {
		console.log('toggleMedia()');
		document.querySelector('.content').classList.toggle('showMedia');
	}
	function toggleDescriptions() {
		console.log('toggleDescriptions()');
		document.querySelector('.content').classList.toggle('showDescriptions');
	}
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
	<div class="notes">
		<!-- {$tag}
		{$sortOrder} -->

		→ <span>{$tag.replace('-', ' ')}</span>
		{#if $tag}
			→ {notes[$tag]}
		{/if}
	</div>
</section>
