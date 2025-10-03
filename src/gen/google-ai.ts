// src/gen/google-ai.ts
/**
 * Meta: Google AI generators
 * Default: Vertex AI + ADC (no API keys required).
 * Fallback: @google/generative-ai with API key (GOOGLE_API_KEY).
 */
import type { DraftLike } from "./types.js";

const chooseModel = () => process.env.META_GEMINI_MODEL ?? "gemini-1.5-flash-002";
const region = () => process.env.GCP_LOCATION ?? "us-central1";

const prompt = (title: string, body: string, canonical: string) => `
You are Meta, a sovereign publisher's social generator.
Write three platform-specific posts for this article.

Title: ${title}
Canonical: ${canonical}

Body (trimmed):
${body.slice(0, 1500)}

Return JSON with keys:
- x: 280 char hard cap, include 2-4 short hashtags
- linkedin: professional, 4-8 lines, end with a question or CTA, no emojis required
- facebook: general audience, 5-8 short lines, include clear "update now" CTA
Keep links as ${canonical}. Do not include code fences.
`;

export type SocialCopies = { x: string; linkedin: string; facebook: string };

export async function generateWithGoogleAI(draft: DraftLike, canonical: string): Promise<SocialCopies> {
  // Prefer Vertex AI with ADC
  if (process.env.GOOGLE_API_KEY == null) {
    const { VertexAI } = await import("@google-cloud/vertexai");
    const vertex = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT,
      location: region(),
    });
    const model = vertex.getGenerativeModel({ model: chooseModel() });
    const res = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt(draft.meta.title, draft.body, canonical) }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 512 },
    });
    const text = res.response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return parseJsonSocial(text);
  }

  // Fallback: API key mode (@google/generative-ai)
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genai = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genai.getGenerativeModel({ model: chooseModel() });
  const out = await model.generateContent(prompt(draft.meta.title, draft.body, canonical));
  const text = out.response.text();
  return parseJsonSocial(text);
}

// naive but resilient JSON extractor
function parseJsonSocial(s: string): SocialCopies {
  const jsonMatch = s.match(/\{[\s\S]*\}$/);
  const raw = jsonMatch ? jsonMatch[0] : s;
  let obj: any = {};
  try { obj = JSON.parse(raw); } catch { /* fallback below */ }
  return {
    x: obj.x ?? trim(s, 280),
    linkedin: obj.linkedin ?? s.slice(0, 800),
    facebook: obj.facebook ?? s.slice(0, 800),
  };
}

function trim(t: string, n: number) { return t.length <= n ? t : t.slice(0, n - 1) + "…"; }

// Deprecated: kept for backward compat but prefer generateWithGoogleAI
export async function generateSocialCopies(body: string, title: string, tags?: string[]) {
  return generateWithGoogleAI({ meta: { title, slug: "", tags }, body }, "");
}

export async function enhanceDraft(body: string, title: string) {
  // Stub - use Vertex AI for draft enhancement if needed
  return body;
}