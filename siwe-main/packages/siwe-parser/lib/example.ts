import { ParsedMessage } from "./abnf";
import { cwd } from "node:process";
console.log(`Current directory: ${cwd()}`);
const parsingPositive: Object = require("../../../test/parsing_positive.json");
let messages = [];
Object.keys(parsingPositive).forEach((e) => {
  // console.log(`key=${e} `);
  // console.log(parsingPositive[e].message);
  messages.push(parsingPositive[e].message);
});
// for (let i = 0; i < messages.length; i += 1) {
//   console.log(`messages[${i}]:\n${messages[i]}`);
// }

console.log(`first postive message from "test/parsing_positive.json"`);
console.log(messages[0]);
const parsedMessage = new ParsedMessage(messages[0]);
