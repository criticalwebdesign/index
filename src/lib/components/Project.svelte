<script>
	// @ts-nocheck
	export let item;
	import { convertToSlug, getLink, getStrikeStatus, getUrlStatus, getEmoji } from '$lib/functions';
	import { base } from '$app/paths';

	/// "shallow routing" for project views
	// https://kit.svelte.dev/docs/shallow-routing
	import { replaceState } from '$app/navigation';
	import { page } from '$app/stores';
	import { get } from 'svelte/store';
	import { showProject } from '$lib/stores/stores.js';
	$: showProjectDetails = '';
	function toggleProject(item) {
		if (showProjectDetails) {
			showProject.set({});
			showProjectDetails = '';
			replaceState(`${base}/`, { showProjectOnLoad: false });
		} else {
			showProject.set(item);
			showProjectDetails = 'showMedia showDescriptions';
			replaceState(`${base}/${item.slug}`, { showProjectOnLoad: true });
		}
	}
</script>

<div class="item {showProjectDetails}">
	<span class="name{getStrikeStatus(item.status)}">
		{@html getLink(item.title, getUrlStatus(item.status, item.url))}
	</span>

	{#if item.start > 0}
		<span class="date">
			({item.start + (item.end ? `–${item.end}` : '')})
		</span>
	{/if}

	{#if item.status}
		<span class="status" title={getEmoji(item.status)}>{item.status}</span>
	{/if}

	{#if item.author1}
		<span class="author">
			{@html getLink(item.author1, item.author1Url)}{#if item.author2}, {@html getLink(
					item.author2,
					item.author2Url
				)}{/if}{#if item.author3}, {@html getLink(item.author3, item.author3Url)}{/if}{#if item.author4}, {@html getLink(
					item.author4,
					item.author4Url
				)}{/if}
		</span>
	{/if}

	{#if item.publisher}
		<span class="publisher">({@html getLink(item.publisher, item.publisherUrl)})</span>
	{/if}

	<span><a href="{base}/{convertToSlug(item.title)}" class="link">#</a></span>
	<span>
		<button
			on:click={() => {
				toggleProject(item);
			}}
			class="link">#</button
		></span>
	<!-- href="{base}/{convertToSlug(item.title)}" -->

	{#if item.media != ''}
		<span class="media">
			{#each item.media.split(',') as m (m)}
				<a href="{base}/assets/img/{m}.png" target="_blank"
					><img src="{base}/assets/img_t/{m}.png" alt="{item.title} media" /></a>
			{/each}
		</span>
	{/if}
	{#if item.description}
		<span class="description">{item.description}</span>
	{/if}
</div>
