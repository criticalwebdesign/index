<script>
	// @ts-nocheck
	export let item;
	import { convertToSlug } from '$lib/functions';
	import { base } from '$app/paths';

	function getStrikeStatus(s) {
		if (s.includes('❌')) return ' strike';
	}
	function getUrlStatus(s, url) {
		if (s.includes('❌')) return '';
		else return url;
	}

	function getEmoji(s) {
		let emojiAlt = '';
		if (s.includes('❌')) {
			emojiAlt = 'Project URL is not safe to visit';
		} else if (s.includes('😿')) {
			emojiAlt = 'Project is broken';
		} else if (s.includes('🗄')) {
			emojiAlt = 'Project archived';
		} else {
			emojiAlt = 'Project is live'; // ✅
		}
		return emojiAlt;
	}

	function getLink(name, url, blank = true) {
		if (!url) return name.trim();
		else return `<a href="${url.trim()}" ${blank ? 'target="_blank"' : ''}>${name.trim()}</a>`;
	}
</script>

<div class="item">
	{#if item.media != ''}
		<span class="media">
			{#each item.media.split(',') as m (m)}
				<a href="{base}/assets/img/{m}.png" target="_blank"
					><img src="{base}/assets/img_t/{m}.png" alt="{item.name} media" /></a>
			{/each}
		</span>
	{/if}

	<span class="name{getStrikeStatus(item.status)}">
		{@html getLink(item.name, getUrlStatus(item.status, item.url))}
	</span>

	{#if item.start > 0}
		<span class="date">
			({item.start + (item.end ? `–${item.end}` : '')})
		</span>
	{/if}

	{#if item.status}
		<span class="status" title={getEmoji(item.status)}>{item.status}</span>
	{/if}

	{#if item.author1}
		<span class="author">
			{@html getLink(item.author1, item.author1Url)}{#if item.author2}, {@html getLink(
					item.author2,
					item.author2Url
				)}{/if}{#if item.author3}, {@html getLink(item.author3, item.author3Url)}{/if}
		</span>
	{/if}

	{#if item.publisher}
		<span class="publisher">({@html getLink(item.publisher, item.publisherUrl)})</span>
	{/if}

	<span><a href="{base}/{convertToSlug(item.name)}" class="link">#</a></span>

	{#if item.description}
		<span class="description">{item.description}</span>
	{/if}
</div>
