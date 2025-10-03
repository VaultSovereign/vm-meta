import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import fs from "node:fs/promises";
import matter from "gray-matter";

export async function syncFromDocs(docId: string, outputPath: string) {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/documents.readonly"]
  });

  const docs = google.docs({ version: "v1", auth });
  
  const doc = await docs.documents.get({
    documentId: docId
  });

  // Extract text content from Google Docs
  const content = extractTextFromDoc(doc.data);
  
  // Parse title and convert to markdown format
  const title = doc.data.title || "Untitled";
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  
  const frontMatter = {
    title,
    slug,
    no_poc: true,
    tags: ["Security"], // Default tags, can be enhanced with AI
    source: "google-docs",
    docId
  };

  const markdown = matter.stringify(content, frontMatter);
  await fs.writeFile(outputPath, markdown);
  
  return { title, slug, path: outputPath };
}

export async function syncToDocs(draftPath: string, docId?: string) {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/documents"]
  });

  const docs = google.docs({ version: "v1", auth });
  const drive = google.drive({ version: "v3", auth });

  const content = await fs.readFile(draftPath, "utf-8");
  const { data: frontMatter, content: body } = matter(content);

  if (!docId) {
    // Create new document
    const doc = await docs.documents.create({
      requestBody: {
        title: frontMatter.title || "Meta Draft"
      }
    });
    docId = doc.data.documentId!;
  }

  // Update document content
  await docs.documents.batchUpdate({
    documentId: docId,
    requestBody: {
      requests: [{
        insertText: {
          location: { index: 1 },
          text: body
        }
      }]
    }
  });

  return { docId, url: `https://docs.google.com/document/d/${docId}` };
}

export async function listDraftFolder(folderId: string) {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/drive.readonly"]
  });

  const drive = google.drive({ version: "v3", auth });
  
  const files = await drive.files.list({
    q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.document'`,
    fields: "files(id, name, modifiedTime)"
  });

  return files.data.files || [];
}

function extractTextFromDoc(doc: any): string {
  let text = "";
  
  if (doc.body && doc.body.content) {
    for (const element of doc.body.content) {
      if (element.paragraph) {
        for (const textElement of element.paragraph.elements || []) {
          if (textElement.textRun) {
            text += textElement.textRun.content;
          }
        }
      }
    }
  }
  
  return text;
}