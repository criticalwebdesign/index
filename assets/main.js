let listEle = document.querySelector(".list");
let tagsEle = document.querySelector(".tags");
let countEle = document.querySelector(".count");
let notesEle = document.querySelector(".notes");
let notes = {}; // saved from server
let data = []; // saved from server
let html = [];
let tags = {};
let sortMethod = "byName";

(async () => {
	fetch(OPTIONS.data)
		.then((resp) => resp.json())
		.then(async (json) => {
			countEle.innerHTML = json.length;
			// console.log("json", json);
			notes = json.shift(); // save notes
			data = json;
			displayEntries(data, sortMethod);
		});
})();

document.querySelectorAll(".sort").forEach((item) =>
	item.addEventListener("click", function (e) {
		displayEntries(data, e.target.id.trim());
	})
);

async function displayEntries(data, sort) {
	// console.log("displayEntries()", sort);

	// sort data 
	data = sortBy(data, sort);
	// then reorder tags and display
	await getTags(data);
	await storeTagReferences(data);
	await createListHtml(data);
	createTagMenu();
	// console.log("data", data);
	onSelectTag();
	// console.log("html", html);
}

function sortBy(d, sort) {
	sortMethod = sort;
	selectSortMethodInMenu(sortMethod);
	return d.sort(sortMethods[sortMethod]);
}
let sortMethods = {
	byStartDate: (a, b) => s(a.start, b.start),
	byName: (a, b) => s(a.name, b.name),
};
function s(a, b) {
	if (!a || a === "" || a === null) return 1;
	if (!b || b === "" || b === null) return -1;
	if (a === b) return 0;
	return a < b ? -1 : 1;
}

async function createListHtml(data) {
	// console.log("data", data);
	html = [];
	for (let i = 0; i < data.length; i++) {
		if (!data[i].name) continue;
		// console.log(i, data[i]);
		let item = [];
		if (data[i].url && data[i].url != "#REF!")
			item.push(`<span class="name"><a href="${data[i].url}" target="_blank">${data[i].name}</a></span>`);
		else item.push(`<span class="name">${data[i].name}</span>`);
		if (data[i].start) item.push(`<span class="start">(${data[i].start})</span>`);
		if (data[i].status) item.push(`<span class="status">${data[i].status}</span>`);
		if (data[i].author)
			if (data[i].authorUrl && data[i].authorUrl != "#REF!")
				item.push(
					`<span class="author"><a href="${data[i].authorUrl}" target="_blank">${data[i].author}</a></span>`
				);
			else item.push(`<span class="author">${data[i].author}</span>`);
		html.push(`<div class="item">${item.join(" ")}</div>`);
	}
}

async function getTags(data) {
	tags = {
		all: [],
	};
	let skip = [
		"name",
		"author",
		"start",
		"end",
		"status",
		"code",
		"100examples",
		"description",
		"more info",
		"url",
		"authorUrl",
		"total",
	];
	for (const prop in data[0]) {
		if (skip.findIndex((p) => p.includes(prop)) > -1) continue;
		tags[prop] = [];
	}
	// console.log("tags", tags);
}
async function storeTagReferences(data) {
	for (const tag in tags) {
		for (let i = 0; i < data.length; i++) {
			// console.log(data[i].name, data[i][tag]);
			if (data[i][tag] == "x") tags[tag].push(i);
			if (tag == "all") tags["all"].push(i); // all
		}
	}
}
async function createTagMenu() {
	let str = "";
	for (const tag in tags) {
		str += `<button class="tag" data-tag="${tag}">${tag}</button> `;
	}
	tagsEle.innerHTML = str;
	let tagEles = document.querySelectorAll(".tag");
	for (let i = 0; i < tagEles.length; i++) {
		tagEles[i].addEventListener("click", function (e) {
			onSelectTag(e.target.dataset.tag);
		});
	}
}

/**
 * Update list by
 */
function onSelectTag(tag = "") {
	updateUrlFromTag(tag);
	selectTagInMenu(historyState.tag);

	// update list using the tag ids
	let ids = tags[historyState.tag];
	let newList = [];
	for (let i = 0; i < ids.length; i++) {
		newList.push(html[ids[i]]);
	}
	listEle.innerHTML = newList.join(" ");
}

/**
 * Update URL using selected tag
 */
let historyState = {
	tag: "",
	url: "",
};
function updateUrlFromTag(tag) {
	// !tag but hash found
	if (tag == "" && window.location.hash)
		historyState.tag = window.location.hash.replace("#", "").trim();
	// tag is the same as current state
	else if (tag == historyState.tag) historyState.tag = "all";
	// use tag
	else if (tag != "") historyState.tag = tag.replace("#", "").trim();
	// default if none found
	if (historyState.tag == "") historyState.tag = "all";
	historyState.url = "#" + historyState.tag;
	// console.log(window.location.hash, historyState);
	// update URL
	window.history.replaceState(historyState, historyState.tag, historyState.url);
}
function selectTagInMenu(tag) {
	// remove current
	document
		.querySelectorAll(".tag.active")
		.forEach((item) => item.classList.remove("active"));
	notesEle.innerHTML = "";
	// double check and then display active
	if (window.location.hash.includes(tag))
		document.querySelector(`[data-tag="${tag}"]`).classList.add("active");
	if (notes[tag])
		notesEle.innerHTML = notes[tag]
}
function selectSortMethodInMenu(sortMethod) {
	// remove current
	document
		.querySelectorAll(".sort.active")
		.forEach((item) => item.classList.remove("active"));
	document.querySelector(`[id="${sortMethod}"]`).classList.add("active");
}
