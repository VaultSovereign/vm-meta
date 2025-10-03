import { loadDraft } from "./load/markdown.js";
import { renderOG } from "./gen/og.js";
import { generateCopies } from "./gen/copies.js";
import { generateWithGoogleAI } from "./gen/google-ai.js";
import { pushBlogPR } from "./blog/push.js";
import { publishChannels } from "./channels/index.js";
import { postBlogger } from "./channels/blogger.js";

const args = process.argv.slice(2);
const file = args.find(a => a.endsWith(".md") || a.endsWith(".mdx"));
const google = args.includes("--google");
const useBlogger = args.includes("--blogger");
const mode = (args.find(a => ["dry-run","push","schedule"].includes(a)) ?? "dry-run") as "dry-run"|"push"|"schedule";

if (!file) { 
  console.error("Usage: meta <draft.md> [dry-run|push|schedule] [--google] [--blogger]"); 
  process.exit(1); 
}

const run = async () => {
  let draft = await loadDraft(file);                  // {meta, body, html, fm}
  if (draft.meta.no_poc !== true) throw new Error("Guard: set no_poc: true");

  const ogPath = await renderOG(draft);                 // dist/<slug>/og.png
  
  let prInfo;
  if (useBlogger && process.env.BLOGGER_ID) {
    // Publish to Blogger instead of GitHub
    console.log("📝 Publishing to Blogger...");
    const bloggerResult = await postBlogger(draft);
    prInfo = { pr: "blogger", canonical: bloggerResult.url };
  } else {
    // Traditional GitHub PR workflow
    prInfo = await pushBlogPR({ draft, ogPath, mode }); // open PR or direct commit
  }
  const canonical = prInfo.canonical ?? `${process.env.CANONICAL_BASE ?? "https://blog.vaultmesh.org"}/posts/${draft.meta.slug}`;

  // social copies
  const copies = google
    ? await generateWithGoogleAI(draft, canonical)
    : await generateCopies(draft, canonical);

  // optional: social channels (use env flags to enable)
  await publishChannels({ draft, ogPath, mode, canonicalUrl: canonical, copies });

  console.log(`✅ meta done → ${canonical}`);
};
run().catch(e => { console.error(e); process.exit(1); });
