<script>
	// @ts-nocheck
	export let item;
	// console.log(item);
	import { getLink, getUrlStatus, getStrikeStatus } from '$lib/functions';

	
</script>

<span class="title{getStrikeStatus(item.status)}">
	{@html getLink(item.title, getUrlStatus(item.status, item.url))}
</span>

<style>
	.title {
		color: var(--gray-5);
	}
</style>
