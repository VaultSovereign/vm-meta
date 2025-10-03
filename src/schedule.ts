#!/usr/bin/env node
/**
 * Meta Sheets Scheduler
 * Reads Google Sheets content calendar and publishes flagged items
 * 
 * Usage:
 *   export META_SHEET_ID="1ABC..."
 *   export GOOGLE_CLOUD_PROJECT="your-project"
 *   node dist/schedule.js
 */

import { fetchSchedule, markAsPublished, markAsFailed } from "./google/sheets-calendar.js";
import { loadDraft } from "./load/markdown.js";
import { renderOG } from "./gen/og.js";
import { generateWithGoogleAI } from "./gen/google-ai.js";
import { generateCopies } from "./gen/copies.js";
import { pushBlogPR } from "./blog/push.js";
import { publishChannels } from "./channels/index.js";

const SHEET_ID = process.env.META_SHEET_ID;
if (!SHEET_ID) {
  console.error("❌ META_SHEET_ID not set");
  process.exit(1);
}

const run = async () => {
  console.log("📊 Fetching content calendar from Google Sheets...");
  const items = await fetchSchedule(SHEET_ID);
  
  const publishable = items.filter(item => item.publish && item.slug);
  console.log(`✅ Found ${publishable.length} items to publish`);

  for (let i = 0; i < publishable.length; i++) {
    const item = publishable[i];
    const rowIndex = items.indexOf(item);
    
    console.log(`\n📝 Publishing: ${item.title} (${item.slug})`);
    
    try {
      const draftPath = `drafts/${item.slug}.md`;
      const draft = await loadDraft(draftPath);
      
      if (draft.meta.no_poc !== true) {
        throw new Error("Guard: no_poc must be true");
      }

      const ogPath = await renderOG(draft);
      
      // Use Google AI if any channel is enabled
      const useAI = item.channelX || item.channelLI || item.channelFB;
      const canonical = `${process.env.CANONICAL_BASE ?? "https://blog.vaultmesh.org"}/posts/${draft.meta.slug}`;
      
      const copies = useAI
        ? await generateWithGoogleAI(draft, canonical)
        : await generateCopies(draft, canonical);

      const prInfo = await pushBlogPR({ draft, ogPath, mode: "push" });
      const finalCanonical = prInfo.canonical ?? canonical;

      // Set channel env vars based on Sheet toggles
      const originalX = process.env.CHANNEL_X;
      const originalLI = process.env.CHANNEL_LI;
      
      process.env.CHANNEL_X = item.channelX ? "1" : "0";
      process.env.CHANNEL_LI = item.channelLI ? "1" : "0";

      await publishChannels({ 
        draft, 
        ogPath, 
        mode: "push", 
        canonicalUrl: finalCanonical, 
        copies 
      });

      // Restore original env
      process.env.CHANNEL_X = originalX;
      process.env.CHANNEL_LI = originalLI;

      await markAsPublished(SHEET_ID, rowIndex);
      console.log(`✅ Published: ${item.title} → ${finalCanonical}`);
      
    } catch (error: any) {
      console.error(`❌ Failed to publish ${item.slug}:`, error.message);
      await markAsFailed(SHEET_ID, rowIndex, error.message);
    }
  }

  console.log("\n✅ Scheduling run complete");
};

run().catch(e => {
  console.error("❌ Scheduler failed:", e);
  process.exit(1);
});