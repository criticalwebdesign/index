<script>
	// @ts-nocheck
	export let val, note;
	// console.log(tag, note);
	import { page } from '$app/stores';
	import { tag, sortField, sortOrder, projectStore } from '$lib/stores/stores.js';
</script>

<button
	class="tag"
	title={note}
	data-tag={val}
	on:click={(e) => {
		// console.log(e.target.dataset.tag);
		window.location.hash = val;
		// console.log($page);
		projectStore.updateFilters(val, $sortField, $sortOrder);
	}}>
	{val.replace('-', ' ')}
</button>
