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

export function isEmpty(obj) {
	return Object.keys(obj).length === 0 || obj === {};
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
export function getDate(start, end, parentheses) {
	let str = '';
	if (parentheses) str += '(';
	str += start;
	if (end) str += '–' + end;
	if (parentheses) str += ')';
	return str;
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
export function cleanHash (str) { 
    return str.trim().replace(/#+/g, '');
}

export function convertToTitle(str) {
	return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}

export function isLegitTagName(key) {
	if (!key || key == '') return false;
	// skip these columns from the sheet
	let skip = [
		'title',
		'url',

		'start',
		'end',
		'status',
		'archived',

		'author1',
		'author1Url',
		'author1role',
		'author2',
		'author2Url',
		'author2role',
		'author3',
		'author3Url',
		'author3role',
		'author4',
		'author4Url',
		'author4role',
		'publisher',
		'publisherUrl',

		'code',
		'100examples',
		'description',
		'moreinfo1',
		'moreinfo2',
		'moreinfo3',
		'media',
		'slug',
		'total',
		'tags' // not in spreadsheet, added dynamically later
	];
	return !(skip.findIndex((p) => p.includes(key)) > -1);
}
