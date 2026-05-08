import type { TransactionsSortBy, SortDirection, TransactionSortBy } from "../api/utils/types";
import { clampInt } from "./utils";

export function parseIntParam(sp: URLSearchParams, key: string) {
    const raw = sp.get(key);
    if (raw == null) return undefined;
    const n = Number.parseInt(raw, 10);
    return Number.isFinite(n) ? n : undefined;
  }
  
  export function parseSortBy(sp: URLSearchParams): TransactionsSortBy {
    const raw = sp.get("sortBy");
    return raw === "method" ? "method" : "date";
  }
  export function parseTransactionSortByBy(raw: string | null): TransactionSortBy {
    switch (raw) {
      case "date":
      case "id":
      case "buyAmount":
      case "sellAmount":
      case "feeAmount":
      case "method":
      case "network":
        return raw;
      default:
        return "date";
    }
  }
 export function parseSortDir(sp: URLSearchParams): SortDirection {
    return sp.get("sortDir") === "asc" ? "asc" : "desc";
  }
  
  export function readStateFromLocation() {
    const sp = new URLSearchParams(window.location.search);
    const pageSize = clampInt(parseIntParam(sp, "limit") ?? 25, { min: 1, max: 200 });
    const offset = clampInt(parseIntParam(sp, "offset") ?? 0, { min: 0, max: Number.MAX_SAFE_INTEGER });
    const page = Math.floor(offset / pageSize);
    const q = sp.get("q") ?? "";
    const sortBy = parseSortBy(sp);
    const sortDir = parseSortDir(sp);
  
    return { sp, pageSize, page, q, sortBy, sortDir };
  }
  
  export function writeSearchParams(next: URLSearchParams, mode: "push" | "replace") {
    const url = new URL(window.location.href);
    url.search = next.toString();
    if (mode === "replace") window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
    window.dispatchEvent(new PopStateEvent("popstate"));
  }
  