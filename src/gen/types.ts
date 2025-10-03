// src/gen/types.ts
export type DraftMeta = {
  title: string;
  slug: string;
  tags?: string[];
  no_poc?: boolean;
};
export type DraftLike = { meta: DraftMeta; body: string };
