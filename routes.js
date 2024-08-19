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
	"https://docs.google.com/spreadsheets/d/1mQ0doWT6tGXm2W-hB5zuz3I8mijGhLSkAe_XrcfMdok/gviz/tq?tqx=out:csv&sheet=sites&range=A1:CE2";
let dataUrl =
	"https://docs.google.com/spreadsheets/d/1mQ0doWT6tGXm2W-hB5zuz3I8mijGhLSkAe_XrcfMdok/gviz/tq?tqx=out:csv&sheet=sites&range=A2:CE500";

async function saveData() {
	let data = await getCleanData();
	return await saveFile(data, FILENAME);
}	
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

	// // move the heading notes to the 2nd row
	// // split the rows on line break
	// let rowsSplit = rows.split("\n");
	// console.log(rowsSplit[0])
	// // remove first index
	// let notes = rowsSplit.shift();
	// // insert them into 2nd index
	// rowsSplit.splice(1, 0, notes);
	// let rowsParsed = d3.csvParse(rowsSplit.join("\n"));

	// as usual, google sheets export is a mystery, in this case
	// randomly omitting two column headers....
	let headerRowsSplit = headerRows.split("\n");
	// console.log(headerRowsSplit[0])
	let headerRowsSplitArr = []
	headerRowsSplitArr.push(headerRowsSplit[1]);
	headerRowsSplitArr.push(headerRowsSplit[0]);
	// console.log(headerRowsSplitArr[0])
	let headerRowsParsed = d3.csvParse(headerRowsSplitArr.join("\n"));

	// TESTS
	// test the header row
	// console.log(d3.csvParse(rows)[0]);
	// returns multi-dimensional array, instead of object
	// console.log(d3.csvParseRows(rows));

	let dataRowsParsed = d3.csvParse(dataRows);
	// console.log("dataRowsParsed", dataRowsParsed[1]);
	let data = await cleanData(dataRowsParsed);
	return {notes:headerRowsParsed[0], data: data};
}
async function cleanData(data) {
	let arr = [];
	for (let i = 0; i < data.length; i++) {
		// console.log(data[i]);
		if (data[i].name == "") continue;
		if (data[i].name == "To evaluate") break;
		if (data[i].status == "✅") data[i].status = "";
		if (!data[i].start || data[i].start == "") data[i].start = 0;
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
