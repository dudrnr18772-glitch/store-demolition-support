import fs from "node:fs/promises";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTCCW8ToC9jQZZUZezRjSXYqy3PLdv1HTF6CU8FHIv5MItWpVj3WXxMfStbQOlt-iWPN0OVayCO3Bye/pub?gid=270285574&single=true&output=csv";

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      field = "";
      continue;
    }

    field += char;
  }

  row.push(field);
  if (row.some((value) => value.trim() !== "")) rows.push(row);
  return rows;
}

function normalize(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function rowsToPages(rows) {
  const [headers, ...records] = rows;
  const index = Object.fromEntries(headers.map((header, column) => [normalize(header), column]));
  const required = ["slug", "subject", "title", "description", "H1"];
  for (const column of required) {
    if (!(column in index)) {
      throw new Error(`Missing required CSV column: ${column}`);
    }
  }

  const seen = new Set();
  return records
    .map((record) => ({
      slug: normalize(record[index.slug]),
      subject: normalize(record[index.subject]),
      title: normalize(record[index.title]),
      description: normalize(record[index.description]),
      H1: normalize(record[index.H1]),
    }))
    .filter((page) => {
      if (!page.slug || seen.has(page.slug)) return false;
      seen.add(page.slug);
      return page.subject && page.title && page.description && page.H1;
    });
}

const response = await fetch(CSV_URL);
if (!response.ok) {
  throw new Error(`Failed to download CSV: ${response.status} ${response.statusText}`);
}

const buffer = await response.arrayBuffer();
const csvText = new TextDecoder("utf-8").decode(buffer);
const pages = rowsToPages(parseCsv(csvText));

await fs.mkdir("data", { recursive: true });
await fs.writeFile("data/pages.json", `${JSON.stringify(pages, null, 2)}\n`, "utf8");

console.log(`Synced ${pages.length} pages to data/pages.json`);
