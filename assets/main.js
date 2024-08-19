(async () => {
	let listEle = document.querySelector(".list");
	let tagsEle = document.querySelector(".tags");
	let countEle = document.querySelector(".count");
	let notesEle = document.querySelector(".notes");
	let notes = {}; // saved from server
	let data = []; // saved from server
	let html = [];
	let tags = {};
	let sortMethod = "byName";

	fetch(OPTIONS.data)
		.then((resp) => resp.json())
		.then(async (json) => {
			// console.log("json", json);
			notes = json.notes; // save notes
			data = json.data;
			countEle.innerHTML = data.length;
			displayEntries(data, sortMethod);
		});

	document.querySelectorAll(".sort").forEach((item) =>
		item.addEventListener("click", function (e) {
			displayEntries(data, e.target.id.trim());
		})
	);

	async function displayEntries(data, sort) {
		// console.log("displayEntries()", sort);

		// sort data
		data = await sortBy(data, sort);
		// then reorder tags and display
		await saveTagsFromHeaderRow(data);
		await storeTagReferences(data);
		await createListHtml(data);
		createTagMenu();
		// console.log("data", data);
		onSelectTag();
		// console.log("html", html);
	}

	async function sortBy(d, sort) {
		// console.log("sortBy()", d, sort)
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
			let d = {
				name: "",
				start: "",
				end: "",
				status: "",
				author: "",
				description: "",
			};
			let strikeClass = "";
			let ele = "span";
			let emojiAlt = "";
			if (data[i].status.includes("❌")) {
				emojiAlt = "Project URL is not safe to visit";
				data[i].url = "";
				strikeClass = " strike";
			} else if (data[i].status.includes("😿")) {
				emojiAlt = "Project is broken";
			} else if (data[i].status.includes("🗄")) {
				emojiAlt = "Project archived";
			} else { // ✅
				emojiAlt = "Project is live";
			}

			if (data[i].name) {
				d.name = `<${ele} class="name${strikeClass}">`;
				if (data[i].url && data[i].url != "#REF!")
					d.name += `<a href="${data[i].url}" target="_blank">${data[i].name}</a></${ele}>`;
				else d.name += `${data[i].name}</${ele}>`;
			}
			if (data[i].start)
				d.start = `<${ele} class="start">(${data[i].start})</${ele}>`;
			if (data[i].end) d.end = `<${ele} class="end">(${data[i].end})</${ele}>`;
			if (data[i].status)
				d.status = `<${ele} class="status" title="${emojiAlt}">${data[i].status}</${ele}>`;
			if (data[i].author) {
				d.author = `<${ele} class="author">`;
				if (data[i].authorUrl && data[i].authorUrl != "#REF!")
					d.author += `<a href="${data[i].authorUrl}" target="_blank">${data[i].author}</a></${ele}>`;
				else d.author += `${data[i].author}</${ele}>`;
			}
			html.push(
				`<div class="item" data-item='${stringifyEscape(d)}'>
				${d.name} ${d.start} ${d.status} ${d.author}
				<span class="content">${getTagsFromRow(data[i]).join(", ")}</span></div>`
			);
		}
	}
	

	function stringifyEscape(d) {
		return (
			JSON.stringify(d)
				// escape single quote https://stackoverflow.com/a/59642842/441878
				.replace(/[\/\(\)\']/g, "&apos;")
		);
	}

	async function saveTagsFromHeaderRow(data) {
		tags = {
			all: [],
		};
		for (const prop in data[0]) {
			if (!isLegitTagName(prop)) continue;
			tags[prop] = [];
		}
		// console.log("tags", tags);
	}
	async function storeTagReferences(data) {
		// console.log("storeTagReferences()", data)
		for (const tag in tags) {
			for (let i = 0; i < data.length; i++) {
				// console.log(data[i].name, data[i][tag]);
				if (data[i][tag] == "x") tags[tag].push(i);
				if (tag == "all") tags["all"].push(i); // all
			}
		}
	}
	function isLegitTagName(key) {
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
			"authorUrl2",
			"total",
		];
		return !(skip.findIndex((p) => p.includes(key)) > -1);
	}
	function getTagsFromRow(row) {
		let tags = [];
		for (const prop in row) {
			if (!isLegitTagName(prop)) continue;
			if (row[prop] == "x")
				// console.log("prop", prop)
				tags.push(prop);
			// for (let i = 0; i < row.length; i++) {
			// 	console.log(data[i].name, data[i][tag]);
			// 	// if (data[i][tag] == "x") tags[tag].push(i);
			// 	// if (tag == "all") tags["all"].push(i); // all
			// }
		}
		return tags;
	}
	async function createTagMenu() {
		let str = "";
		for (const tag in tags) {
			str += `<button class="tag tooltip" title="${tags[tag].length}" data-tag="${tag}">${tag}</button> `;
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
		// console.log("selectTagInMenu()", tag, notes, notes[tag]);
		// remove current
		document
			.querySelectorAll(".tag.active")
			.forEach((item) => item.classList.remove("active"));
		notesEle.innerHTML = "";
		// double check and then display active
		if (window.location.hash.includes(tag))
			document.querySelector(`[data-tag="${tag}"]`).classList.add("active");
		let notesHtml = `→ <span>${tag}</span>`;
		if (notes[tag]) notesHtml += ` → ${notes[tag]}`;
		notesEle.innerHTML = notesHtml;
	}
	function selectSortMethodInMenu(sortMethod) {
		// remove current
		document
			.querySelectorAll(".sort.active")
			.forEach((item) => item.classList.remove("active"));
		document.querySelector(`[id="${sortMethod}"]`).classList.add("active");
	}

	// const fontStacks = ["head", "para", "mono", "fant", "curs", "hand"];
	// document.querySelector("h1").classList =
	// 	fontStacks[Math.floor(Math.random() * fontStacks.length)];
})();
