import Snoowrap from "snoowrap";

/**
 * Post to Reddit using the Reddit API via snoowrap
 * Requires Reddit "installed app" credentials from prefs → developer
 */
export async function postReddit({
  subreddit,
  title,
  body,
  mode = "push",
}: {
  subreddit: string;
  title: string;
  body: string;
  mode: "dry-run" | "push" | "schedule";
}) {
  if (mode !== "push") {
    console.log(`[reddit] dry-run → r/${subreddit}: ${title}`);
    return { ok: true, id: "dry-run" };
  }

  const r = new Snoowrap({
    userAgent: "meta/1.0 by VaultSovereign",
    clientId: process.env.REDDIT_CLIENT_ID!,
    clientSecret: process.env.REDDIT_CLIENT_SECRET!,
    username: process.env.REDDIT_USERNAME!,
    password: process.env.REDDIT_PASSWORD!,
  });

  // @ts-expect-error - snoowrap type circular reference issue
  const res = await r.submitSelfpost({
    subredditName: subreddit,
    title,
    text: body,
  });

  const url = `https://reddit.com${res.permalink}`;
  console.log(`[reddit] posted → ${url}`);

  return { ok: true, id: res.id, url };
}
