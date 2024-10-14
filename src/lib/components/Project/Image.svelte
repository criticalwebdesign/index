<script>
	// @ts-nocheck
	export let item;
	// console.log("Image, item", item)
	import { convertToSlug } from '$lib/functions';
	import { base } from '$app/paths';
</script>

<div>
	{#if item.media != ''}
		<span class="media">
			{#each item.media.split(',') as m (m)}
				<!-- <a href="{base}/assets/img/{m}.png"> -->
				<a href="{base}/{item.slug}">
					<img src="{base}/assets/img_t/{m}.png" alt="{item.title} media" />
				</a>
			{/each}
		</span>
	{/if}
</div>

<style>
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
