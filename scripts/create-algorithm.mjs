#!/usr/bin/env node
/**
 * npm run create-algorithm -- <slug> [--problem] [--title "Nice Title"]
 *
 * Copies algorithms/_template, renames it, and registers it in content/index.ts.
 */
import { cpSync, existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const isProblem = args.includes("--problem");
const titleIdx = args.indexOf("--title");
const titleArg = titleIdx >= 0 ? args[titleIdx + 1] : undefined;

if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('Usage: npm run create-algorithm -- <kebab-case-slug> [--problem] [--title "Title"]');
  process.exit(1);
}

const words = slug.split("-");
const title = titleArg ?? words.map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
const camel = words.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join("");
const pascal = camel[0].toUpperCase() + camel.slice(1);
const baseDir = isProblem ? "problems" : "algorithms";
const target = join(root, baseDir, slug);

if (existsSync(target)) {
  console.error(`${baseDir}/${slug} already exists.`);
  process.exit(1);
}

cpSync(join(root, "algorithms", "_template"), target, { recursive: true });

const rewrite = (dir) => {
  for (const name of readdirSync(dir)) {
    const file = join(dir, name);
    if (statSync(file).isDirectory()) continue;
    let text = readFileSync(file, "utf8")
      .replaceAll("template-algorithm", slug)
      .replaceAll("Template Algorithm", title)
      .replaceAll("TemplateAlgorithm", pascal)
      .replaceAll("templateAlgorithm", camel);
    if (isProblem) {
      text = text
        .replace('type: "concept", // "concept" lives in /algorithms, "problem" lives in /problems', 'type: "problem",')
        .replace(
          /  related: \[\],[^\n]*\n/,
          `  related: [],\n  // Required for problems: our own summary plus a link to the official statement. Write the statement in your own words; never paste the original text.\n  problem: {\n    number: 0, // TODO: problem number\n    url: "https://leetcode.com/problems/${slug}/",\n    summary: "TODO: one original sentence describing the task.",\n    statement: {\n      description: ["TODO: describe the task and the input in your own words."],\n      examples: [{ input: "TODO", output: "TODO", explanation: "TODO" }],\n      constraints: ["TODO"],\n    },\n  },\n`,
        );
    }
    writeFileSync(file, text);
  }
};
rewrite(target);

// Register in the content manifest.
const manifestPath = join(root, "content", "index.ts");
let manifest = readFileSync(manifestPath, "utf8");
const importLine = `import ${camel} from "@/${baseDir}/${slug}";`;
manifest = manifest
  .replace("// </create-algorithm:imports>", `${importLine}\n// </create-algorithm:imports>`)
  .replace("  // </create-algorithm:list>", `  ${camel},\n  // </create-algorithm:list>`);
writeFileSync(manifestPath, manifest);

console.log(`Created ${baseDir}/${slug} and registered it in content/index.ts.\n`);
console.log("Next steps:");
console.log(`  1. Edit ${baseDir}/${slug}/metadata.ts, code.ts, executor.ts and visualization.ts`);
console.log(`  2. npm run dev  ->  open ${isProblem ? "/problems/" : "/visualize/"}${slug}`);
console.log("  3. npm run lint && npm run test && npm run build");
