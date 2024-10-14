<script>
	// @ts-nocheck

	export let item;
	import { convertToSlug, getLink, getUrlStatus, getStrikeStatus, getEmoji, getAuthors } from '$lib/functions';
	import { base } from '$app/paths';

	/// "shallow routing" for project views
	// https://kit.svelte.dev/docs/shallow-routing
	import { goto, replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';

	import Title from '$lib/components/Project/Title.svelte';
	import Date from '$lib/components/Project/Date.svelte';
	import Authors from '$lib/components/Project/Authors.svelte';
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="item">
	<span class="title{getStrikeStatus(item.status)}">
		{@html getLink(item.title, getUrlStatus(item.status, item.url))}
	</span>
	{#if item.start > 0}
		<span class="date">
			{item.start + (item.end ? `–${item.end}` : '')}
		</span>
	{/if}

	{#if item.status}
		<span class="status" title={getEmoji(item.status)}>{item.status}</span>
	{/if}

	{#if item.author1}
		<span class="author">{@html getAuthors(item)}</span>
	{/if}

	{#if item.publisher}
		<span class="publisher">({@html getLink(item.publisher, item.publisherUrl)})</span>
	{/if}

	<span class="viewProject">
		<a href="{base + '/' + item.slug}" on:mouseenter={goto(base + '/' + item.slug)} aria-label="view project"> &rangle; </a>
	</span>
</div>

<style>
	.item {
		display: block;
		padding: 0.3rem 0;
		border-top: 1px dotted var(--violet-11);
		break-inside: avoid-column;
	}

	span {
		display: inline-block;
		padding: 0 0.08rem;
	}

	.viewProject {
		float: right;
	}
</style>
