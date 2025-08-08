<script>
	// @ts-nocheck
	export let item;
	export let projectView;
	import { getLink, getStrikeStatus, getDate, getUrlStatus, getEmoji } from '$lib/functions';
	import { base } from '$app/paths';
	import { tag, hashStore, projectList, projectControl, descriptionsVisible } from '$lib/stores/stores.js';
	// console.log('item', item);
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

			<!-- to add #project-hash to URL and show project details (image+text) at top of the page (e.g. a linkable project )-->

			<button
				on:click={(e) => {
					if ($hashStore != `#${item.slug}`) {
                        projectControl.clickProject(item.slug);

						// hashStore.pushHash(`#${item.slug}`);
                        // projectControl.setCurrent(item.slug);
						// projectList.updateFilters($tag);
					} else {
                        projectControl.removeProject();


						// hashStore.pushHash('');
						// projectControl.set({});
						// projectList.updateFilters($tag);
					}
					e.preventDefault();
					window.scrollTo({ top: 0, behavior: 'smooth' });
				}}
				class:hide={projectView}
				class="link">#</button>
		{/if}

		<!-- hide by default in list only -->
		{#if projectView || (!projectView && $descriptionsVisible)}
			<span class="projectDescription">
				{#if item.description}
					{item.description}
				{/if}
			</span>
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
		color: var(--gray-5);
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
		padding: 0 1rem 2rem 1rem;
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
