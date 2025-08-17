<script>
	// @ts-nocheck

	import {
		hashStore,
		currentProject,
		pByKey,
		tag,
		sortField,
		sortOrder,
		p2,
		p2Sorted,
		projectList,
		tagControl
	} from '$lib/stores/stores.js';
	import { isEmpty, cleanHash } from '$lib/functions';

	/// "shallow routing" for project views
	// https://kit.svelte.dev/docs/shallow-routing
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import ProjectText from '$lib/components/Project-Text.svelte';
	import ProjectMedia from '$lib/components/Project-Media.svelte';

	// console.log('page.url.hash =', page.url.hash);

	if (page.url.hash) {
		// get current hash in URL
		hashStore.saveHash(cleanHash(page.url.hash));
		// if hash is a project
		if ($pByKey[$hashStore]) currentProject.setCurrent($hashStore);
		// otherwise assume a tag
		else projectList.updateFilters($hashStore, $sortField, $sortOrder);
	}

	// console.log('$currentProject', $currentProject);
	// console.log('$hashStore', $hashStore);
	// console.log('$pByKey[$hashStore]', $pByKey[$hashStore]);

	// executes after the component renders to the DOM
	onMount(() => {
		// console.log('onMount', document);
		// console.log('onMount() > page.url.hash =', page.url.hash);
	});
</script>

{#if !isEmpty($currentProject)}
	<section class="displayProject">
		<ProjectText item={$currentProject} projectView={true} />
		<ProjectMedia item={$currentProject} projectView={true} />
	</section>
{/if}

<section class="listOfLinks oneTwoColumns">
	{#each $p2Sorted as item}
		<div class="project">
			{#if item}
				<ProjectMedia {item} projectView={false} />
				<ProjectText {item} projectView={false} />
			{/if}
		</div>
	{/each}
</section>

<style>
	.listOfLinks {
		color: var(--gray-6);
	}

	.project {
		display: block;
		border-top: 1px dotted var(--violet-11);
		/* break-inside: avoid-column; */
	}

	.displayProject {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 0.5rem 0;
	}
	/* when a project displayed @ top */

	@media (min-width: 798px) {
		.displayProject {
			flex-direction: row;
			flex-wrap: wrap;
			width: 100%;
			margin: 0.5rem 1rem 2rem;
		}
	}

</style>
