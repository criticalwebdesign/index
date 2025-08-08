<script>
	// @ts-nocheck
	import { base } from '$app/paths';

	// update <title>
	import { page } from '$app/state';
	import {
        pageControl,
		projectList,
		mediaVisible,
		descriptionsVisible
	} from '$lib/stores/stores.js';
	import { unSlug, cleanHash } from '$lib/functions';
	const appName = 'Critical Web Design Index';
	$: title = cleanHash(page.url.href) + [unSlug(...page.url.pathname.split('/').slice(1)), appName].filter(Boolean).join(' | ');

	import TagsMultiSelect from '$lib/components/TagsMultiSelect.svelte';

	// buttons to enable media and/or descriptions inside list
	function toggleMedia(e) {
		mediaVisible.set(!$mediaVisible);
		e.preventDefault();
	}
	function toggleDescriptions(e) {
		// console.log($descriptionsVisible);
		descriptionsVisible.set(!$descriptionsVisible);
		e.preventDefault();
	}
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<header class="grid-outer sticky">
	<h1 class="brand vcenter">
		<a
			on:click={() => {
                pageControl.clickHome();
			}}
			href="{base}/">Critical Web Design Index</a>
		<!-- <small>v.1</small> -->
		<!-- <button class="count">{$projectList.length}</button> -->
	</h1>

	<div class="tags">
		<!-- <TagsMultiSelect /> -->
	</div>
	<div class="menu vcenter">
		<label for="showMediaBtn">
			<img src="{base}/assets/icons/icon-image{$mediaVisible ? '-on' : ''}.svg" alt="enable media icon" />
			<input type="checkbox" id="showMediaBtn" on:click={toggleMedia} />
		</label>

		<label for="showDescriptionsBtn">
			<img
				src="{base}/assets/icons/icon-document{$descriptionsVisible ? '-on' : ''}.svg"
				alt="enable descriptions icon" />
			<input type="checkbox" id="showDescriptionsBtn" on:click={toggleDescriptions} />
		</label>

		<a
			on:click={(e) => {
                pageControl.clickAbout();
			}}
			href="{base}/"><img src="{base}/assets/icons/icon-info.svg" alt="about" /></a>
	</div>
</header>

<slot></slot>

<style>
	#showMediaBtn,
	#showDescriptionsBtn {
		/* hide the checkbox that stores boolean */
		height: 0;
		overflow: hidden;
		transition: height 300ms linear;
		display: none;
	}

	label {
		cursor: pointer;
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
