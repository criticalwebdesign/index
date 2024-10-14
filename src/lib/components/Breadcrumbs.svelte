<script>
	// @ts-nocheck
	export let crumbs;
	// console.log(crumbs);
</script>

<!-- <pre>{JSON.stringify(crumbs)} </pre> -->

<!-- → <span>{tag.replace('-', ' ')} xxxx</span> -->

{#if Array.isArray(crumbs)}
	<div class="breadcrumbs">
		{#each crumbs as c}
			<span> → </span>
			<span>
				{#if c.url}
					<a href={c.url}>
						{c.title}
					</a>
				{:else}
					{c.title}
				{/if}
			</span>
		{/each}
	</div>
{/if}

<style>
	.breadcrumbs {
		color: var(--gray-6);
		margin-top: 0.5rem;
		border-top: 1px dotted var(--gray-7);
		padding: 0.5rem 0;
	}

	.breadcrumbs span {
		color: var(--gray-6);
	}
</style>
