import { ParsedMessage } from "./abnf";
import { cwd } from "node:process";
console.log(`Current directory: ${cwd()}`);
const parsingPositive: Object = require("../../../test/parsing_positive.json");
// const parsingPositive: Object = require("../../../test/parsing_negative.json");
let messages = [];
Object.keys(parsingPositive).forEach((e) => {
  // console.log(`key=${e} `);
  // console.log(parsingPositive[e].message);
  messages.push(parsingPositive[e].message);
});
let parsedMsg;
for (let i = 0; i < messages.length; i += 1) {
  parsedMsg = new ParsedMessage(messages[i]);
  console.dir(parsedMsg);
  // console.log(`messages[${i}]:\n${messages[i]}`);
}
