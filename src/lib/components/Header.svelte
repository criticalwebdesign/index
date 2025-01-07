<script>
	// @ts-nocheck
	import { base } from '$app/paths';

	// update <title>
	import { page } from '$app/stores';
	import { hashStore, projectStore, showProject } from '$lib/stores/stores.js';
	import { unSlug } from '$lib/functions';

	const appName = 'Critical Web Design Index';
	$: title = [unSlug(...$page.url.pathname.split('/').slice(1)), appName].filter(Boolean).join(' | ');

	import TagsMultiSelect from '$lib/components/TagsMultiSelect.svelte';

	$: images = false;
	$: descriptions = false;

	function toggleMedia() {
		// toggle showMedia class on wrapper
		document.querySelector('.content').classList.toggle('showMedia');
		// let items = document.querySelector('.item.showMedia');
		// if (items) items.classList.toggle('showMedia');
		images = !images;
	}
	function toggleDescriptions() {
		document.querySelector('.content').classList.toggle('showDescriptions');
		let items = document.querySelector('.item.showDescriptions');
		if (items) items.classList.toggle('showDescriptions');
		descriptions = !descriptions;
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<header class="grid-outer sticky">
	<h1 class="brand vcenter">
		<a
			on:click={() => {
				hashStore.updateHash();
				showProject.set({});
				projectStore.updateFilters('all');
			}}
			href="{base}/">Critical Web Design Index</a>
		<!-- <small>v.1</small> -->
		<!-- <button class="count">{$projectStore.length}</button> -->
	</h1>

	<div class="tags">
		<TagsMultiSelect />
	</div>
	<div class="menu vcenter">
		<label for="showMediaBtn">
			<img src="{base}/assets/icon-image{images ? '-on' : ''}.svg" alt="descriptions icon" />
			<input type="checkbox" id="showMediaBtn" on:click={toggleMedia} />
		</label>

		<label for="showDescriptionsBtn">
			<img src="{base}/assets/icon-document{descriptions ? '-on' : ''}.svg" alt="images icon" />
			<input type="checkbox" id="showDescriptionsBtn" on:click={toggleDescriptions} />
		</label>

		<a href="{base}/about">
			<img src="{base}/assets/icon-info.svg" alt="about" />
		</a>
	</div>
</header>

<slot></slot>

<style>
	h1,
	h1 a:visited {
		margin: 0.25rem 0;
		font-weight: 500;
		font-size: var(--font-size-3);
		color: var(--indigo-4);
	}

	/* h1 button {
		padding: 0.3rem;
		font-size: small;
		background: var(--indigo-12);
		border-radius: 16px;
		height: 32px;
		display: inline-block;
	} */

	h1 a {
		text-decoration: none;
	}

	#showMediaBtn,
	#showDescriptionsBtn {
		height: 0;
		overflow: hidden;
		transition: height 300ms linear;
	}

	label {
		cursor: pointer;
	}

	#showMediaBtn,
	#showDescriptionsBtn {
		display: none;
	}

	.vcenter {
		display: flex;
		/* vertical  */
		align-items: center;
		/* horizontal */
		/* justify-content: center; */
		/* border: 3px solid green; */
	}

	.brand,
	.menu,
	.tags {
		/* background-color: red; */
		margin: 0.2rem 0;
		height: 30px;
	}
	.brand {
		/* background-color: var(--indigo-12); */
		grid-area: brand;
		font-size: var(--font-size-2);
	}
	.tags {
		/* background-color: var(--gray-12); */
		grid-area: tags;
	}
	.menu {
		/* background-color: var(--violet-12); */
		grid-area: menu;
		min-width: 120px;
		display: flex;
		justify-content: right;
	}
	.menu > * {
		display: inline-block;
		margin-left: 0.5rem;
		max-width: 1.55rem;
	}

	.grid-outer {
		box-sizing: content-box;
		display: grid;
		grid-template-columns: auto 120px;
		column-gap: 0px;
		grid-template-areas:
			'brand menu'
			'tags tags';
	}

	@media screen and (min-width: 576px) {
		.brand {
			font-size: var(--font-size-4);
		}
		.grid-outer {
			column-gap: 20px;
			grid-template-columns: 275px auto;
		}
	}

	@media screen and (min-width: 798px) {
		.menu > * {
			max-width: 1.9rem;
		}
		.grid-outer {
			grid-template-columns: 285px auto 120px;
			grid-template-areas: 'brand tags menu';
		}
	}
</style>
