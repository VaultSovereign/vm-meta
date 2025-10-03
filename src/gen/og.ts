import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import React from "react";

export async function renderOG(draft:any) {
  // Load at least one font (required by satori)
  // In ESM, we need to construct the path manually
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const fontPath = path.join(__dirname, "../../node_modules/@fontsource/inter/files/inter-latin-400-normal.woff");
  const fontData = await fs.readFile(fontPath);

  const svg = await satori(
    React.createElement("div", { style: {
      width: 1200, height: 630, background: "#0b0f14", color:"#e6edf3", padding: 48,
      display: "flex", flexDirection: "column", fontFamily: "Inter"
    }},
      React.createElement("div", { style: { fontSize: 48, fontWeight: 800 } }, draft.meta.title),
      React.createElement("div", { style: { marginTop: 20, fontSize: 28, color: "#9fb0c0" } },
        draft.meta.tags?.slice(0,3)?.join(" · ") ?? ""),
      React.createElement("div", { style: { marginTop: 40, fontSize: 24 } }, "VaultMesh • meta")
    ),
    { 
      width: 1200, 
      height: 630, 
      fonts: [
        {
          name: "Inter",
          data: fontData,
          weight: 400,
          style: "normal"
        }
      ] 
    }
  );
  const png = new Resvg(svg).render().asPng();
  const out = path.join("dist", draft.meta.slug, "og.png");
  await fs.mkdir(path.dirname(out), { recursive: true });
  await fs.writeFile(out, png);
  return out;
}
