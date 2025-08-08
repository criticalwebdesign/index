import { json, tags, getData, isLegitTagName, sortBy, convertToSlug } from "./data.js";

(async () => {
	// references
	let contentEle = document.querySelector(".content");
	let tagsEle = document.querySelector(".tags");
	let countEle = document.querySelector(".count");
	let notesEle = document.querySelector(".notes");

	let params = {
		project: "",
		sortMethod: "",
		tag: "",
	};

	let html = [];

	// listeners
	document.querySelector("#showMediaBtn").addEventListener("click", function () {
		document.querySelector("body").classList.toggle("showMedia");
	});
	document.querySelector("#showDescriptionsBtn").addEventListener("click", function () {
		document.querySelector("body").classList.toggle("showDescriptions");
	});
	document.querySelectorAll(".sort").forEach((item) =>
		item.addEventListener("click", function (e) {
			displayEntries("", e.target.id.trim(), "");
		})
	);

	// load data
	await getData();
	console.log("json", json);
	countEle.innerHTML = json.projects.length;
	displayEntries();

	// 2 - display entries
	async function displayEntries(_project = "", _sortMethod = "", _tag = "") {
		console.log("displayEntries() [1]", _project, _sortMethod, _tag, params);

		let _data;

		// select data
		if (_project) {
			params.project = _project;
		}

		// handle tag
		params.tag = _tag || "all";

		// sort data
		params.sortMethod = _sortMethod || "byName";
		_data = await sortBy(json.projects, params.sortMethod);

		displaySortMethodInMenu();
		// then reorder tags and display

		await getProjectsHTML(_data);
		createTagMenu();
		// console.log("displayEntries() [2]", "_data", _data);
		onSelectTag();
		// console.log("displayEntries() [3]", "html", html);
	}

	async function getProjectHTML(project) {
		let d = {
			name: "",
			slug: "",
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
		if (project.status) {
			if (project.status.includes("❌")) {
				emojiAlt = "Project URL is not safe to visit";
				project.url = "";
				strikeClass = " strike";
			} else if (project.status.includes("😿")) {
				emojiAlt = "Project is broken";
			} else if (project.status.includes("🗄")) {
				emojiAlt = "Project archived";
			} else {
				emojiAlt = "Project is live"; // ✅
			}
		}

		if (project.media) {
			let media = project.media.split(",");
			media.forEach((ele) => {
				// thumb stored in img_t is created with sample-node-tools
				d.media += `<a href="assets/img/${ele}.png" target="_blank"><img src="assets/img_t/${ele}.png"></a> `;
			});
		}
		if (project.name) {
			d.name = `<span class="name${strikeClass}">`;
			d.slug = convertToSlug(project.name);
			// console.log(project.url);
			if (project.url && project.url != "#REF!")
				d.name += `<a href="${project.url}" target="_blank">${project.name}</a></span>`;
			else d.name += `${project.name}</span>`;
		}
		if (project.description) {
			d.description = project.description;
			// d.description += `<small class="tags">${getTagsFromProject(
			// 	project
			// )}</small>`;
		}
		if (project.start) d.start = `<span class="start">(${project.start})</span>`;
		if (project.end) d.end = `<span class="end">(${project.end})</span>`;
		if (project.status)
			d.status = `<span class="status" title="${emojiAlt}">${project.status}</span>`;

		// PROJECT AUTHORS
		if (project.author1) {
			for (let j = 1; j <= 4; j++) {
				// console.log(`author${j}`, project[`author${j}`], project.author1);
				if (!project[`author${j}`]) break;
				if (j > 1) d.authors += ", ";
				d.authors += `<span class="author">`;
				if (project[`author${j}Url`] && project[`author${j}Url`] != "#REF!")
					d.authors += `<a href="${project[`author${j}Url`]}" target="_blank">${
						project[`author${j}`]
					}</a>`;
				else d.authors += `${project[`author${j}`]}`;
				d.authors += `</span>`;
			}
		}
		if (project.publisher) {
			d.publisher = `<span class="publisher">(`;
			if (project.publisherUrl && project.publisherUrl != "#REF!")
				d.publisher += `<a href="${project.publisherUrl}" 
									target="_blank">${project.publisher}</a>`;
			else d.publisher += `${project.publisher}`;
			d.publisher += `)</span>`;
		}
		return `<div class="item">
					<span class="media">${d.media}</span>
					${d.name} ${d.start} ${d.status} ${d.authors} ${d.publisher}
					<span><a class="link" data-link=${d.slug}" href="#${d.slug}">#</a></span>
					<span class="description">${d.description}</span>
				</div>`;
	}

	async function getProjectsHTML(_data) {
		// console.log("_data", _data);
		html = [];
		for (let i = 0; i < _data.length; i++) {
			if (!_data[i].name) continue;
			// console.log(i, _data[i]);
			html.push(await getProjectHTML(_data[i]));
		}
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

	function onSelectTag(_new = "") {
		console.log("onSelectTag() [1]", _new, params);
		compareTagToExisting(_new);

		updateDisplay();
	}
	function updateDisplay() {}

	/**
	 * Update list by
	 */
	function compareTagToExisting(_tag) {
		// if (!tags[_tag]) return;
		compareToTagInUrl(_tag);
		//params.tag = _new;
		displayTagInMenu(historyState.tag);
		// update list using the tag ids
		let ids = tags[historyState.tag];
		let content = [];
		for (let i = 0; i < ids.length; i++) {
			content.push(html[ids[i]]);
		}
		// console.log(content);
		contentEle.innerHTML = content.join(" ");
		let projectLinks = document.querySelectorAll(".link");
		for (let i = 0; i < projectLinks.length; i++) {
			projectLinks[i].addEventListener("click", function (e) {
				onSelectProject(e.target.dataset.link);
			});
		}
	}

	function onSelectProject(project = "") {
		console.log(project, params);
	}

	/**
	 * Update URL using selected tag
	 */
	let historyState = {
		tag: "",
		url: "",
	};
	function compareToTagInUrl(_tag) {
		// if (!_tag || _tag == "") _tag = "all";
		// !tag but hash found
		if (_tag == "" && window.location.hash)
			historyState.tag = getUrlSegment();
		// tag is the same as current state
		else if (_tag == historyState.tag)
			historyState.tag = "all";
		// use tag
		else if (_tag != "")
			historyState.tag = removePrefix(_tag);
		// default if none found
		if (historyState.tag == "")
			historyState.tag = "all";
		
		historyState.url = "#" + historyState.tag;
		console.log(window.location.hash, historyState);
		// update URL
		window.history.replaceState(historyState, historyState.tag, historyState.url);
	}
	function getUrlSegment(prefix = "#") {
		return removePrefix(window.location.hash, prefix);
	}
	function removePrefix(str, prefix) {
		return str.replace(prefix, "").trim();
	}

	////////////////////////////////////////////////////////
	//////////////////////// UI ////////////////////////////
	////////////////////////////////////////////////////////

	function displaySortMethodInMenu() {
		// remove current
		document
			.querySelectorAll(".sort.active")
			.forEach((item) => item.classList.remove("active"));
		document.querySelector(`[id="${params.sortMethod}"]`).classList.add("active");
	}
	function displayTagInMenu(_tag) {
		// console.log("displayTagInMenu()", _tag, json.notes, json.notes[_tag]);
		// remove current
		document
			.querySelectorAll(".tag.active")
			.forEach((item) => item.classList.remove("active"));

		// double check and then display active
		if (window.location.hash.includes(_tag))
			document.querySelector(`[data-tag="${_tag}"]`).classList.add("active");

		displayNotes(_tag);
	}
	function displayNotes(_tag) {
		notesEle.innerHTML = "";
		// breadcrumb
		let notesHtml = `→ <span>${_tag.replace("-", " ")}</span>`;
		if (json.notes[_tag]) notesHtml += ` → ${json.notes[_tag]}`;
		notesEle.innerHTML = notesHtml;
	}

	// const fontStacks = ["head", "para", "mono", "fant", "curs", "hand"];
	// document.querySelector("h1").classList =
	// 	fontStacks[Math.floor(Math.random() * fontStacks.length)];
})();
