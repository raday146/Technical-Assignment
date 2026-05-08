import type { QueryParamsDto } from "@/api/services/dto";
import { ValidationError } from "@/api/utils/errors";
import type { SortDirection, TransactionFilter, TransactionSortBy } from "@/api/utils/types";
import { DEFAULT_LIMIT, MIN_LIMIT, MAX_LIMIT, MAX_OFFSET, SORT_WHITELIST } from "./constants";



function parseIntParam(raw: string | null): number | undefined {
  if (raw == null || raw === "") return undefined;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n)) return undefined;
  return n;
}

function parseLimit(searchParams: URLSearchParams): number {
  if (!searchParams.has("limit")) return DEFAULT_LIMIT;
  const parsed = parseIntParam(searchParams.get("limit"));
  if (parsed === undefined || parsed < MIN_LIMIT || parsed > MAX_LIMIT) {
    throw new ValidationError(`Invalid limit: must be an integer between ${MIN_LIMIT} and ${MAX_LIMIT}`);
  }
  return parsed;
}

function parseOffset(searchParams: URLSearchParams): number {
  if (!searchParams.has("offset")) return 0;
  const parsed = parseIntParam(searchParams.get("offset"));
  if (parsed === undefined || parsed < 0 || parsed > MAX_OFFSET) {
    throw new ValidationError(`Invalid offset: must be an integer between 0 and ${MAX_OFFSET}`);
  }
  return parsed;
}

function parseSortBy(raw: string | null): TransactionSortBy {
  if (raw == null || raw === "") return "date";
  if (SORT_WHITELIST.has(raw as TransactionSortBy)) return raw as TransactionSortBy;
  throw new ValidationError(`Invalid sortBy: must be one of ${[...SORT_WHITELIST].join(", ")}`);
}

function parseSortDir(raw: string | null): SortDirection {
  if (raw == null || raw === "") return "desc";
  if (raw === "asc" || raw === "desc") return raw;
  throw new ValidationError("Invalid sortDir: must be asc or desc");
}

function parseOptionalMsTimestamp(raw: string | null, field: "dateFrom" | "dateTo"): number | undefined {
  if (raw == null || raw === "") return undefined;
  const parsed = parseIntParam(raw);
  if (parsed === undefined) {
    throw new ValidationError(`Invalid ${field}: must be a Unix timestamp in milliseconds`);
  }
  return parsed;
}

function buildFilter(
  qRaw: string | null,
  methodRaw: string | null,
  networkRaw: string | null,
  dateFrom: number | undefined,
  dateTo: number | undefined,
): TransactionFilter | undefined {
  const hasFilter =
    (qRaw != null && qRaw !== "") ||
    (methodRaw != null && methodRaw !== "") ||
    (networkRaw != null && networkRaw !== "") ||
    dateFrom !== undefined ||
    dateTo !== undefined;

  if (!hasFilter) return undefined;
 
  return {
    q: qRaw || undefined,
    method: methodRaw || undefined,
    network: networkRaw || undefined,
    dateFrom,
    dateTo,
  };
}
/** Validates URLSearchParams and returns a typed query DTO (single parse path). */
export function validateTransactionQueryParams(searchParams: URLSearchParams): QueryParamsDto {
  const limit = parseLimit(searchParams);
  const offset = parseOffset(searchParams);
  const sortBy = parseSortBy(searchParams.get("sortBy"));
  const sortDir = parseSortDir(searchParams.get("sortDir"));
  const dateFrom = parseOptionalMsTimestamp(searchParams.get("dateFrom"), "dateFrom");
  const dateTo = parseOptionalMsTimestamp(searchParams.get("dateTo"), "dateTo");
  const filter = buildFilter(
    searchParams.get("q"),
    searchParams.get("method"),
    searchParams.get("network"),
    dateFrom,
    dateTo,
  );

  return { limit, offset, sortBy, sortDir, filter };
}
