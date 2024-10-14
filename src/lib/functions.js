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



export function getAuthors(p) {
	let str = "";
	for (let i = 1; i <= 4; i++){
		if (!p["author" + i]) break;
		if (str.length > 0) str += ", ";
		str += getLink(p["author" + i], p["author" + i + "Url"]);
	}
	return str;
}
export function getStrikeStatus(s) {
	if (s.includes('❌')) return 'strike';
}
export function getUrlStatus(s, url) {
	if (s.includes('❌')) return '';
	else return url;
}
export function getLink(str, url, blank = true) {
	if (!url) return str.trim();
	else return `<a href="${url.trim()}" ${blank ? 'target="_blank"' : ''}>${str.trim()}</a>`;
}
export function convertToSlug(str) {
	return str
		.toLowerCase()
		.replace(/(?!.)[^\w ]+/g, '') // (?!.) leaves period in domain names
		.replace(/\?/g,"")
		.replace(/\//g,"")
		.replace(/#/g,"")
		.replace(/ +/g, '-');
}
export function unSlug(str) {
	str = str.replace(/-/g, ' ').trim();
	if (str.split(' ').length > 1) str = convertToTitle(str);
	return str;
}
export function convertToTitle(str) {
	return str.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase());
}
export function getEmoji(s) {
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
export function isLegitTagName(key) {
	if (!key || key == '') return false;
	let skip = [
		'title',
		'author1',
		'author2',
		'author3',
		'author4',
		'publisher',
		'start',
		'end',
		'status',
		'code',
		'100examples',
		'description',
		'media',
		'more info',
		'moreinfo',
		'moreinfoUrl',
		'url',
		'author1Url',
		'author2Url',
		'author3Url',
		'author4Url',
		'publisherUrl',
		'total'
	];
	return !(skip.findIndex((p) => p.includes(key)) > -1);
}
