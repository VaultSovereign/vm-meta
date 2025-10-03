import { postX } from "./x.js";
import { postLinkedIn } from "./linkedin.js";
import { postReddit } from "./reddit.js";
import { postDiscourse } from "./discourse.js";
import { postLemmy } from "./lemmy.js";

export async function publishChannels({ draft, ogPath, mode, canonicalUrl, copies }:{
  draft:any; ogPath:string; mode:"push"|"schedule"|"dry-run"; canonicalUrl:string; copies?:{x:string;linkedin:string;facebook:string};
}) {
  // X (Twitter)
  if (process.env.CHANNEL_X === "1") {
    const text = copies?.x ?? `New: ${draft.meta.title} → ${canonicalUrl}`;
    await postX(text, ogPath, mode);
  }

  // LinkedIn
  if (process.env.CHANNEL_LI === "1") {
    const text = copies?.linkedin ?? `🔐 ${draft.meta.title}\n\nRead: ${canonicalUrl}`;
    await postLinkedIn(text, mode);
  }

  // Reddit
  if (process.env.CHANNEL_REDDIT === "1") {
    const subreddit = process.env.REDDIT_SUB!;
    const title = draft.meta.title;
    const body = `${copies?.facebook ?? copies?.linkedin ?? draft.meta.title}\n\nRead: ${canonicalUrl}?utm_source=reddit&utm_campaign=${draft.meta.slug}`;
    await postReddit({ subreddit, title, body, mode });
  }

  // Discourse (self-hosted forum)
  if (process.env.CHANNEL_DISCOURSE === "1") {
    const baseUrl = process.env.DISC_BASE!;
    const apiKey = process.env.DISC_API_KEY!;
    const apiUser = process.env.DISC_API_USER!; // e.g., "system"
    const category = Number(process.env.DISC_CATEGORY_ID!); // e.g., 1 for "general"
    const title = draft.meta.title;
    const body = `**${draft.meta.title}**\n\n${copies?.linkedin ?? copies?.facebook ?? ""}\n\nRead: ${canonicalUrl}?utm_source=discourse&utm_campaign=${draft.meta.slug}`;
    await postDiscourse({ baseUrl, apiKey, apiUser, title, category, body, mode });
  }

  // Lemmy (federated community)
  if (process.env.CHANNEL_LEMMY === "1") {
    const base = process.env.LEMMY_BASE!;
    const communityId = Number(process.env.LEMMY_COMMUNITY_ID!);
    const username = process.env.LEMMY_USER!;
    const password = process.env.LEMMY_PASS!;
    const name = draft.meta.title;
    const body = `${copies?.facebook ?? copies?.linkedin ?? ""}\n\nRead: ${canonicalUrl}?utm_source=lemmy&utm_campaign=${draft.meta.slug}`;
    await postLemmy({ base, communityId, name, body, username, password, mode });
  }

  // TODO: facebook, mastodon
}
