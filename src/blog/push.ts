import fs from "node:fs/promises";
import path from "node:path";
import { exec as _exec } from "node:child_process";
import { promisify } from "node:util";
const exec = promisify(_exec);

export async function pushBlogPR({ draft, ogPath, mode }:{
  draft:any; ogPath:string; mode:"dry-run"|"push"|"schedule";
}) {
  const tmp = `.meta-out/${draft.meta.slug}`;
  const postFile = path.join(tmp, `${draft.meta.slug}.mdx`);
  const ogFile = path.join(tmp, "og.png");

  await fs.mkdir(tmp, { recursive: true });
  const mdx = `---\n${draft.frontMatter}\ncanonicalUrl: ${process.env.CANONICAL_BASE}/${draft.meta.slug}\n---\n${draft.body}\n`;
  await fs.writeFile(postFile, mdx);
  await fs.copyFile(ogPath, ogFile);

  if (mode === "dry-run") {
    return { pr: "dry-run", canonical: `${process.env.CANONICAL_BASE}/posts/${draft.meta.slug}` };
  }

  // prepare a branch in the blog repo and open PR via gh
  const repo = process.env.SITE_REPO!;     // e.g., VaultSovereign/blog
  const branch = `meta/${draft.meta.slug}`;
  await exec(`rm -rf .meta-blog && gh repo clone ${repo} .meta-blog`);
  process.chdir(".meta-blog");
  await exec(`git checkout -b ${branch}`);

  const postsDir = process.env.SITE_POSTS_DIR ?? "posts";
  const ogDir = process.env.SITE_OG_DIR ?? "public/og";
  await fs.mkdir(path.join(postsDir), { recursive: true });
  await fs.mkdir(path.join(ogDir), { recursive: true });

  await fs.copyFile(path.join("..", tmp, `${draft.meta.slug}.mdx`), path.join(postsDir, `${draft.meta.slug}.mdx`));
  await fs.copyFile(path.join("..", tmp, "og.png"), path.join(ogDir, `${draft.meta.slug}.png`));

  await exec(`git add . && git commit -m "meta: publish ${draft.meta.slug}" && git push -u origin ${branch}`);
  await exec(`gh pr create --fill --title "meta: ${draft.meta.title}" --body "Automated publish via meta"`);
  const canonical = `${process.env.CANONICAL_BASE}/posts/${draft.meta.slug}`;
  return { pr: "created", canonical };
}
