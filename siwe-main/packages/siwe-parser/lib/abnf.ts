import Grammar from "../lib/siwe-grammar.js";
import { cb } from "./callbacks";
import apgLib from "apg-js/src/apg-lib/node-exports";
import * as fs from "node:fs";
// import * as utils from "apg-js/src/apg-lib/utilities";
// import { isEIP55Address, parseIntegerNumber } from "./utils";

const id = apgLib.ids;
const doTrace = false;
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

  constructor(msg: string) {
    const grammarObj = new Grammar();
    const parser = new apgLib.parser();
    if (doTrace) {
      parser.trace = new apgLib.trace();
    }

    const elements = {};
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
    parser.callbacks["nonce"] = cb.nonce;
    parser.callbacks["issued-at"] = cb.issuedAt;
    parser.callbacks["expiration-time"] = cb.expirationTime;
    parser.callbacks["not-before"] = cb.notBefore;
    parser.callbacks["request-id"] = cb.requestId;
    parser.callbacks["uri-r"] = cb.uriR;
    parser.callbacks["resource"] = cb.resource;
    parser.callbacks["scheme"] = cb.scheme;
    parser.callbacks["userinfo"] = cb.userinfo;
    parser.callbacks["host"] = cb.host;
    parser.callbacks["port"] = cb.port;
    parser.callbacks["path-abempty"] = cb.pathAbempty;
    parser.callbacks["path-absolute"] = cb.pathAbsolute;
    parser.callbacks["path-rootless"] = cb.pathRootless;
    parser.callbacks["path-empty"] = cb.pathEmpty;
    parser.callbacks["query"] = cb.query;
    parser.callbacks["fragment"] = cb.fragment;
    parser.callbacks["uri"] = cb.uri;
    const result = parser.parse(grammarObj, 0, msg, elements);
    console.log("parsed elements");
    console.dir(elements);
    console.log("\nparser result");
    console.dir(result);
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
    if (!result.success) {
      throw new Error(`Invalid message: ${JSON.stringify(result)}`);
    }

    for (const [key, value] of Object.entries(elements)) {
      this[key] = value;
    }

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
/*
    const address = function (state, chars, phraseIndex, phraseLength, data) {
      const ret = id.SEM_OK;
      if (state === id.SEM_PRE) {
        data.address = apgLib.utils.charsToString(
          chars,
          phraseIndex,
          phraseLength
        );
      }
      return ret;
    };

    const statement = function (state, chars, phraseIndex, phraseLength, data) {
      const ret = id.SEM_OK;
      if (state === id.SEM_PRE) {
        data.statement = apgLib.utils.charsToString(
          chars,
          phraseIndex,
          phraseLength
        );
      }
      return ret;
    };
    const uri = function (state, chars, phraseIndex, phraseLength, data) {
      const ret = id.SEM_OK;
      if (state === id.SEM_PRE) {
        if (!data.uri) {
          data.uri = apgLib.utils.charsToString(
            chars,
            phraseIndex,
            phraseLength
          );
        }
      }
      return ret;
    };
    const version = function (state, chars, phraseIndex, phraseLength, data) {
      const ret = id.SEM_OK;
      if (state === id.SEM_PRE) {
        data.version = apgLib.utils.charsToString(
          chars,
          phraseIndex,
          phraseLength
        );
      }
      return ret;
    };
    const chainId = function (state, chars, phraseIndex, phraseLength, data) {
      const ret = id.SEM_OK;
      if (state === id.SEM_PRE) {
        data.chainId = parseIntegerNumber(
          apgLib.utils.charsToString(chars, phraseIndex, phraseLength)
        );
      }
      return ret;
    };
    const nonce = function (state, chars, phraseIndex, phraseLength, data) {
      const ret = id.SEM_OK;
      if (state === id.SEM_PRE) {
        data.nonce = apgLib.utils.charsToString(
          chars,
          phraseIndex,
          phraseLength
        );
      }
      return ret;
    };
    const issuedAt = function (state, chars, phraseIndex, phraseLength, data) {
      const ret = id.SEM_OK;
      if (state === id.SEM_PRE) {
        data.issuedAt = apgLib.utils.charsToString(
          chars,
          phraseIndex,
          phraseLength
        );
      }
      return ret;
    };
    const expirationTime = function (
      state,
      chars,
      phraseIndex,
      phraseLength,
      data
    ) {
      const ret = id.SEM_OK;
      if (state === id.SEM_PRE) {
        data.expirationTime = apgLib.utils.charsToString(
          chars,
          phraseIndex,
          phraseLength
        );
      }
      return ret;
    };
    const notBefore = function (state, chars, phraseIndex, phraseLength, data) {
      const ret = id.SEM_OK;
      if (state === id.SEM_PRE) {
        data.notBefore = apgLib.utils.charsToString(
          chars,
          phraseIndex,
          phraseLength
        );
      }
      return ret;
    };
    const requestId = function (state, chars, phraseIndex, phraseLength, data) {
      const ret = id.SEM_OK;
      if (state === id.SEM_PRE) {
        data.requestId = apgLib.utils.charsToString(
          chars,
          phraseIndex,
          phraseLength
        );
      }
      return ret;
    };
    const resources = function (state, chars, phraseIndex, phraseLength, data) {
      const ret = id.SEM_OK;
      if (state === id.SEM_PRE) {
        data.resources = apgLib.utils
          .charsToString(chars, phraseIndex, phraseLength)
          .slice(3)
          .split("\n- ");
      }
      return ret;
    };
*/
