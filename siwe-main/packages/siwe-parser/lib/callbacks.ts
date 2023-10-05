import apgLib from "apg-js/src/apg-lib/node-exports";
const id = apgLib.ids;
export const cb = {
  signInWithEtherium: function (result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.ACTIVE:
        if (typeof data !== "object" || data === null) {
          throw new Error("data must be an object");
        }
        // default data values
        data.domain = undefined;
        data.address = undefined;
        data.statement = null;
        data.uri = undefined;
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
        if (result.state === id.MATCH) {
          console.log("signInWithEtherium: success");
        }
        break;
      case id.NOMATCH:
        throw new Error("invalid message");
    }
  },
  domain: function (result, chars, phraseIndex, data) {
    switch (result.state) {
      case id.MATCH:
        data.domain = apgLib.utils.charsToString(
          chars,
          phraseIndex,
          result.phraseLength
        );
        break;
      case id.EMPTY:
      case id.NOMATCH:
        throw new Error("domain cannot be empty");
    }
  },
};
