import Grammar from "../lib/siwe-grammar.js";
import { cb } from "./callbacks";
import apgLib from "apg-js/src/apg-lib/node-exports";
import * as fs from "node:fs";

const id = apgLib.ids;
const doTrace = true;
const dir =
  "/home/ldt/Projects/siwe-suggestion/siwe-main/packages/siwe-parser/output";

export class ParsedMessage {
  domain: string;
  address: string;
  statement: string | null;
  uri: string;
  version: string;
  chainId: number;
  nonce: string;
  issuedAt: string;
  expirationTime: string | null;
  notBefore: string | null;
  requestId: string | null;
  resources: Array<string> | null;
  uriElements: {
    scheme: string;
    authority: string;
    userinfo: string;
    host: string;
    port: string;
    path: string;
    query: string;
    fragment: string;
  };

  constructor(msg: string) {
    const grammarObj = new Grammar();
    const parser = new apgLib.parser();
    parser.callbacks["sign-in-with-ethereum"] = cb.signInWithEtherium;
    parser.callbacks["domain"] = cb.domain;
    parser.callbacks["LF"] = cb.lineno;
    parser.callbacks["ex-title"] = cb.exTitle;
    parser.callbacks["nb-title"] = cb.nbTitle;
    parser.callbacks["ri-title"] = cb.riTitle;
    parser.callbacks["re-title"] = cb.reTitle;
    parser.callbacks["address"] = cb.address;
    parser.callbacks["statement"] = cb.statement;
    parser.callbacks["version"] = cb.version;
    parser.callbacks["chain-id"] = cb.chainId;
    parser.callbacks["nonce"] = cb.nonce;
    parser.callbacks["issued-at"] = cb.issuedAt;
    parser.callbacks["expiration-time"] = cb.expirationTime;
    parser.callbacks["not-before"] = cb.notBefore;
    parser.callbacks["request-id"] = cb.requestId;
    parser.callbacks["uri"] = cb.uri;
    parser.callbacks["uri-r"] = cb.uriR;
    parser.callbacks["resource"] = cb.resource;
    parser.callbacks["scheme"] = cb.scheme;
    parser.callbacks["authority"] = cb.authority;
    parser.callbacks["userinfo-at"] = cb.userinfo;
    parser.callbacks["host"] = cb.host;
    parser.callbacks["port"] = cb.port;
    parser.callbacks["path-abempty"] = cb.pathAbempty;
    parser.callbacks["path-absolute"] = cb.pathAbsolute;
    parser.callbacks["path-rootless"] = cb.pathRootless;
    parser.callbacks["path-empty"] = cb.pathEmpty;
    parser.callbacks["query"] = cb.query;
    parser.callbacks["fragment"] = cb.fragment;
    parser.callbacks["IPv4address"] = cb.ipv4;
    parser.callbacks["nodcolon"] = cb.nodcolon;
    parser.callbacks["dcolon"] = cb.dcolon;
    parser.callbacks["h16"] = cb.h16;
    parser.callbacks["h16c"] = cb.h16;
    parser.callbacks["h16n"] = cb.h16;
    parser.callbacks["h16cn"] = cb.h16;
    parser.callbacks["dec-octet"] = cb.decOctet;
    parser.callbacks["dec-digit"] = cb.decDigit;

    if (doTrace) {
      parser.trace = new apgLib.trace();
      parser.trace.filter.operators["<ALL>"] = true;
      // parser.trace.filter.operators.rep = true;
    }

    // initialize parsed elements
    const elements = {
      errors: [],
      lineno: 1,
      domain: undefined,
      address: undefined,
      statement: null,
      uri: undefined,
      version: undefined,
      chainId: undefined,
      nonce: undefined,
      issuedAt: undefined,
      expirationTime: null,
      notBefore: null,
      requestId: null,
      resources: null,
      uriElements: {
        scheme: undefined,
        authority: undefined,
        userinfo: undefined,
        host: undefined,
        port: undefined,
        path: undefined,
        query: undefined,
        fragment: undefined,
      },
    };
    const result = parser.parse(grammarObj, 0, msg, elements);
    if (doTrace) {
      const html = parser.trace.toHtmlPage("ascii", "siwe, default trace");
      const name = `${dir}/siwe-trace.html`;
      try {
        fs.mkdirSync(dir);
      } catch (e) {
        if (e.code !== "EEXIST") {
          throw new Error(`fs.mkdir failed: ${e.message}`);
        }
      }
      fs.writeFileSync(name, html);
      console.log(`view "${name}" in any browser to display parser's trace`);
    }
    let throwMsg = "";
    for (let i = 0; i < elements.errors.length; i += 1) {
      throwMsg += elements.errors[i] + "\n";
    }
    if (!result.success) {
      throwMsg += `Invalid message: ${JSON.stringify(result)}`;
    }
    if (throwMsg !== "") {
      throw new Error(throwMsg);
    }

    this.domain = elements.domain;
    this.address = elements.address;
    this.statement = elements.statement;
    this.uri = elements.uri;
    this.version = elements.version;
    this.chainId = elements.chainId;
    this.nonce = elements.nonce;
    this.issuedAt = elements.issuedAt;
    this.expirationTime = elements.expirationTime;
    this.notBefore = elements.notBefore;
    this.requestId = elements.requestId;
    this.resources = elements.resources;
    this.uriElements = elements.uriElements;

    // This test has already been done in the parser callback functions "domain()".
    // if (this.domain.length === 0) {
    //   throw new Error("Domain cannot be empty.");
    // }

    // This test has already been done in the parser callback functions "address()".
    // if (!isEIP55Address(this.address)) {
    //   throw new Error("Address not conformant to EIP-55.");
    // }
  }
}
