/**
 * Post to self-hosted Lemmy (federated Reddit-like community)
 * Uses JWT authentication via /api/v3/user/login
 */

async function lemmyLogin(base: string, username: string, password: string): Promise<string> {
  const r = await fetch(`${base}/api/v3/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username_or_email: username, password }),
  });

  if (!r.ok) {
    const err = await r.text();
    throw new Error(`[lemmy] login failed: ${r.status} ${err}`);
  }

  const j = (await r.json()) as any;
  return j.jwt as string;
}

export async function postLemmy({
  base,
  communityId,
  name,
  body,
  mode = "push",
  username,
  password,
}: {
  base: string;
  communityId: number;
  name: string;
  body: string;
  username: string;
  password: string;
  mode?: "dry-run" | "push" | "schedule";
}) {
  if (mode !== "push") {
    console.log(`[lemmy] dry-run → ${base} community ${communityId}: ${name}`);
    return { ok: true, id: "dry-run" };
  }

  const jwt = await lemmyLogin(base, username, password);
  const r = await fetch(`${base}/api/v3/post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify({
      name,
      community_id: communityId,
      body,
    }),
  });

  if (!r.ok) {
    const err = await r.text();
    throw new Error(`[lemmy] post failed: ${r.status} ${err}`);
  }

  const j = (await r.json()) as any;
  const postId = j?.post_view?.post?.id;
  const url = postId ? `${base}/post/${postId}` : base;
  console.log(`[lemmy] posted → ${url}`);

  return { ok: true, id: postId, url };
}
