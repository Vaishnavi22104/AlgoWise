# Adding a problem walkthrough

Problems work exactly like algorithms (see [ADDING-ALGORITHM.md](ADDING-ALGORITHM.md)) with three differences:

```bash
npm run create-algorithm -- three-sum --problem --title "3Sum"
```

1. The folder is created in `problems/` and `type` is `"problem"`.
2. `metadata.ts` needs a `problem` block:

   ```ts
   problem: {
     number: 15,
     url: "https://leetcode.com/problems/3sum/",
     summary: "Your own one-sentence description of the task.",
   },
   ```

3. The route is `/problems/<slug>`.

## Content rules

AlgoWise publishes **original educational content** and merely **references** third-party problems.

Do store: the problem number, title, difficulty, category, your own short explanation, a small example you wrote, your visualization, your code and your explanations, and a link to the original.

Store a full statement in your OWN words (`problem.statement`: description, examples, constraints, optional follow-up). Do not paste the official text, editorials or images.

A problem and a concept may share an executor (see `problems/binary-search/executor.ts`) as long as both use the same anchor names (see the two `code.ts` files).
