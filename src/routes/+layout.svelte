<script>
	// @ts-nocheck
	import { base } from '$app/paths';

	// update <title>
	import { page } from '$app/stores';
	import { projectStore } from '$lib/stores/stores.js';
	import { unSlug } from '$lib/functions';
	const appName = 'Critical Web Design Index';
	$: title = [unSlug(...$page.url.pathname.split('/').slice(1)), appName].filter(Boolean).join(' | ');
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<header>
	<h1>
		<a href="{base}/">Critical Web Design Index</a>
		<small>v.1</small>
		<button class="count">{$projectStore.length}</button>
	</h1>
	<div class="menu">
		<a href="{base}/about"><img src="{base}/assets/icon-info.svg" alt="about" /></a>
	</div>
</header>

<slot></slot>
