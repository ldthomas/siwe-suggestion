import { ParsedMessage } from "./abnf";
// import { cwd } from "node:process";
// console.log(`Current directory: ${cwd()}`);
import { performance } from "node:perf_hooks";
const parsingPositive: Object = require("../../../test/parsing_positive.json");
let messages = [];
Object.keys(parsingPositive).forEach((e) => {
  messages.push(parsingPositive[e].message);
});
let parsedMsg;
let count = 0;
const reps = 1000;
const start = performance.now();
for (let rep = 0; rep < reps; rep += 1) {
  for (let i = 0; i < messages.length; i += 1) {
    parsedMsg = new ParsedMessage(messages[i]);
    count += 1;
  }
}
const stop = performance.now();
console.log(`parsed messages: ${count}`);
let time = stop - start;
console.log(`parser time: ${time.toFixed(2)} msec`);
time = time / count;
console.log(`time per msg: ${time.toFixed(2)} msec`);
