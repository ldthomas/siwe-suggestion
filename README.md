### A Suggested apg-js Parser

Sign in with Etherium, [siwe](https://github.com/spruceid/siwe), has a package for parsing the siwe messages with [apg-js](https://www.npmjs.com/package/apg-js). This is primarily done in the file [abnf.ts](https://github.com/spruceid/siwe/blob/main/packages/siwe-parser/lib/abnf.ts). There are several ways in which this parser can be improved.

- The first is to use a pre-generated ABNF grammar object rather than re-generating the object each time a message is parsed.
- The ABNF grammar is relatively simple with only 58 rules and no recursion. Theoretically, it could be parsed with a regular expression similar to that given for the URI in [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986), Appendix B. But I'll stick with apg-js with its named rules and callback functions which can be used to provide better error checking and reporting, among other things.
- The simplicity of the ABNF grammar also indicates that there will be no backtracking over any of the rules (named phrases) of interest. Therefore, we can forego the construction and translation of an AST. All of the rule phrases can be collected and error checked right from the parse tree as the message is being parsed.
- Also, in the current version the URI in the message is parsed twice - once during the apg-js parsing of the full siwe message and then a second time with the depencency [valid-url](https://www.npmjs.com/package/valid-url). This version of the parser will eliminate the need for valid-url by reproducing its parsing and validating during the first and only parsing of the URI with apg-js.
- And finally, the ABNF grammar itself is optimized for the apg-js parser.

### Suggestion only

I should note that this is being done as a suggestion only. I am not familiar with Etherium or the Sign in with Etherium project. Therefore, I am not working with a fork with the intention of submitting a pull request. Perhaps, if the siwe developers have sufficient interest in the version I am suggesting here we can create a pull request or some other means of incorporating the suggestions here.

#### uri-js and valid-url dependencies

This suggestion should eliminate the need for the valid-url dependency. As far as the [uri-js](https://www.npmjs.com/package/uri-js) dependency I'm currently unable to find any place in the siwe project, either the siwe package or the siwe-parser package where it is used. I'm apparently missing something recarding the uri-js dependency.
