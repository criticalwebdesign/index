<script>
	// @ts-nocheck

	import { tag, sortField, sortOrder, p2, p2Sorted, projectList, projectControl, tagControl } from '$lib/stores/stores.js';
	import { isEmpty, cleanHash } from '$lib/functions';

	// reactive
	// $: projects = $projectList;
	// $: (projects, console.log('projects has changed || page refreshed'));

	/// "shallow routing" for project views
	// https://kit.svelte.dev/docs/shallow-routing
	import { page } from '$app/state';
	import { hashStore, currentProject, pByKey } from '$lib/stores/stores.js';
	import { onMount } from 'svelte';
	import ProjectText from '$lib/components/Project-Text.svelte';
	import ProjectMedia from '$lib/components/Project-Media.svelte';

	console.log('page.url.hash =', page.url.hash);

	if (page.url.hash) {
		// get current hash in URL
		hashStore.saveHash(cleanHash(page.url.hash));
		// if hash is a project
		if ($pByKey[$hashStore]) projectControl.setCurrent($hashStore);
		// otherwise assume a tag
		else projectList.updateFilters($hashStore, $sortField, $sortOrder);
	}

	console.log('$hashStore', $hashStore);
	console.log('$pByKey[$hashStore]', $pByKey[$hashStore]);


	// // executes after the component renders to the DOM
	// onMount(() => {
	// 	console.log('onMount', document);
	// 	console.log('onMount() > page.url.hash =', page.url.hash);
	// });






</script>





<pre><code>
<button
    on:click={(e) => {
        projectControl.clickProject("#arttab.xyz");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }}>#arttab.xyz</button> 
<button
    on:click={(e) => {
        projectControl.clickProject("#networkeffect.io");
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }}>#networkeffect.io</button>


<b><i>Reactive</i></b>

page.state: {JSON.stringify(page.state)}<br>
$hashStore: {$hashStore}<br>
$currentProject: {JSON.stringify($currentProject)}<br>
   

<b><i>Static</i></b>

page.url.href: {page.url.href}<br>
page.url.hash: {page.url.hash}<br>
$tagControl: {$tagControl}<br>
$projectList: {JSON.stringify($projectList)}<br>

</code></pre>







{#if !isEmpty($currentProject)}
<section class="displayProject">
	<ProjectText item={$currentProject} projectView={true} />
	<ProjectMedia item={$currentProject} projectView={true} />
</section>
{/if}

<section class="listOfLinks oneTwoColumns">
	<!-- <pre>
		$tag={$tag} $sortField={$sortField} $sortOrder={$sortOrder}
	</pre> -->

	<!-- <pre><code>
		{JSON.stringify($projectList[0])}
	</code></pre> -->

	{#each $p2Sorted as item}
		<div class="project">
			{#if item}
				<ProjectText {item} projectView={false} />
				<ProjectMedia {item} projectView={false} />
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

    pre {
        font: 11px/11px monospace;
        columns: 2;
        padding: 1rem;
        background-color: #333;
        margin: 1rem 0;
    }
    pre b { font-size: 1rem; }
    pre button { display: inline-block;}
</style>
