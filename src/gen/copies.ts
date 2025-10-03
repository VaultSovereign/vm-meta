export async function generateCopies(draft: any, canonicalUrl?: string) {
  const url =
    canonicalUrl ??
    `${process.env.CANONICAL_BASE ?? "https://blog.vaultmesh.org"}/posts/${draft.meta.slug}?utm_source=social&utm_campaign=${process.env.UTM_CAMPAIGN ?? "default"}`;
  const base = `${draft.meta.title} — Update now → ${url}`;
  const x = `${base} #CyberSecurity #Chrome`;
  const linkedin = `${draft.meta.title}\n\n${summary(draft)}\n\nRead: ${url}`;
  const fb = `Update Chrome now. ${summary(draft)}\nHow-to: ${url}`;
  const devto = { title: draft.meta.title, body: draft.body + `\n\n---\nCanonical: ${url}` };
  return { x: trim(x, 280), linkedin, facebook: fb, devto };
}

function summary(d: any) {
  return `High-severity WebGPU heap overflow (CVE-2025-11205). Patch to 141.0.7390.54+.`;
}
function trim(s: string, n: number) { return s.length <= n ? s : s.slice(0, n - 1) + "…"; }
