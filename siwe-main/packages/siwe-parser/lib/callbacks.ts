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
        // // default data values
        // data.errors = [];
        // data.lineno = 1;
        // data.domain = undefined;
        // data.address = undefined;
        // data.statement = null;
        // data.uri = undefined;
        // data.uriElements = {
        //   scheme: undefined,
        //   authority: null,
        //   userinfo: null,
        //   host: null,
        //   port: null,
        //   path: null,
        //   query: null,
        //   fragment: null,
        // };
        // data.version = undefined;
        // data.chainId = undefined;
        // data.nonce = undefined;
        // data.issuedAt = undefined;
        // data.expirationTime = null;
        // data.notBefore = null;
        // data.requestId = null;
        // data.resources = null;
        break;
      case id.NOMATCH:
        data.errors.push(`invalid message: max line number was ${data.lineno}`);
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
        data.errors.push(`line ${data.lineno}: domain cannot be empty`);
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid domain`);
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
          data.errors.push(
            `line ${data.lineno}: invalid EIP-55 address - ${data.address}`
          );
        }
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid address`);
        break;
    }
  },
  statement: function statement(result, chars, phraseIndex, data) {
    if (result.state === id.MATCH) {
      data.statement = utils.charsToString(
        chars,
        phraseIndex,
        result.phraseLength
      );
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
        data.errors.push(`line ${data.lineno}: invalid version`);
        break;
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
        data.errors.push(`line ${data.lineno}: invalid nonce`);
        break;
    }
  },
  issuedAt: function issuedAt(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.issuedAt = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid issued-at date time`);
        break;
    }
  },
  expirationTime: function expirationTime(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.expirationTime = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.NOMATCH:
        data.errors.push(
          `line ${data.lineno}: invalid expiration-time date time `
        );
        break;
    }
  },
  notBefore: function notBefore(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.notBefore = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid not-before date time`);
        break;
    }
  },
  requestId: function requestId(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.requestId = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.EMPTY:
        data.requestId = "";
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid requestID`);
        break;
    }
  },
  chainId: function chainId(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.chainId = parseIntegerNumber(
          utils.charsToString(chars, phraseIndex, result.phraseLength)
        );
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid chain-id`);
        break;
    }
  },
  uriR: function uriR(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.uriR = utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid resource URI`);
        break;
    }
  },
  resource: function resource(result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        if (!data.resources) {
          data.resources = [];
        }
        data.resources.push(data.uriR);
        delete data.uriR;
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid resource`);
        break;
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
        data.errors.push(`line ${data.lineno}: invalid URI scheme`);
        break;
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
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid URI authority`);
        break;
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
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid URI host`);
        break;
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
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid URI port`);
        break;
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
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid URI path-abempty`);
        break;
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
        data.errors.push(
          `line ${data.lineno}: invalid URI - path-empty must be empty`
        );
      case id.EMPTY:
        data.uriElements.path = "";
        break;
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
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid URI query`);
        break;
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
        break;
      case id.NOMATCH:
        data.errors.push(`line ${data.lineno}: invalid URI fragment`);
        break;
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
        data.errors.push(`line ${data.lineno}: invalid URI`);
        break;
    }
  },
};
