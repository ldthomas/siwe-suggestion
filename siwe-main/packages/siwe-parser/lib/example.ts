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
let msg14 = "";
msg14 += "service.org wants you to sign in with your Ethereum account:\n";
msg14 += "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\n";
msg14 += "\n";
msg14 += "\n";
msg14 += "URI: uri://10.10.10.10\n";
// msg14 += "URI: uri://[2001:db8::ffff:001.00.000.255]\n";
// msg14 += "URI: uri://[2001:db8:db8:db8:db8:db8:db8:db8]\n";
// msg14 += "URI: uri://[2001:db8:db8:db8:db8:db8:001.00.000.255]\n";
// msg14 += "URI: uri://[::]\n";
// msg14 += "URI: uri://[::001.00.000.255]\n";
// msg14 += "URI: uri://[2001:db8::]\n";
// msg14 += "URI: uri://[::2001]\n";
// msg14 += "URI: uri://[2001:db8::001.00.000.255]\n";
// msg14 += "URI: uri://[::2001:001.00.000.255]\n";
// msg14 += "URI: uri://[::2001:2001:2001:2001:2001:ffff:001.00.000.255]\n";
msg14 += "Version: 1\n";
msg14 += "Chain ID: 1\n";
msg14 += "Nonce: 32891757\n";
msg14 += "Issued At: 2021-09-30T16:25:24.000Z";
console.log(`msg14:\n${msg14}\n`);

let parsedMsg;
parsedMsg = new ParsedMessage(msg14);
console.log(parsedMsg.uriElements.scheme);
console.dir(parsedMsg);
for (let i = 0; i < messages.length; i += 1) {
  // parsedMsg = new ParsedMessage(messages[i]);
  // console.dir(parsedMsg);
  // console.log(`messages[${i}]:\n${messages[i]}`);
}
