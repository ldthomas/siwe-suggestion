import * as fs from "node:fs";
import { cwd } from "node:process";
console.log(`Current Working Directory: ${cwd()}`);
import { ParsedMessage } from "./abnf";
import Grammar from "../lib/siwe-grammar.js";
import apgLib from "apg-js/src/apg-lib/node-exports";
// const id = apgLib.ids;
const grammarObj = new Grammar();
const alpha = "abcdefghijklmnopqrstuvwxyz";
const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const digit = "0123456789";
const unreservedS = "-._~";
const unreserved = alpha + ALPHA + digit + unreservedS;
const genDelims = ":/?#[]@";
const subDelims = "!$&'()*+,;=";
const reserved = genDelims + subDelims;
const pctEncoded = "%00%ff%FF%0a%0A%20";
const pchar = unreserved + subDelims + ":@" + pctEncoded;
const statement = reserved + unreserved + " ";
const scheme = alpha + ALPHA + digit + "+-.";
const userinfo = unreserved + subDelims + ":" + pctEncoded;
const IPvFuture = "v123." + unreserved + subDelims + ":";
const regName = unreserved + subDelims + pctEncoded;
const fragment = pchar + "/?";
const dir = "./output";
const doParse = function doParse(rule, input, doTrace) {
  const parser = new apgLib.parser();
  if (doTrace) {
    parser.trace = new apgLib.trace();
    parser.trace.filter.operators["<ALL>"] = true;
  }
  const result = parser.parse(grammarObj, rule, input);
  if (doTrace) {
    const html = parser.trace.toHtmlPage("ascii", "siwe, default trace");
    const name = `${dir}/siwe-${rule}.html`;
    try {
      fs.mkdirSync(dir);
    } catch (e) {
      if (e.code !== "EEXIST") {
        throw new Error(`fs.mkdir failed: ${e.message}`);
      }
    }
    fs.writeFileSync(name, html);
    console.log(`view "${name}" in any browser to display parser's trace`);
    console.dir(result);
  }
  return result;
};
const doUri = function doUri(uri: string) {
  let msg14 = "";
  msg14 += "service.org wants you to sign in with your Ethereum account:\n";
  msg14 += "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2\n";
  msg14 += "\n";
  msg14 += "\n";
  msg14 += `URI: ${uri}\n`;
  msg14 += "Version: 1\n";
  msg14 += "Chain ID: 1\n";
  msg14 += "Nonce: 32891757\n";
  msg14 += "Issued At: 2021-09-30T16:25:24.000Z";
  return new ParsedMessage(msg14);
};

// test getting siwe messages
// const parsingPositive: Object = require("../../../test/parsing_positive.json");
// Object.keys(parsingPositive).forEach((e) => {
//   console.log(`key=${e} `);
//   console.log(parsingPositive[e].message);
// });
// test getting siwe messages

