<script>
	// @ts-nocheck

	export let item;
	export let projectView; // only appears in project view
	import { isLegitTagName } from '$lib/functions';
	import { projectList, sortField, sortOrder, tagControl } from '$lib/stores/stores.js';

	// console.log('item.tags', item.tags);
</script>

{#if item.tags}
	<span class="projectTags" class:projectViewOnly={projectView}>
		{#each item.tags as tag}
			{#if tag != 'all' && isLegitTagName(tag)}
				<button
					class="tag"
					data-tag={tag}
					on:click={(e) => {
						// console.log('current >', tag);

						// display tag
						projectList.updateFilters(tag, $sortField, $sortOrder);
						// update hash in url
						tagControl.clickTag(`#${tag}`);

						e.preventDefault();
					}}>
					{tag.replace('-', ' ')}
				</button>
			{/if}
		{/each}
	</span>
{/if}

<style>
	.tag {
		background-color: transparent;
		border: 1px solid var(--violet-12);
		color: var(--indigo-5);
		min-width: 2rem;
		margin-right: 0.3rem;
	}

	.tag:hover {
		background: transparent;
		color: var(--indigo-3);
	}

	.tag.active {
		background: transparent;
		color: var(--indigo-2);
	}

	.tag.active:hover {
		background: transparent;
		color: var(--indigo-2);
	}
</style>
