<script>
	// @ts-nocheck
	export let item;
	// console.log(item);
	import { getEmoji } from '$lib/functions';
</script>

{#if item.start > 0}
	<span class="date">
		{item.start + (item.end ? `–${item.end}` : '')}
	</span>
{/if}

{#if item.status}
	<span class="status" title={getEmoji(item.status)}>{item.status}</span>
{/if}

<style>
	.date {
		color: var(--gray-6);
	}
	.status {
		cursor: pointer;
	}
</style>
