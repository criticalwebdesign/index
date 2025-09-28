<script>
	// @ts-nocheck
	export let item;
	export let projectView; // only appears in project view
	import { getLink, getStrikeStatus, getDate, getUrlStatus, getEmoji } from '$lib/functions';
	import { base } from '$app/paths';
	import { tag, hashStore, currentProject, descriptionsVisible } from '$lib/stores/stores.js';
	// console.log('item', item);
	import ProjectTags from '$lib/components/Project-Tags.svelte';
</script>

{#if item}
	<div class="projectText" class:projectViewOnly={projectView}>
		{#if item.title}
			<span class="name {getStrikeStatus(item.status)}">
				{@html getLink(item.title, getUrlStatus(item.status, item.url))}
			</span>
		{/if}

		{#if item.start > 0}
			<span class="date">
				{@html getDate(item.start, item.end, !projectView)}
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
			<span class="publisher">
				{@html getLink(item.publisher, item.publisherUrl)}
			</span>
		{/if}

		{#if item.media || item.description}
			<!-- # adds hash to URL for (linkable) project details (image+text) -->
			<button
				on:click={(e) => {
					currentProject.click(item.slug);
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}}
				class:hide={projectView}
				class="link">#</button>
		{/if}

		<!-- hide by default in list only -->
		{#if projectView || (!projectView && $descriptionsVisible)}
			<div class="projectDescription">
				{#if item.description}
					{@html item.description}
				{/if}
			</div>
		{/if}

		{#if projectView}
			<ProjectTags item={$currentProject} projectView={true} />
		{/if}

		{#if projectView && item.moreinfo1}
			<div class="date">
				Related:
                [{#if item.moreinfo1}{@html getLink('1', item.moreinfo1)}{/if}]
                [{#if item.moreinfo2}{@html getLink('2', item.moreinfo2)}{/if}]
                [{#if item.moreinfo3}{@html getLink('3', item.moreinfo3)}{/if}]
			</div>
		{/if}
	</div>
{/if}

<style>
	div {
		padding: 0.4rem 0;
	}

	button {
		display: inline-block;
	}

	.title {
		color: var(--gray-3);
	}

	.status {
		cursor: pointer;
	}

	.date {
		color: var(--gray-6);
	}

	.author {
		color: var(--gray-5);
		display: inline;
	}

	.publisher {
		font-style: italic;
	}

	.strike {
		text-decoration: line-through;
		color: var(--gray-6);
	}

	.link {
		padding: 0 0.2rem 0 0;
		background-color: transparent;
	}

	.projectViewOnly {
		/* background-color: rgb(255, 0, 153); */
		display: flex;
		flex-direction: column;
		flex-basis: 100%;
		flex: 1;
		order: 2;
		padding: 0 1rem 2rem 0;
	}

	@media (min-width: 798px) {
		.projectViewOnly {
			margin: 0;
		}
	}

	.projectViewOnly .name {
		font-size: var(--font-size-4);
		line-height: var(--font-lineheight-4);
	}

	.hide {
		display: none;
	}
</style>
