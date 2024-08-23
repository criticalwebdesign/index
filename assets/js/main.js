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

	document.querySelector("#showMediaBtn").addEventListener("click", function () {
		document.querySelector("body").classList.toggle("showMedia");
	});
	document.querySelector("#showDescriptionsBtn").addEventListener("click", function () {
		document.querySelector("body").classList.toggle("showDescriptions");
	});

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
				authors: "",
				publisher: "",
				media: "",
				description: "",
			};

			// PROJECT STATUS
			let strikeClass = "";
			let emojiAlt = "";
			if (data[i].status) {
				if (data[i].status.includes("❌")) {
					emojiAlt = "Project URL is not safe to visit";
					data[i].url = "";
					strikeClass = " strike";
				} else if (data[i].status.includes("😿")) {
					emojiAlt = "Project is broken";
				} else if (data[i].status.includes("🗄")) {
					emojiAlt = "Project archived";
				} else {
					emojiAlt = "Project is live"; // ✅
				}
			}

			if (data[i].media) {
				let media = data[i].media.split(",");
				media.forEach((ele) => {
					d.media += `<a href="assets/img/${ele}.png" target="_blank"><img src="assets/img/${ele}.png"></a> `;
				});
			}
			if (data[i].name) {
				d.name = `<span class="name${strikeClass}">`;
				// console.log(data[i].url);
				if (data[i].url && data[i].url != "#REF!")
					d.name += `<a href="${data[i].url}" target="_blank">${data[i].name}</a></span>`;
				else d.name += `${data[i].name}</span>`;
			}
			if (data[i].description) {
				d.description = data[i].description;
				// d.description += `<small class="tags">${getTagsFromProject(
				// 	data[i]
				// )}</small>`;
			}
			if (data[i].start) d.start = `<span class="start">(${data[i].start})</span>`;
			if (data[i].end) d.end = `<span class="end">(${data[i].end})</span>`;
			if (data[i].status)
				d.status = `<span class="status" title="${emojiAlt}">${data[i].status}</span>`;

			// PROJECT AUTHORS
			if (data[i].author1) {
				for (let j = 1; j <= 4; j++) {
					// console.log(`author${j}`, data[i][`author${j}`], data[i].author1);
					if (!data[i][`author${j}`]) break;
					if (j > 1) d.authors += ", ";
					d.authors += `<span class="author">`;
					if (data[i][`author${j}Url`] && data[i][`author${j}Url`] != "#REF!")
						d.authors += `<a href="${
							data[i][`author${j}Url`]
						}" target="_blank">${data[i][`author${j}`]}</a>`;
					else d.authors += `${data[i][`author${j}`]}`;
					d.authors += `</span>`;
				}
			}
			if (data[i].publisher) {
				d.publisher = `<span class="publisher">(`;
				if (data[i].publisherUrl && data[i].publisherUrl != "#REF!")
					d.publisher += `<a href="${data[i].publisherUrl}" 
										target="_blank">${data[i].publisher}</a>`;
				else d.publisher += `${data[i].publisher}`;
				d.publisher += `)</span>`;
			}

			html.push(
				`<div class="item">
					<span class="media">${d.media}</span>
					${d.name} ${d.start} ${d.status} ${d.authors} ${d.publisher}
					<span class="description">${d.description}</span>
				</div>`
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
	function getTagsFromProject(row) {
		let tags = getTagsFromRow(row);
		let str = "";
		for (let i = 0; i < tags.length; i++) {
			str += `#${tags[i]} `
			// str += `<button class="tag" data-tag="${tags[i]}" onClick="onSelectTag(\'scroll\')">
			// 			${tags[i].replace("-", " ")}
			// 		</button> `;
		}
		return str;
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
			str += `<button class="tag" title="${tags[tag].length}" data-tag="${tag}">
						${tag.replace("-", " ")}
					</button> `;
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
		// breadcrumb
		let notesHtml = `→ <span>${tag.replace("-", " ")}</span>`;
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
