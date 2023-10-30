## A Suggested siwe Parser

I've taken the liberty of rewriting the [siwe-parser](https://github.com/spruceid/siwe/tree/main/packages/siwe-parser) I know nothing of Etherium but I've had a lot of experience writing [apg-js](https://www.npmjs.com/package/apg-js) parsers. I'd be happy to reconfigure this as a pull request
if there is sufficient interest from the siwe developers.

### Its Main Features Are:

1. It runs about twice as fast as the original parser.
2. It eliminates the [valid-ur](https://www.npmjs.com/package/valid-url) and [uri-js](https://www.npmjs.com/package/uri-js) dependencenies.
3. It fixes some deficiencies. The current parser fails on some URIs, particularly those with `IPv6address`.
4. It also addresses some silent errors with the `IPv4address` that can happen but go unnoticed because of peculiarities
   in the way the `host` is defined.

I've added a large set of unit tests. I've included all of the RFC 3986 unit tests from [uri-js](https://www.npmjs.com/package/uri-js).
(see `t-uri-js.test.ts`.) This was very informative and is where I picked up most of the problems with `IPv6address`. For eample, the
current parser will fail with a thrown exception parsing an siwe message with

> "URI: uri:[2001:db8::7]\n"

The unit tests in the file `t-ipv4-ipv6.test.ts` give the `IPv6address` a pretty good work out.

As a side note, [valid-url](https://www.npmjs.com/package/valid-url) will accept as valid the `IPv6address`

> uri://[ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff:255.255.255.255]".

### Some Notes

- The parser does not construct and translate an AST. The translations are all done from callback functions on the parse tree.
- In some cases, `IPv4address` and `IPv6address` in particuluar, strict ABNF rules were forgone in favor of capturing
  and validating the phrases semantically in the callback functions.
- In a couple of cases, [look-ahead operators](https://en.wikipedia.org/wiki/Syntactic_predicate) were required to keep one rule from overrunning into the next rule's phrase. Therefore, technically, the grammar is [SABNF](https://sabnf.com/docs/python/md_docs_SABNF.html) rather than the original [ABNF](https://www.rfc-editor.org/rfc/rfc5234).
- `apg-js` is not strictly a Context-Free Grammar parser. It uses "first-success disambiguation" (sometimes referred to as "prioritized choice")
  and greedy repetitions. Because of this and the use of the callback functions directly from the parse tree, the grammar was considerably re-written, especially RFC 3986.
