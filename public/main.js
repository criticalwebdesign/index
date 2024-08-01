let listEle = document.querySelector(".list");
let tagsEle = document.querySelector(".tags");
let countEle = document.querySelector(".count");
let list = [];
let tags = {};

(async () => {
  fetch(options.data)
    .then((resp) => resp.json())
    .then(async (json) => {
      countEle.innerHTML = json.length;

      json.sort(byName);
      // json.sort(byStartDate);

      await compileList(json);
      await getTags(json);
      await storeTagReferences(json);
      displayTags();
      displayListByIds();
    });
})();

function byStartDate(a, b) {
  if (a.start < b.start) return -1;
  if (a.start > b.start) return 1;
  return 0;
}
function byName(a, b) {
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
}

async function compileList(results) {
  // console.log("results", results);
  list = [];
  for (let i = 0; i < results.length; i++) {
    if (!results[i].name) continue;
    console.log("results[i]", results[i]);
    let item = [];
    if (results[i].url && results[i].url != "#REF!")
      item.push(`<a href="${results[i].url}" target="_blank">${results[i].name}</a> `);
    else item.push(results[i].name);
    if (results[i].start) item.push(`(${results[i].start})`);
    if (results[i].status) item.push(results[i].status);
    if (results[i].author)
      if (results[i].authorUrl && results[i].authorUrl != "#REF!")
        item.push(` by <a href="${results[i].authorUrl}" target="_blank">${results[i].author}</a>`);
      else item.push(` by ${results[i].author} `);
    list.push(`<div>${item.join(" ")}</div>`);
  }
}

async function getTags(data) {
  tags = {
    "*": [],
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
  console.log("tags", tags);
}
async function storeTagReferences(data) {
  for (const tag in tags) {
    for (let i = 0; i < data.length; i++) {
      // console.log(data[i].name, data[i][tag]);
      if (data[i][tag] == "x") tags[tag].push(i);
      if (tag == "*") tags["*"].push(i); // all
    }
  }
}
async function displayTags() {
  let str = "";
  for (const tag in tags) {
    str += `<button class="tag" data-tag="${tag}">${tag}</button> `;
  }
  tagsEle.innerHTML = str;
  let tagEles = document.querySelectorAll(".tag");
  for (let i = 0; i < tagEles.length; i++) {
    tagEles[i].addEventListener("click", function (e) {
      displayListByIds(e.target.dataset.tag);
    });
  }
}
let previousTag = "";
function selectTag(tag) {
  if (previousTag != "")
    document
      .querySelector(`[data-tag="${previousTag}"]`)
      .classList.toggle("selected");
  document.querySelector(`[data-tag="${tag}"]`).classList.toggle("selected");
  previousTag = tag;
}
function displayListByIds(tag = "*") {
  // update url
  let stateObj = {
    tag: tag,
  };
  let path = "#" + tag;
  if (tag == "*") path = "#all";
  window.history.replaceState(stateObj, tag, path);

  // update tags
  let selected = "";
  console.log(window.location.hash);
  // if (window.location.hash && window.location.hash == tag) selected = "selected";
  selectTag(tag);

  // update list
  let ids = tags[tag];
  let newList = [];
  for (let i = 0; i < ids.length; i++) {
    newList.push(list[ids[i]]);
  }
  listEle.innerHTML = newList.join(" ");
}
