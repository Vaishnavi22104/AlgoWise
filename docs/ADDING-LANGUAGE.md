# Adding a language

Languages never affect the visualization engine, so a new language is only new source text.

1. Add an entry to `LANGUAGES` in `core/algorithm/languages.ts`: `{ id: "cpp", label: "C++", editor: "cpp" }` (`editor` is the Monaco language id).
2. Add `cpp: defineCode(...)` to the `languages` object in an algorithm's `code.ts`, using the **same `//@anchor` names** as the Java and Python versions.
3. Run `npm run test`. `tests/registry.test.ts` checks that every step anchor exists in every language an algorithm offers.

The language selector lists only the languages an algorithm actually provides, so you can add a language one algorithm at a time. If an algorithm has no code in the learner's chosen language, it falls back to Java.

Note: the MVP intentionally ships Java and Python only, and `tests/registry.test.ts` asserts exactly those two. Update that test in the same PR that adds a language.
