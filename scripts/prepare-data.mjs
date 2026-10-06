import { mkdir, copyFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const sourceDir = resolve(root, "data");
const targetDir = resolve(root, "public", "data");

await mkdir(targetDir, { recursive: true });

const files = (await readdir(sourceDir)).filter((name) => name.endsWith(".json"));
for (const name of files) {
  await copyFile(resolve(sourceDir, name), resolve(targetDir, name));
}

console.log(`Copied ${files.length} JSON data files to public/data`);
