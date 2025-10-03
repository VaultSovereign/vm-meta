import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";

export async function postBlogger(draft: any) {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/blogger"]
  });
  
  const blogger = google.blogger({ version: "v3", auth });
  const blogId = process.env.BLOGGER_ID!;
  
  // Convert markdown to HTML for Blogger
  const htmlContent = convertMarkdownToHtml(draft.body);
  
  const res = await blogger.posts.insert({
    blogId,
    requestBody: {
      kind: "blogger#post",
      title: draft.meta.title,
      content: htmlContent,
      labels: draft.meta.tags || []
    }
  });
  
  return {
    url: res.data.url,
    id: res.data.id,
    published: res.data.published
  };
}

export async function updateBloggerPost(postId: string, draft: any) {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/blogger"]
  });
  
  const blogger = google.blogger({ version: "v3", auth });
  const blogId = process.env.BLOGGER_ID!;
  
  const htmlContent = convertMarkdownToHtml(draft.body);
  
  const res = await blogger.posts.update({
    blogId,
    postId,
    requestBody: {
      title: draft.meta.title,
      content: htmlContent,
      labels: draft.meta.tags || []
    }
  });
  
  return {
    url: res.data.url,
    updated: res.data.updated
  };
}

export async function scheduleBloggerPost(draft: any, publishDate: Date) {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/blogger"]
  });
  
  const blogger = google.blogger({ version: "v3", auth });
  const blogId = process.env.BLOGGER_ID!;
  
  const htmlContent = convertMarkdownToHtml(draft.body);
  
  const res = await blogger.posts.insert({
    blogId,
    requestBody: {
      kind: "blogger#post",
      title: draft.meta.title,
      content: htmlContent,
      labels: draft.meta.tags || [],
      published: publishDate.toISOString()
    },
    isDraft: true
  });
  
  return {
    url: res.data.url,
    scheduledFor: publishDate.toISOString()
  };
}

function convertMarkdownToHtml(markdown: string): string {
  // Simple markdown to HTML conversion
  // In production, use a proper markdown parser like marked
  return markdown
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
    .replace(/\n/gim, '<br>');
}