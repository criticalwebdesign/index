<script>
	// @ts-nocheck

	import { readable } from 'svelte/store';
	// export const date = readable('today is: ' + new Date());
	import { projectList } from '$lib/stores/stores.js';
	import { page } from '$app/state';
	// console.log(page.params);
	let item;
	for (let i = 0; i < $projectList.length; i++) {
		if (page.params.slug == $projectList[i].slug) {
			item = $projectList[i];
			break;
		}
	}
</script>

<h1>{JSON.stringify(page.params.slug)}</h1>

<div class="">


This is a test. If the containing folder "slug" was named "[slug]" then it would be a route.


</div>
