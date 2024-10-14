<script>
	// @ts-nocheck
	export let item;
	// console.log(item);
	import { convertToSlug, getLink } from '$lib/functions';
</script>

{#if item.author1}
	<span class="author">
		{@html getLink(item.author1, item.author1Url)}{#if item.author2},
			{@html getLink(item.author2, item.author2Url)}{/if}{#if item.author3},
			{@html getLink(item.author3, item.author3Url)}{/if}{#if item.author4},
			{@html getLink(item.author4, item.author4Url)}{/if}
	</span>
{/if}

<style>
	.author {
		color: var(--gray-5);
		display: inline;
	}
</style>
