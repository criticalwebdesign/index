// options
export const env = {
	port: 3000,
	server: "https://omundy.github.io/critical-web-design-index/",
	data: "./assets/data.json",
};
// server data
export let json = {};
export let tags = {};

export async function getData() {
	return fetch(env.data)
		.then((resp) => resp.json())
		.then(async (_json) => {
			json = _json;
			// console.log("json", json);
			await saveTagsFromHeaderRow(json.projects);
			await saveProjectIdsByTag(json.projects);

			console.log("tags", tags)
		});
}

////////////////////////////////////////////////////////
////////////////////// SORTING /////////////////////////
////////////////////////////////////////////////////////

function s(a, b) {
	if (!a || a === "" || a === null) return 1;
	if (!b || b === "" || b === null) return -1;
	if (a === b) return 0;
	return a < b ? -1 : 1;
}
let sortMethods = {
	byStartDate: (a, b) => s(a.start, b.start),
	byName: (a, b) => s(a.name, b.name),
};
export async function sortBy(_data, _sort) {
	// console.log("sortBy()", _data, sort)
	return _data.sort(sortMethods[_sort]);
}

////////////////////////////////////////////////////////
/////////////////////// TAGS ///////////////////////////
////////////////////////////////////////////////////////

async function saveTagsFromHeaderRow(_data) {
	tags = {
		all: [],
	};
	for (const prop in _data[0]) {
		if (!isLegitTagName(prop)) continue;
		tags[prop] = [];
	}
	// console.log("tags", tags);
}

async function saveProjectIdsByTag(_data) {
	// console.log("saveProjectIdsByTag()", _data)
	for (const tag in tags) {
		for (let i = 0; i < _data.length; i++) {
			// console.log(_data[i].name, _data[i][tag]);
			if (_data[i][tag] == "x") tags[tag].push(i);
			if (tag == "all") tags["all"].push(i); // all
		}
	}
}

// cut
export function isLegitTagName(key) {
	let skip = [
		"name",
		"author1",
		"author2",
		"author3",
		"author4",
		"publisher",
		"start",
		"end",
		"status",
		"code",
		"100examples",
		"description",
		"media",
		"more info",
		"moreinfo",
		"moreinfoUrl",
		"url",
		"author1Url",
		"author2Url",
		"author3Url",
		"author4Url",
		"publisherUrl",
		"total",
	];
	return !(skip.findIndex((p) => p.includes(key)) > -1);
}

export function convertToSlug(str) {
	return str
		.toLowerCase()
		.replace(/[^\w ]+/g, "")
		.replace(/ +/g, "-");
}
function getTagsFromProject(_row) {
	let _tags = getTagsFromRow(_row);
	let str = "";
	for (let i = 0; i < _tags.length; i++) {
		str += `#${_tags[i]} `;
		// str += `<button class="tag" data-tag="${_tags[i]}" onClick="onSelectTag(\'scroll\')">
		// 			${_tags[i].replace("-", " ")}
		// 		</button> `;
	}
	return str;
}
function getTagsFromRow(_row) {
	let _tags = [];
	for (const prop in _row) {
		if (!isLegitTagName(prop)) continue;
		if (_row[prop] == "x")
			// console.log("prop", prop)
			_tags.push(prop);
		// for (let i = 0; i < _row.length; i++) {
		// 	console.log(_data[i].name, _data[i][tag]);
		// 	// if (_data[i][tag] == "x") _tags[tag].push(i);
		// 	// if (tag == "all") _tags["all"].push(i); // all
		// }
	}
	return tags;
}

////////////////////////////////////////////////////////
///////////////////// FUNCTIONS ////////////////////////
////////////////////////////////////////////////////////


function stringifyEscape(d) {
	return (
		JSON.stringify(d)
			// escape single quote https://stackoverflow.com/a/59642842/441878
			.replace(/[\/\(\)\']/g, "&apos;")
	);
}