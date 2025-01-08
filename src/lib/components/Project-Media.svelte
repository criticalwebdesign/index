<script>
	// @ts-nocheck
	export let item;
	export let projectView;
	import { base } from '$app/paths';
	import { tag, hashStore, projectStore, projectToShow, mediaVisible } from '$lib/stores/stores.js';
	// console.log('item', item);
</script>

{#if item && item.media}
	<!-- hide by default in list only -->
	{#if projectView || (!projectView && $mediaVisible)}
		<div class="projectMedia" class:projectViewOnly={projectView}>
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
		</div>
	{/if}
{/if}

<style>
	.projectMedia {
		padding: 0.4rem 0;
	}

	.projectMedia * {
		width: 100%;
	}

	.projectViewOnly {
		background-color: rgb(0, 255, 221);
		display: flex;
		flex-direction: column;
		flex-basis: 100%;
		flex: 1;
		order: 1;
		padding: 0;
		margin: 1rem;
	}

	@media (min-width: 798px) {
		.projectViewOnly {
			margin: 0;
		}
	}
</style>
