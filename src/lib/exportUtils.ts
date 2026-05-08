type Header = { key: string; label: string };

function csvEscape(value: unknown): string {
  if (value == null) return "";
  const s = value instanceof Date ? value.toISOString() : String(value);
  const normalized = s.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  if (/[",\n]/.test(normalized)) return `"${normalized.replaceAll('"', '""')}"`;
  return normalized;
}

function inferHeaders(rows: Record<string, unknown>[]): Header[] {
  const keys = new Set<string>();
  for (const row of rows) for (const k of Object.keys(row)) keys.add(k);
  return Array.from(keys).map((key) => ({ key, label: key }));
}

export function exportToCSV(opts: { filename: string; rows: Record<string, unknown>[]; headers?: Header[] }) {
  const headers = opts.headers?.length ? opts.headers : inferHeaders(opts.rows);

  const headerRow = headers.map((h) => csvEscape(h.label)).join(",");
  const bodyRows = opts.rows.map((row) => headers.map((h) => csvEscape(row[h.key])).join(","));
  const csv = [headerRow, ...bodyRows].join("\r\n");

  // UTF-8 BOM improves Excel compatibility.
  const blob = new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = opts.filename.toLowerCase().endsWith(".csv") ? opts.filename : `${opts.filename}.csv`;
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    window.URL.revokeObjectURL(url);
  }
}

