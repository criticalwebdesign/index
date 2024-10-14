<script>
	// @ts-nocheck


	import { base } from '$app/paths';
	import { projectStore } from '$lib/stores/stores.js';
	import { page } from '$app/stores';
	import { unSlug, getObjectFromSlug } from '$lib/functions';

	const appName = 'Critical Web Design Index';



	/// "shallow routing" for project views
	// https://kit.svelte.dev/docs/shallow-routing
	import { currentProject } from '$lib/stores/stores.js';





	$: current = $currentProject;
	// $: current, console.log("currentProject", $currentProject)


	$: title = [unSlug(...$page.url.pathname.split('/').slice(1)), appName].filter(Boolean).join(' | ');

	$: slug = $page.params.slug
	$: slug, update(slug)
	


	function update(_slug){
		let p = getObjectFromSlug($projectStore, $page.params.slug);
		current = currentProject.update(v => (p))
		console.log("update()", _slug, p)
	}


	




	// store current project (if visible)
	// - also used as reactive class to change layout
	$: projectVisible = $page.params.slug && $page.params.slug !== '';





	import Tags from '$lib/components/Tags.svelte';
	import Links from '$lib/components/Links.svelte';
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div class="container" class:projectVisible>
	<header>
		<h1>
			<a href="{base}/">Critical Web Design Index</a>
		</h1>
	</header>

	<Tags />

	<Links />

	<slot></slot>

	<footer>
		<span class="version">version 1.0</span>
		<button class="count">{$projectStore.length}</button>
		<a href="{base}/about"><img src="{base}/assets/icon-info.svg" alt="about" /></a>
	</footer>
</div>

<style>
	/* .projectVisible {
		background-color: red;
	} */
	footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 60px;
		text-align: right;
		/* flex contents */
		display: flex;
		justify-content: right;
		align-items: center;
		gap: 10px;
	}

	footer img {
		width: 1.2rem;
	}
	footer * {
		display: inline-block;
	}

	footer button {
		vertical-align: 1rem;
		padding: 0.3rem;
		font-size: small;
		background: var(--violet-12);
	}
	footer .version {
		font-size: small;
	}
</style>
