<script>
	// @ts-nocheck

	import { base } from '$app/paths';
	import { projectStore, currentProject } from '$lib/stores/stores.js';
	import { page } from '$app/stores';
	import { getLink, getUrlStatus, getStrikeStatus, getObjectFromSlug, getEmoji, getAuthors } from '$lib/functions';

	$: p = $currentProject;
	// $: p, console.log('p', p);

	// [params] are received from the [slug] route
	// console.log('$page.params', $page.params);
	// console.log('$page.url', $page.url);

	// find the item in the store (slow?)
	let item = getObjectFromSlug($projectStore, $page.params.slug);
	// console.log('item', item);

	import ProjectImage from '$lib/components/Project/Image.svelte';
	import Title from '$lib/components/Project/Title.svelte';
	import Date from '$lib/components/Project/Date.svelte';
	import Authors from '$lib/components/Project/Authors.svelte';
</script>

<!-- {JSON.stringify($page.params.slug)} -->

<section class="project">
	<div>
		{#if p.media != ''}
			<span class="media">
				{#each p.media.split(',') as m (m)}
					<!-- <a href="{base}/assets/img/{m}.png"> -->
					<a href="{base}/{p.slug}">
						<img src="{base}/assets/img_t/{m}.png" alt="{p.title} media" />
					</a>
				{/each}
			</span>
		{/if}
	</div>
	<div>
		<h4>
			<span class="title {getStrikeStatus(p.status)}">
				{@html getLink(p.title, getUrlStatus(p.status, p.url))}
			</span>
		</h4>
		<h6>
			{#if p.author1}
				<span class="author">{@html getAuthors(p)}</span>
			{/if}
		</h6>
		<h6>
			{#if p.start > 0}
				<span class="date">
					{p.start + (p.end ? `–${p.end}` : '')}
				</span>
			{/if}

			{#if p.status}
				<span class="status" title={getEmoji(p.status)}>{p.status}</span>
			{/if}
		</h6>

		{#if p.publisher}
			<span class="publisher">({@html getLink(p.publisher, p.publisherUrl)})</span>
		{/if}

		{#if p.description}
			<span class="description">{p.description}</span>
		{/if}
	</div>
</section>

<style>
	h4,
	h6 {
		font-weight: normal;
		margin-bottom: 0.5rem;
	}
	.project {
		display: flex;
		gap: 1rem;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: stretch;
	}
	.project > * {
		flex: 1;
	}
	@media (min-width: 800px) {
		.project {
			flex-direction: row;
		}
	}
	@media (min-width: 1100px) {
		.project {
			flex-direction: column;
		}
		.project > * {
			flex: 0;
		}
	}

	a,
	a:link,
	a:active,
	a:visited {
		text-decoration: none;
		color: var(--gray-7) !important;
	}
	a:hover {
		text-decoration: none;
		color: var(--indigo-5);
	}
	img {
		width: 100%;
	}
</style>
