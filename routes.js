// route.js - Add endpoints to the API

const routes = async (server, options) => {
  server.get("/api", async function (request, reply) {
    reply.send({ message: "hello" });
  });
  server.get("/api/data", async function (request, reply) {
    reply.send(await getData());
  });
  server.get("/api/save", async function (request, reply) {
    reply.send(await saveData());
  });
  // server.get("/api/custom", async function (request, reply) {
  //   console.log(request.query.params);
  //   reply.send({ message: returnPassword(request.query.params) });
  // });
};
export default routes;

import { functions } from "./functions.js";
import fetch from "node-fetch";
import * as d3 from 'd3';
let url =
    "https://docs.google.com/spreadsheets/d/1mQ0doWT6tGXm2W-hB5zuz3I8mijGhLSkAe_XrcfMdok/gviz/tq?tqx=out:csv&sheet=sites&range=A2:BV500";

async function getData() {
  return fetch(url)
    .then((d) => d.text())
    .then((rows) => {
      // console.log(rows);

      // test the header row
      // console.log(d3.csvParse(rows)[0]);

      // returns multi-dimensional array, instead of object
      // console.log(d3.csvParseRows(rows));

      return cleanData(d3.csvParse(rows));
    });
}

async function cleanData(data) {
  let arr = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].name == "To evaluate") break;
    if (data[i].start == "") data[i].start = 0;
    // console.log(data[i]);
    arr.push(data[i]);
  }
  return arr;
  // return functions.shuffleArray(arr);
}

import { promises as fs } from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function saveData(){
  let data = await getData();
  await fs.writeFile(path.resolve(__dirname, './data.json'), JSON.stringify(data));
  return {message: "success"}
}
// saveData();