describe("uir-js tests", () => {
  test("scheme", () => {
    const result = doUri("uri:");
    console.dir(result);
    expect(result.uriElements.scheme).toBe("uri");
    expect(result.uriElements.authority).toBeUndefined();
    expect(result.uriElements.userinfo).toBeUndefined();
    expect(result.uriElements.host).toBeUndefined();
    expect(result.uriElements.port).toBeUndefined();
    expect(result.uriElements.path).toBe("");
    expect(result.uriElements.query).toBeUndefined();
    expect(result.uriElements.fragment).toBeUndefined();
  });
  test("userinfo", () => {
    const result = doUri("uri://@");
    expect(result.uriElements.scheme).toBe("uri");
    expect(result.uriElements.authority).toBe("@");
    expect(result.uriElements.userinfo).toBe("");
    expect(result.uriElements.host).toBe("");
    expect(result.uriElements.port).toBeUndefined();
    expect(result.uriElements.path).toBe("");
    expect(result.uriElements.query).toBeUndefined();
    expect(result.uriElements.fragment).toBeUndefined();
  });
  test("host", () => {
    const result = doUri("uri://");
    expect(result.uriElements.scheme).toBe("uri");
    expect(result.uriElements.authority).toBe("");
    expect(result.uriElements.userinfo).toBeUndefined();
    expect(result.uriElements.host).toBe("");
    expect(result.uriElements.port).toBeUndefined();
    expect(result.uriElements.path).toBe("");
    expect(result.uriElements.query).toBeUndefined();
    expect(result.uriElements.fragment).toBeUndefined();
  });
  test("port", () => {
    const result = doUri("uri://:");
    // console.dir(result);
    expect(result.uriElements.scheme).toBe("uri");
    expect(result.uriElements.authority).toBe(":");
    expect(result.uriElements.userinfo).toBeUndefined();
    expect(result.uriElements.host).toBe("");
    expect(result.uriElements.port).toBe("");
    expect(result.uriElements.path).toBe("");
    expect(result.uriElements.query).toBeUndefined();
    expect(result.uriElements.fragment).toBeUndefined();
  });
  test("query", () => {
    const result = doUri("uri:?");
    // console.dir(result);
    expect(result.uriElements.scheme).toBe("uri");
    expect(result.uriElements.authority).toBeUndefined();
    expect(result.uriElements.userinfo).toBeUndefined();
    expect(result.uriElements.host).toBeUndefined();
    expect(result.uriElements.port).toBeUndefined();
    expect(result.uriElements.path).toBe("");
    expect(result.uriElements.query).toBe("");
    expect(result.uriElements.fragment).toBeUndefined();
  });
  test("fragment", () => {
    const result = doUri("uri:#");
    // console.dir(result);
    expect(result.uriElements.scheme).toBe("uri");
    expect(result.uriElements.authority).toBeUndefined();
    expect(result.uriElements.userinfo).toBeUndefined();
    expect(result.uriElements.host).toBeUndefined();
    expect(result.uriElements.port).toBeUndefined();
    expect(result.uriElements.path).toBe("");
    expect(result.uriElements.query).toBeUndefined();
    expect(result.uriElements.fragment).toBe("");
  });
  test("all", () => {
    const result = doUri(
      "uri://user:pass@example.com:123/one/two.three?q1=a1&q2=a2#body"
    );
    // console.dir(result);
    expect(result.uriElements.scheme).toBe("uri");
    expect(result.uriElements.authority).toBe("user:pass@example.com:123");
    expect(result.uriElements.userinfo).toBe("user:pass");
    expect(result.uriElements.host).toBe("example.com");
    expect(result.uriElements.port).toBe("123");
    expect(result.uriElements.path).toBe("/one/two.three");
    expect(result.uriElements.query).toBe("q1=a1&q2=a2");
    expect(result.uriElements.fragment).toBe("body");
  });
  test("IPv4address", () => {
    const result = doUri("uri://10.10.10.10");
    // console.dir(result);
    expect(result.uriElements.scheme).toBe("uri");
    expect(result.uriElements.authority).toBe("10.10.10.10");
    expect(result.uriElements.userinfo).toBeUndefined();
    expect(result.uriElements.host).toBe("10.10.10.10");
    expect(result.uriElements.port).toBeUndefined();
    expect(result.uriElements.path).toBe("");
    expect(result.uriElements.query).toBeUndefined();
    expect(result.uriElements.fragment).toBeUndefined();
  });
  test.only("IPv6address", () => {
    const result = doUri("uri://[2001:db8::7]");
    // console.dir(result);
    expect(result.uriElements.scheme).toBe("uri");
    expect(result.uriElements.authority).toBe("[2001:db8::7]");
    expect(result.uriElements.userinfo).toBeUndefined();
    expect(result.uriElements.host).toBe("[2001:db8::7]");
    expect(result.uriElements.port).toBeUndefined();
    expect(result.uriElements.path).toBe("");
    expect(result.uriElements.query).toBeUndefined();
    expect(result.uriElements.fragment).toBeUndefined();
  });
});
describe("test strings with explicit special character definitions", () => {
  test("test pchar", () => {
    const rule = "segment-nz";
    let result = doParse(rule, pchar, false);
    expect(result.success).toBe(true);
    result = doParse(rule, pchar + "/", false);
    expect(result.success).toBe(false);
    result = doParse(rule, pchar + "?", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "/", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "?", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "#", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "[", false);
    expect(result.success).toBe(false);
  });
  test("test statment", () => {
    const rule = "statement";
    let result = doParse(rule, statement, false);
    expect(result.success).toBe(true);
    result = doParse(rule, "<", false);
    expect(result.success).toBe(false);
    result = doParse(rule, ">", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "{", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "|", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "}", false);
    expect(result.success).toBe(false);
  });
  test("test scheme", () => {
    const rule = "scheme";
    let result = doParse(rule, scheme, false);
    expect(result.success).toBe(true);
    result = doParse(rule, ":", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "#", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "?", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "@", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "!", false);
    expect(result.success).toBe(false);
  });
  test("test userinfo", () => {
    const rule = "userinfo";
    let result = doParse(rule, userinfo, false);
    expect(result.success).toBe(true);
    result = doParse(rule, "/", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "#", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "?", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "@", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "[", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "]", false);
    expect(result.success).toBe(false);
  });
  test("test IPvFuture", () => {
    const rule = "IPvFuture";
    let result = doParse(rule, IPvFuture, false);
    expect(result.success).toBe(true);
    result = doParse(rule, "/", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "#", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "?", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "@", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "[", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "]", false);
    expect(result.success).toBe(false);
  });
  test("test reg-name", () => {
    const rule = "reg-name";
    let result = doParse(rule, regName, false);
    expect(result.success).toBe(true);
    result = doParse(rule, "/", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "#", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "?", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "@", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "[", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "]", false);
    expect(result.success).toBe(false);
  });
  test("test fragment", () => {
    const rule = "fragment";
    let result = doParse(rule, fragment, false);
    expect(result.success).toBe(true);
    result = doParse(rule, "#", false);
    expect(result.success).toBe(false);
    result = doParse(rule, "[", false);
    expect(result.success).toBe(false);
  });
});
