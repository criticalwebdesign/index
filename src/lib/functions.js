// @ts-nocheck

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
export function isLegitTagName(key) {
	if (!key || key == '') return false;
	let skip = [
		'name',
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
