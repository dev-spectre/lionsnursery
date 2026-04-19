import { utils, write, type WorkBook } from "xlsx";

export function buildOrdersWorkbook(rows: Record<string, string | number>[]): {
  buffer: Buffer;
  sheetName: string;
} {
  const sheetName = "Orders";
  const ws = utils.json_to_sheet(rows.length ? rows : [{}]);
  const keys = rows.length ? Object.keys(rows[0]!) : [];
  if (keys.length) {
    ws["!cols"] = keys.map((k) => ({
      wch:
        Math.max(
          k.length,
          ...rows.map((r) => String(r[k as keyof typeof r] ?? "").length),
        ) + 2,
    }));
  }
  const wb: WorkBook = utils.book_new();
  utils.book_append_sheet(wb, ws, sheetName);
  const buffer = write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
  return { buffer, sheetName };
}
