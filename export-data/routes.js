// route.js - Add endpoints to the API

import { readFile, writeFile } from 'node:fs/promises';
const FILENAME = 'data.json';
const routes = async (server, options) => {
	// hack to get index.html (in root) to make this work on Glitch || Github Pages
	server.get('/', async (request, reply) => {
		const buffer = await readFile('index.html', { encoding: 'utf8' });
		reply.type('text/html').send(buffer);
	});
	server.get('/api', async (request, reply) => {
		reply.send({ message: 'hello' });
	});
	server.get('/api/data', async (request, reply) => {
		let data = await getCleanData();
		reply.send(data);
	});
	server.get('/api/save', async (request, reply) => {
		let result = await saveData();
		reply.send(result);
	});
};
export default routes;

import { functions } from './functions.js';
import { isLegitTagName } from '../src/lib/functions.js';
import fetch from 'node-fetch';
import * as d3 from 'd3';
let headerUrl =
	'https://docs.google.com/spreadsheets/d/1mQ0doWT6tGXm2W-hB5zuz3I8mijGhLSkAe_XrcfMdok/gviz/tq?tqx=out:csv&sheet=sites&range=A1:CQ2';
let dataUrl =
	'https://docs.google.com/spreadsheets/d/1mQ0doWT6tGXm2W-hB5zuz3I8mijGhLSkAe_XrcfMdok/gviz/tq?tqx=out:csv&sheet=sites&range=A2:CQ500';

async function saveData() {
	let data = await getCleanData();
	await saveFile(data, '../src/lib/stores/' + FILENAME);
	// await saveFile(data, './assets/' + FILENAME);
	return data.projects[2];
}
// saveData();
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
	let headerRowsSplit = headerRows.split('\n');
	// console.log(headerRowsSplit[0])

	// 2. swap positions between header and header notes
	let headerRowsSplitArr = [];
	headerRowsSplitArr.push(headerRowsSplit[1]);
	headerRowsSplitArr.push(headerRowsSplit[0]);
	// console.log(headerRowsSplitArr[0])

	// 3. then parse
	let headerRowsParsed = d3.csvParse(headerRowsSplitArr.join('\n'));

	// TESTS
	// parse the header row
	// console.log(d3.csvParse(rows)[0]);
	// returns multi-dimensional array, instead of object
	// console.log(d3.csvParseRows(rows));

	let dataRowsParsed = d3.csvParse(dataRows);
	// console.log('dataRowsParsed', dataRowsParsed);
	// console.log('dataRowsParsed', JSON.stringify(dataRowsParsed[186]));
	let data = await cleanData(dataRowsParsed);
	// console.log('data', JSON.stringify(data[2]));
	// console.log('dataRowsParsed', JSON.stringify(dataRowsParsed[186]));
	console.log('dataRowsParsed', JSON.stringify(dataRowsParsed[186]));
	// console.log('dataRowsParsed', JSON.stringify(dataRowsParsed[187]));

	headerRowsParsed[0]['all'] = 'all tags';
	console.log('headerRowsParsed', headerRowsParsed[0]);
	return { notes: headerRowsParsed[0], projects: data };
}
async function cleanData(data) {
	let arr = [];
	let slugs = [];
	for (let i = 0; i < data.length; i++) {
		// console.log(data[i]);
		if (data[i].title == '') continue;
		if (data[i].title == 'To evaluate') break;
		if (data[i].status == '✅') data[i].status = '';
		if (!data[i].start || data[i].start == '') data[i].start = 0;
		if (data[i].url == '#REF!') data[i].url = '';
		if (data[i].author1Url == '#REF!') data[i].author1Url = '';
		if (data[i].author2Url == '#REF!') data[i].author2Url = '';
		if (data[i].author3Url == '#REF!') data[i].author3Url = '';
		if (data[i].author4Url == '#REF!') data[i].author4Url = '';
		if (data[i].publisherUrl == '#REF!') data[i].publisherUrl = '';

		// numbers
		data[i].start = Number(data[i].start);
		data[i].end = Number(data[i].end);
		data[i].total = Number(data[i].total);

		let slug = getSlug(data[i].title);

		// make sure slug is unique
		if (slugs.includes(slug)) {
			if (data[i].start) slug += '-' + data[i].start;
			else if (data[i].author1) slug += '-' + data[i].author1.split(' ')[0];
		}
		data[i]['slug'] = slug;
		slugs.push(slug);
		// console.log('slug', data[i].slug);

		// move tags into object
		data[i]['tags'] = ['all'];
		for (const prop in data[i]) {
			if (Object.hasOwn(data[i], prop)) {
				// console.log(`data[i].${prop} = ${data[i][prop]}`);
				if (isLegitTagName(prop)) {
					if (data[i][prop] == 'x') {
						// console.log(prop, data[i][prop]);
						data[i].tags.push('' + prop);
					}
					// always delete tags
					if (prop != 'tags') delete data[i][prop];
				}
			}
			// delete empty
			if (!prop) delete data[i][prop];
		}
		// console.log(data[i].tags);

		// console.log(data[i]);
		arr.push(data[i]);
	}
	// return functions.shuffleArray(arr);
	return arr;
}

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function saveFile(data, filename) {
	// console.log(`saveFile(${data}, ${filename})`);
	await writeFile(path.resolve(__dirname, filename), JSON.stringify(data));
	return { message: 'success' };
}
function getSlug(str) {
	return str
		.toLowerCase()
		.trim()
		.replace(/(?!.)[^\w ]+/g, '') // (?!.) leaves period in domain names
		.replace(/\?/g, '')
		.replace(/\//g, '')
		.replace(/#/g, '')
		.replace(/,+/g, '-')
		.replace(/ +/g, '-')
		.replace(/[^a-z0-9.]+/g, '-')
		.replace(/--+/g, '-'); // any doubles created above
}
