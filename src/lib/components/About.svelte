<script>
	import { tag, hashStore, about } from '$lib/stores/stores.js';
	$: visible = false;
	if ($hashStore == 'about' || $tag == 'about') visible = true;
	else visible = false;
	console.log("$tag =", $tag, "$hashStore =", $hashStore);
</script>

{#if $about}
	<section>
		<h2>About</h2>

		<div class="oneTwoColumns">
			Critical Web Design is a broad category that includes internet art, creative activism, and cultural production.
			Works are coded, functional, and typically accessible via the internet or a web browser. The creators practiced
			design during production, combining text and graphics to engage visitors, implementing code for the sites'
			presentation and behavior, or in how they planned for intentional experiences, regardless how a visitor might
			categorize them as works of activism, humor, experimentation, art, or some combination thereof. This website
			presents and contextualizes such works using various themes, categories, and technologies, acknowledging the
			diverse creative practices that have emerged online, both within and outside the narrow definition of "Art".

			<br /><br />

			For more information see: <i>Critical Web Design</i> by xtine burrough and Owen Mundy (MIT Press, forthcoming)
		</div>

		<div>
			Code:
			<a href="https://github.com/omundy/critical-web-design-index" target="_blank">Github</a> <br />

			Curated by: <a href="https://owenmundy.com" target="_blank">Owen Mundy</a> <br />

			Contribute:
			<a href="https://github.com/omundy/critical-web-design-index/issues" target="_blank">Click "new issue"</a> <br /><br />

			Key: ✅ live 😿 broken 🗄 archived ❌ 404/spammed
		</div>
	</section>
{/if}

<style>
	section {
		padding-bottom: var(--size-4);
		border-bottom: 2px solid var(--gray-9);
		margin-bottom: var(--size-4);
	}
	div {
		margin: var(--size-3) 0;
	}
</style>
