import { BaseRow } from "@/redux/tableSlice";

export function toCSV(rows: BaseRow[], visibleCols: string[]) {
  if (!rows.length) return "";

  const headers = visibleCols.length ? visibleCols : Array.from(
    rows.reduce((set, r) => {
      Object.keys(r).forEach((k) => set.add(k));
      return set;
    }, new Set<string>())
  );

  const escape = (v: any) => {
    const s = String(v ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    // RFC4180-ish escaping
  };

  const lines = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h])).join(",")),
  ];
  return lines.join("\n");
}
