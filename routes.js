// route.js - Add endpoints to the API

import { readFile, writeFile } from "node:fs/promises";
const FILENAME = "./assets/data.json";
const routes = async (server, options) => {
	// hack to get index.html (in root) to make this work on Glitch || Github Pages
	server.get("/", async (request, reply) => {
		const buffer = await readFile("index.html", { encoding: "utf8" });
		reply.type("text/html").send(buffer);
	});
	server.get("/api", async (request, reply) => {
		reply.send({ message: "hello" });
	});
	server.get("/api/data", async (request, reply) => {
		let data = await getCleanData();
		reply.send(data);
	});
	server.get("/api/save", async (request, reply) => {
		let result = await saveData();
		reply.send(result);
	});
};
export default routes;

import { functions } from "./functions.js";
import fetch from "node-fetch";
import * as d3 from "d3";
let headerUrl =
	"https://docs.google.com/spreadsheets/d/1mQ0doWT6tGXm2W-hB5zuz3I8mijGhLSkAe_XrcfMdok/gviz/tq?tqx=out:csv&sheet=sites&range=A1:CN2";
let dataUrl =
	"https://docs.google.com/spreadsheets/d/1mQ0doWT6tGXm2W-hB5zuz3I8mijGhLSkAe_XrcfMdok/gviz/tq?tqx=out:csv&sheet=sites&range=A2:CN500";

async function saveData() {
	let data = await getCleanData();
	return await saveFile(data, FILENAME);
}
saveData();
async function getData(url) {
	return fetch(url)
		.then((d) => d.text())
		.then((rows) => {
			return rows;
		});
}
async function getCleanData() {
	let headerRows = await getData(headerUrl);
	let dataRows = await getData(dataUrl);

	// As usual, google sheets export is a mystery, in this case randomly omitting two column headers. The fix...

	// 3. get header row separately and split
	let headerRowsSplit = headerRows.split("\n");
	// console.log(headerRowsSplit[0])

	// 2. swap positions between header and header notes
	let headerRowsSplitArr = [];
	headerRowsSplitArr.push(headerRowsSplit[1]);
	headerRowsSplitArr.push(headerRowsSplit[0]);
	// console.log(headerRowsSplitArr[0])

	// 3. then parse
	let headerRowsParsed = d3.csvParse(headerRowsSplitArr.join("\n"));

	// TESTS
	// parse the header row
	// console.log(d3.csvParse(rows)[0]);
	// returns multi-dimensional array, instead of object
	// console.log(d3.csvParseRows(rows));

	let dataRowsParsed = d3.csvParse(dataRows);
	console.log("dataRowsParsed", dataRowsParsed[1]);
	let data = await cleanData(dataRowsParsed);
	console.log("data", data[2]);
	return { notes: headerRowsParsed[0], data: data };
}
async function cleanData(data) {
	let arr = [];
	for (let i = 0; i < data.length; i++) {
		// console.log(data[i]);
		if (data[i].name == "") continue;
		if (data[i].name == "To evaluate") break;
		if (data[i].status == "✅") data[i].status = "";
		if (!data[i].start || data[i].start == "") data[i].start = 0;
		if (data[i].url == "#REF!") data[i].url = "";
		if (data[i].author1Url == "#REF!") data[i].author1Url = "";
		if (data[i].author2Url == "#REF!") data[i].author2Url = "";
		if (data[i].author3Url == "#REF!") data[i].author3Url = "";
		if (data[i].author4Url == "#REF!") data[i].author4Url = "";
		if (data[i].publisherUrl == "#REF!") data[i].publisherUrl = "";

		// for (const prop in data[i]) {
		// 	if (Object.hasOwn(data[i], prop)) {
		// 		//   console.log(`data[i].${prop} = ${data[i][prop]}`);
		// 		if (!data[i][prop]) delete data[i][prop];
		// 	}
		// }

		// console.log(data[i]);
		arr.push(data[i]);
	}
	// return functions.shuffleArray(arr);
	return arr;
}

import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function saveFile(data, filename) {
	// console.log(`saveFile(${data}, ${filename})`);
	await writeFile(path.resolve(__dirname, filename), JSON.stringify(data));
	return { message: "success" };
}
