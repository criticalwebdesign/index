<!-- <script>
	// @ts-nocheck
	import { readable } from 'svelte/store';
	// export const date = readable('today is: ' + new Date());
	import { projectStore } from '$lib/stores/stores.js';
	import { page } from '$app/stores';
	// console.log($page.params);
	let item;
	for (let i = 0; i < $projectStore.length; i++) {
		if ($page.params.slug == $projectStore[i].slug) {
			item = $projectStore[i];
			break;
		}
	}
	import ProjectLink from '$lib/components/ProjectLink.svelte';
</script> -->

<!-- <h1>{JSON.stringify($page.params.slug)}</h1> -->

<!-- <div class="content showMedia showDescriptions">
	<ProjectLink {item} />
</div> -->
