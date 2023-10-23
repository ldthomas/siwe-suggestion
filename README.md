### A Suggested apg-js Parser

Sign in with Etherium, [siwe](https://github.com/spruceid/siwe), has a package for parsing the siwe messages with [apg-js](https://www.npmjs.com/package/apg-js). This is primarily done in the file [abnf.ts](https://github.com/spruceid/siwe/blob/main/packages/siwe-parser/lib/abnf.ts). There are several ways in which this parser can be improved.

- The first is to use a pre-generated ABNF grammar object rather than re-generating the object each time a message is parsed.
- The ABNF grammar is relatively simple with only 58 rules and no recursion. Theoretically, it could be parsed with a regular expression similar to that given for the URI in [RFC 3986](https://www.rfc-editor.org/rfc/rfc3986), Appendix B. But I'll stick with apg-js with its named rules and callback functions which can be used to provide better error checking and reporting, among other things.
- The simplicity of the ABNF grammar also indicates that there will be no backtracking over any of the rules (named phrases) of interest. Therefore, we can forego the construction and translation of an AST. All of the rule phrases can be collected and error checked right from the parse tree as the message is being parsed.
- Also, in the current version the URI in the message is parsed twice - once during the apg-js parsing of the full siwe message and then a second time with the depencency [valid-url](https://www.npmjs.com/package/valid-url). This version of the parser will eliminate the need for valid-url by reproducing its parsing and validating during the first and only parsing of the URI with apg-js.
- And finally, the ABNF grammar itself is optimized for the apg-js parser.

### Some Comments on the Final Parser

1. Parsing directly from the parse tree required a considerable amount of rewriting of the ABNF grammar, especially the URI, RFC 3986.
   In the process several problems with RFC 3986 were found. The authors no doubt assumed fully Context-Free Parsing whereas APG
   uses "first-success disambiguation" (sometimes referred to as "prioritized choice") and greedy repetitions.
   In particular, the IPv4address and especially the IPv6address rules are not correctly parsed with APG.
   In these cases, the attempt to describe them completely with plain ABNF was abandonded and they
   were matched and validated semantically in the callback functions.

   - Note that in the case of IPv4 addresses it is difficult to notice when the parse fails because
     the host rule, on IPv4 failure, will then succeed because reg-name will succeed where IPv4 failed.

2. Unit testing will show that the original siwe-parser will fail on many valid URIs.
   Especially those with IPv6 addresses.

3. In a couple of cases [look-ahead operators](https://en.wikipedia.org/wiki/Syntactic_predicate) were required to prevent on rule overrunning into another. Therefore, technically, the grammar is [SABNF](https://sabnf.com/docs/python/md_docs_SABNF.html) rather than the original [ABNF](https://www.rfc-editor.org/rfc/rfc5234).

4. Time tests show that this siwe parser runs about twice as fast as the original. Not as big a gain as I expected, but not a bad improvement.

5. [valid-url](https://www.npmjs.com/package/valid-url) and [uri-js](https://www.npmjs.com/package/uri-js) dependencies have been
   eliminated. However, I have only worked on the siwe-parser package and have not touched the siwe package except to eliminiate
   the place where it validates the URI returned from siwe-parser. This is no longer necessary since the URI is either valid
   or the siwe-parser will fail.

6. I've been winging it with typescript. I probably could have done a better job of taking advantage of it.

### Suggestion only

I should note that this is being done as a suggestion only. I am not familiar with Etherium or the Sign in with Etherium project. Therefore, I am not working with a fork with the intention of submitting a pull request. Perhaps, if the siwe developers have sufficient interest in the version I am suggesting here we can create a pull request or some other means of incorporating the suggestions here.

#### uri-js and valid-url dependencies

This suggestion should eliminate the need for the valid-url dependency. As far as the [uri-js](https://www.npmjs.com/package/uri-js) dependency I'm currently unable to find any place in the siwe project, either the siwe package or the siwe-parser package where it is used. I'm apparently missing something recarding the uri-js dependency.
