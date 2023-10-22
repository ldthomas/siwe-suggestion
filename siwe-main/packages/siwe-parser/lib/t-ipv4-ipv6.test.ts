// import * as fs from "node:fs";
// import { cwd } from "node:process";
// console.log(`Current Working Directory: ${cwd()}`);
import { ParsedMessage } from "./abnf";
import Grammar from "./siwe-grammar.js";
// import apgLib from "apg-js/src/apg-lib/node-exports";
// const grammarObj = new Grammar();
// const dir = "./output";
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

describe("test IPv4 addresses", () => {
  // NOTE: The reason for using the IP-literal form for host to test the IPv4address
  //       is that attempting to test the IPv4address form directly does not correctly
  //       identify malformed IPv4address. If it fails, for example with 1.1.1.256, then
  //       the host rule will simply move on to the reg-name alternative and it will succeed.
  //       That is, host = [1.1.1.256] is valid, but because it is a reg-name not an IPv4address.
  test("bad octets", () => {
    expect(() => {
      doUri("uri://[::0.0.0.256]/p/path");
    }).toThrow();
    expect(() => {
      doUri("uri://[::300.0.0.0]/p/path");
    }).toThrow();
    expect(() => {
      doUri("uri://[::0.ff.0.255]/p/path");
    }).toThrow();
    expect(() => {
      doUri("uri://[::0.0.256.0]/p/path");
    }).toThrow();
  });
  test("IPv4address 1", () => {
    const result = doUri("uri://[::10.10.10.10]");
    expect(result.uriElements.host).toBe("10.10.10.10");
  });
  test("IPv4address 2", () => {
    const result = doUri("uri://000.000.010.001");
    expect(result.uriElements.host).toBe("000.000.010.001");
  });
  test("IPv4address 3", () => {
    const result = doUri("uri://001.099.200.255");
    expect(result.uriElements.host).toBe("001.099.200.255");
  });
});
