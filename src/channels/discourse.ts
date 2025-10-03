/**
 * Post to self-hosted Discourse forum
 * Requires Admin → API key + username
 */
export async function postDiscourse({
  baseUrl,
  apiKey,
  apiUser,
  title,
  category,
  body,
  mode = "push",
}: {
  baseUrl: string;
  apiKey: string;
  apiUser: string;
  title: string;
  category: number;
  body: string;
  mode?: "dry-run" | "push" | "schedule";
}) {
  if (mode !== "push") {
    console.log(`[discourse] dry-run → ${baseUrl} category ${category}: ${title}`);
    return { ok: true, id: "dry-run" };
  }

  const res = await fetch(`${baseUrl}/posts.json`, {
    method: "POST",
    headers: {
      "Api-Key": apiKey,
      "Api-Username": apiUser,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      raw: body, // markdown supported
      category,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[discourse] failed: ${res.status} ${err}`);
  }

  const j = (await res.json()) as any;
  const url = `${baseUrl}/t/${j?.topic_slug}/${j?.topic_id}`;
  console.log(`[discourse] posted → ${url}`);

  return { ok: true, id: j?.id, url };
}
