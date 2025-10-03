import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";

export type ContentCalendarRow = {
  title: string;
  slug: string;
  date: string;
  status: string;
  publish: boolean;
  channelX: boolean;
  channelLI: boolean;
  channelFB: boolean;
};

export async function fetchSchedule(sheetId: string, range = "Sheet1!A2:H"): Promise<ContentCalendarRow[]> {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  
  const res = await sheets.spreadsheets.values.get({ 
    spreadsheetId: sheetId, 
    range 
  });

  const rows = res.data.values || [];
  
  return rows.map(r => ({
    title: r[0] || "",
    slug: r[1] || "",
    date: r[2] || "",
    status: r[3] || "Draft",
    publish: r[4] === "✅" || r[4] === "TRUE" || r[4] === "true",
    channelX: r[5] === "✅" || r[5] === "TRUE" || r[5] === "true",
    channelLI: r[6] === "✅" || r[6] === "TRUE" || r[6] === "true",
    channelFB: r[7] === "✅" || r[7] === "TRUE" || r[7] === "true",
  }));
}

export async function getPublishableItems(sheetId: string): Promise<ContentCalendarRow[]> {
  const items = await fetchSchedule(sheetId);
  return items.filter(item => item.publish && item.slug);
}

export async function updateRowStatus(
  sheetId: string, 
  rowIndex: number, 
  status: string
): Promise<void> {
  const auth = new GoogleAuth({
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const sheets = google.sheets({ version: "v4", auth });
  
  // Row 1 is header, so actual row 2 = rowIndex 0
  const range = `Sheet1!D${rowIndex + 2}`;
  
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "RAW",
    requestBody: {
      values: [[status]]
    }
  });
}

export async function markAsPublished(sheetId: string, rowIndex: number): Promise<void> {
  await updateRowStatus(sheetId, rowIndex, "Published");
}

export async function markAsFailed(sheetId: string, rowIndex: number, error: string): Promise<void> {
  await updateRowStatus(sheetId, rowIndex, `Failed: ${error}`);
}