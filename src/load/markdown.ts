import matter from "gray-matter";
import { marked } from "marked";
import fs from "node:fs/promises";

export async function loadDraft(p: string) {
  const raw = await fs.readFile(p, "utf8");
  const { data, content, stringify } = matter(raw);
  if (!data.title || !data.slug) throw new Error("front-matter needs title, slug");
  const html = marked.parse(content);
  const frontMatter = stringify(content).split("\n---\n")[0].replace(/^---\n/, "");
  return { meta: data as any, body: content, html, frontMatter };
}
