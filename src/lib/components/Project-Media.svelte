<script>
	// @ts-nocheck
	export let item;
	export let projectView; // only appears in project view
	import { base } from '$app/paths';
	import { tag, mediaVisible } from '$lib/stores/stores.js';
	// console.log('item', item);
    let imgDir = "img";
    if (!projectView) imgDir += "_t";
</script>

{#if item && item.media}
	<div
		class="projectMedia"
		class:projectViewOnly={projectView}
		class:visible={projectView || (!projectView && $mediaVisible)}>
		{#each item.media.split(',') as m (m)}
			{#if m.includes('.gif') || m.includes('.jpg') || m.includes('.svg')}
				<a href="{base}/assets/img/{m}" target="_blank"
					><img src="{base}/assets/{imgDir}/{m}" alt="{item.title} media" /></a>
			{:else if m.includes('.mp4')}
				<!-- svelte-ignore a11y-media-has-caption -->
				<video src="{base}/assets/{imgDir}/{m}" alt="{item.title} media" controls></video>
			{:else}
				<!-- default to png -->
				<a href="{base}/assets/img/{m}.png" target="_blank"
					><img src="{base}/assets/{imgDir}/{m}.png" alt="{item.title} media" /></a>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.projectMedia {
		padding: 0.6rem 0 0.1rem 0;
		display: none;
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

	.visible {
		display: block;
	}
</style>
