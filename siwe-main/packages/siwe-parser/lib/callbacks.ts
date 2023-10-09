import apgLib from "apg-js/src/apg-lib/node-exports";
const utils = apgLib.utils;
const id = apgLib.ids;
import { isEIP55Address, parseIntegerNumber } from "./utils";
export const cb = {
  signInWithEtherium: function (result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.ACTIVE:
        if (typeof data !== "object" || data === null) {
          throw new Error("data must be an object");
        }
        // default data values
        data.lineno = 1;
        data.domain = undefined;
        data.address = undefined;
        data.statement = null;
        data.uri = undefined;
        data.uriElements = {
          scheme: undefined,
          authority: null,
          userinfo: null,
          host: null,
          port: null,
          path: null,
          query: null,
          fragment: null,
        };
        data.version = undefined;
        data["chain-id"] = undefined;
        data.nonce = undefined;
        data["issued-at"] = undefined;
        data["expiration-time"] = null;
        data["not-before"] = null;
        data["request-id"] = null;
        data.resources = null;
        break;
      case id.EMPTY:
        break;
      case id.MATCH:
        // do various validations
        delete data.lineno;
        break;
      case id.NOMATCH:
        throw new Error(`invalid message: max line number was ${data.lineno}`);
    }
  },
  lineno: function lineno(result, chars, phraseIndex, data) {
    if (result.state === id.MATCH) {
      data.lineno += 1;
    }
  },
  exTitle: function exTitle(result, chars, phraseIndex, data) {
    if (result.state === id.NOMATCH) {
      data.lineno -= 1;
    }
  },
  nbTitle: function nbTitle(result, chars, phraseIndex, data) {
    if (result.state === id.NOMATCH) {
      data.lineno -= 1;
    }
  },
  riTitle: function riTitle(result, chars, phraseIndex, data) {
    if (result.state === id.NOMATCH) {
      data.lineno -= 1;
    }
  },
  reTitle: function reTitle(result, chars, phraseIndex, data) {
    if (result.state === id.NOMATCH) {
      data.lineno -= 1;
    }
  },
  domain: function domain(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.domain = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.EMPTY:
        throw new Error(`line ${data.lineno}: domain cannot be empty`);
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid domain`);
    }
  },
  address: function address(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.address = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        if (!isEIP55Address(data.address)) {
          throw new Error(
            `line ${data.lineno}: invalid EIP-55 address - ${data.address}`
          );
        }
        break;
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid address`);
    }
  },
  statement: function statement(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.statement = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.EMPTY:
        throw new Error(
          `line ${data.lineno}: statement, if present, may not be empty`
        );
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid statment`);
    }
  },
  version: function version(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.version = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid version`);
    }
  },
  chainId: function chainId(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data["chain-id"] = parseIntegerNumber(
          utils.charsToString(chars, phraseIndex, result.phraseLength)
        );
        // This test is unnecesssary. Grammar only allows valid integers
        // if (!data["chain-id"]) {
        //   throw new Error(
        //     `line ${
        //       data.lineno
        //     }: chain-id does not parse to integer - ${utils.charsToString(
        //       chars,
        //       phraseIndex,
        //       result.phraseLength
        //     )}`
        //   );
        //}
        break;
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid chain-id`);
    }
  },
  nonce: function nonce(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.nonce = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid nonce`);
    }
  },
  issuedAt: function issuedAt(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data["issued-at"] = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid issued-at date time`);
    }
  },
  expirationTime: function expirationTime(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data["expiration-time"] = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.NOMATCH:
        throw new Error(
          `line ${data.lineno}: invalid expiration-time date time `
        );
    }
  },
  notBefore: function notBefore(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data["not-before"] = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid not-before date time`);
    }
  },
  requestId: function requestId(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data["request-id"] = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.EMPTY:
        data["request-id"] = "";
        break;
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid requestID`);
    }
  },
  uriR: function uriR(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data["uri-r"] = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid resource URI`);
    }
  },
  resource: function resource(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        if (!data.resources) {
          data.resources = [];
        }
        data.resources.push(data["uri-r"]);
        delete data["uri-r"];
        break;
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid resource`);
    }
  },
  // handle the URI
  scheme: function scheme(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.uriElements.scheme = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid URI scheme`);
    }
  },
  authority: function authority(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.uriElements.authority = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.EMPTY:
        data.uriElements.authority = "";
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid URI authority`);
    }
  },
  userinfo: function userinfo(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.uriElements.userinfo = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength - 1
        );
        break;
      // case id.EMPTY:
      //   data.uriElements.userinfo = "";
      // case id.NOMATCH:
      //   throw new Error(`line ${data.lineno}: invalid URI userinfo`);
    }
  },
  host: function host(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.uriElements.host = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.EMPTY:
        data.uriElements.host = "";
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid URI host`);
    }
  },
  port: function port(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.uriElements.port = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.EMPTY:
        data.uriElements.port = "";
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid URI port`);
    }
  },
  pathAbempty: function pathAbempty(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.uriElements.path = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.EMPTY:
        data.uriElements.path = "";
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid URI path-abempty`);
    }
  },
  pathAbsolute: function pathAbsolute(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.uriElements.path = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
    }
  },
  pathRootless: function pathRootless(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.uriElements.path = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
    }
  },
  pathEmpty: function pathEmpty(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
      case id.NOMATCH:
        throw new Error(
          `line ${data.lineno}: invalid URI - path-empty must be empty`
        );
      case id.EMPTY:
        data.uriElements.path = "";
        break;
    }
    if (result.state === id.EMPTY) {
    }
  },
  query: function query(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.uriElements.query = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.EMPTY:
        data.uriElements.query = "";
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid URI query`);
    }
  },
  fragment: function fragment(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.uriElements.fragment = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.EMPTY:
        data.uriElements.fragment = "";
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid URI fragment`);
    }
  },
  uri: function URI(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        //NOTE: all "valid-url" tests are satisfied if URI ABNF parsed without error.
        data.uri = utils.charsToString(chars, phraseIndex, result.phraseLength);
        break;
      case id.EMPTY:
      case id.NOMATCH:
        throw new Error(`line ${data.lineno}: invalid URI`);
    }
  },
};
