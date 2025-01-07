<script>
	// @ts-nocheck
	export let item;
	import { getLink, getStrikeStatus, getUrlStatus, getEmoji } from '$lib/functions';
	import { base } from '$app/paths';
	import { tag, hashStore, projectStore, showProject } from '$lib/stores/stores.js';
	// console.log('item', item);
</script>

<div class="item">
	{#if item}
		<span class="projectText">
			{#if item.title}
				<span class="name {getStrikeStatus(item.status)}">
					{@html getLink(item.title, getUrlStatus(item.status, item.url))}
				</span>
			{/if}

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

			{#if item.media || item.description}
				<!-- For [slug]/page.html type routing -->
				<!-- <span><a href="{base}/{item.slug}" class="link">#</a></span> -->

				<!-- to toggle image in project list -->
				<!-- <span>
					<button
						on:click={() => {
							toggleProject(item);
						}}
						class="link">#</button>
				</span> -->

				<!-- to add #project-hash to URL and show projecvt details (image+text) at top of the page (e.g. a linkable project )-->
				<span>
					<button
						on:click={() => {
							hashStore.updateHash(item.slug);
							showProject.set(item);
							projectStore.updateFilters($tag);
						}}
						class="link">#</button>
				</span>
			{/if}
		</span>
		<span class="projectMedia">
			{#if item.media}
				<span class="media">
					{#each item.media.split(',') as m (m)}
						{#if m.includes('.gif') || m.includes('.jpg')}
							<a href="{base}/assets/img/{m}" target="_blank"
								><img src="{base}/assets/img_t/{m}" alt="{item.title} media" /></a>
						{:else if m.includes('.mp4')}
							<!-- svelte-ignore a11y-media-has-caption -->
							<video src="{base}/assets/img_t/{m}" alt="{item.title} media" controls></video>
						{:else}
							<a href="{base}/assets/img/{m}.png" target="_blank"
								><img src="{base}/assets/img_t/{m}.png" alt="{item.title} media" /></a>
						{/if}
					{/each}
				</span>
			{/if}

			{#if item.description}
				<span class="description">{item.description}</span>
			{/if}
		</span>
	{/if}
</div>

<style>
	.item {
		display: block;
		padding: 0.3rem 0;
		border-top: 1px dotted var(--violet-11);
		break-inside: avoid-column;
	}

	.item span {
		display: inline-block;
		padding: 0 0.08rem;
	}

	.item .title {
		color: var(--gray-5);
	}

	.item .status {
		cursor: pointer;
	}

	.item .date {
		color: var(--gray-6);
	}

	.item .author {
		color: var(--gray-5);
		display: inline;
	}

	.item .strike {
		text-decoration: line-through;
		color: var(--gray-6);
	}

	.item .tags {
		color: var(--gray-7);
	}

	.item .description {
		display: none;
	}

	.item .media {
		display: none;
	}

	.content.showMedia .item .media,
	.content .item.showMedia .media {
		margin: 0.5rem 0;
		display: block;
	}

	.content.showDescriptions .item .description,
	.content .item.showDescriptions .description {
		margin: 0.5rem 0;
		display: block;
	}

	.media * {
		width: 100%;
	}

	.link {
		padding: 0 0.25rem 0 0;
		background-color: transparent;
	}
</style>
