// @ts-nocheck

export function getObjectFromSlug(arr, slug) {
	let obj;
	for (let i = 0; i < arr.length; i++) {
		// console.log(i, arr[i].slug);
		if (slug == arr[i].slug) {
			obj = arr[i];
			break;
		}
	}
	return obj;
}


/////////////////////////////////////////////////
//////////////// PROJECT VIEW ///////////////////
/////////////////////////////////////////////////

export function getAuthors(p) {
	let str = '';
	for (let i = 1; i <= 4; i++) {
		if (!p['author' + i]) break;
		if (str.length > 0) str += ', ';
		str += getLink(p['author' + i], p['author' + i + 'Url']);
	}
	return str;
}
export function getStrikeStatus(s) {
	if (s.includes('❌')) return 'strike';
	else return '';
}
export function getUrlStatus(s, url) {
	if (s.includes('❌')) return '';
	else return url;
}
export function getLink(str, url, blank = true) {
	if (!url) return str.trim();
	else return `<a href="${url.trim()}" ${blank ? 'target="_blank"' : ''}>${str.trim()}</a>`;
}
export function getEmoji(s) {
	let emojiAlt = '';
	if (s.includes('❌')) {
		emojiAlt = 'Project URL is not safe';
	} else if (s.includes('😿')) {
		emojiAlt = 'Project is broken';
	} else if (s.includes('🗄')) {
		emojiAlt = 'Project archived';
	} else {
		emojiAlt = 'Project is live'; // ✅
	}
	return emojiAlt;
}
export function unSlug(str) {
	str = str.replace(/-/g, ' ').trim();
	if (str.split(' ').length > 1) str = convertToTitle(str);
	return str;
}
export function convertToTitle(str) {
	return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}

export function isLegitTagName(key) {
	if (!key || key == '') return false;
	let skip = [
		'title',
		'url',

		'start',
		'end',
		'status',
		'archived',

		'author1',
		'author1Url',
		'author2',
		'author2Url',
		'author3',
		'author3Url',
		'author4',
		'author4Url',
		'publisher',
		'publisherUrl',

		'code',
		'100examples',
		'description',
		'moreinfo',
		'moreinfoUrl',
		'media',
		'slug',
		'total',
		'tags' // not in spreadsheet, added dynamically later
	];
	return !(skip.findIndex((p) => p.includes(key)) > -1);
}
