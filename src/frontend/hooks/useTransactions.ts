import type { SortDirection, TransactionsSortBy } from "../../api/utils/types";
import { parseSortBy, parseSortDir, readStateFromLocation, writeSearchParams } from "../../lib/pagination";
import { clampInt } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type TransactionsResponse<T> = { items: T[]; total: number; limit: number; offset: number };

type ApiErrorBody = { error?: { code?: string; message?: string } };

export function useTransactions<T = unknown>() {
  const [{ page, pageSize, q, sortBy, sortDir, search }, setView] = useState(() => {
    const s = readStateFromLocation();
    return {
      page: s.page,
      pageSize: s.pageSize,
      q: s.q,
      sortBy: s.sortBy,
      sortDir: s.sortDir,
      search: window.location.search,
    };
  });

  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  const offset = useMemo(() => page * pageSize, [page, pageSize]);

  const setPage = useCallback((nextPage: number) => {
    const safe = clampInt(nextPage, { min: 0, max: Number.MAX_SAFE_INTEGER });
    const next = new URLSearchParams(window.location.search);
    next.set("limit", String(pageSize));
    next.set("offset", String(safe * pageSize));
    writeSearchParams(next, "push");
  }, [pageSize]);

  const setPageSize = useCallback((nextPageSize: number) => {
    const safe = clampInt(nextPageSize, { min: 1, max: 200 });
    const next = new URLSearchParams(window.location.search);
    next.set("limit", String(safe));
    next.set("offset", "0");
    writeSearchParams(next, "replace");
  }, []);

  const setSort = useCallback((nextSortBy: TransactionsSortBy) => {
    const next = new URLSearchParams(window.location.search);
    const currentSortBy = parseSortBy(next);
    const currentSortDir = parseSortDir(next);

    let nextDir: SortDirection = "asc";
    if (currentSortBy === nextSortBy) nextDir = currentSortDir === "asc" ? "desc" : "asc";
    else nextDir = nextSortBy === "date" ? "desc" : "asc";

    next.set("sortBy", nextSortBy);
    next.set("sortDir", nextDir);
    next.set("offset", "0");
    writeSearchParams(next, "push");
  }, []);

  const setQuery = useCallback((nextQ: string) => {
    const next = new URLSearchParams(window.location.search);
    const trimmed = nextQ.trim();
    if (trimmed) next.set("q", trimmed);
    else next.delete("q");
    next.set("offset", "0");
    writeSearchParams(next, "replace");
  }, []);

  const refetch = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;

    setIsLoading(true);
    setError(null);

    try {
      const url = new URL("/api/transactions", window.location.href);
      // Use URL as source of truth, but ensure fetch is keyed by `search` updates.
      const sp = new URLSearchParams(search);
      sp.set("limit", String(pageSize));
      sp.set("offset", String(offset));
      url.search = sp.toString();

      const res = await fetch(url, { signal: ac.signal });
      let json: TransactionsResponse<T> & ApiErrorBody;
      try {
        json = (await res.json()) as TransactionsResponse<T> & ApiErrorBody;
      } catch {
        throw new Error(`Request failed: ${res.status}`);
      }

      if (!res.ok) {
        const msg = json?.error?.message ?? `Request failed: ${res.status}`;
        throw new Error(msg);
      }

      setData(json.items ?? []);
      setTotal(json.total);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsLoading(false);
    }
  }, [offset, pageSize, search]);

  useEffect(() => {
    const onPop = () => {
      const s = readStateFromLocation();
      setView({
        page: s.page,
        pageSize: s.pageSize,
        q: s.q,
        sortBy: s.sortBy,
        sortDir: s.sortDir,
        search: window.location.search,
      });
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    void refetch();
    return () => abortRef.current?.abort();
  }, [refetch]);

  return {
    data,
    total,
    page,
    pageSize,
    offset,
    q,
    sortBy,
    sortDir,
    search,
    isLoading,
    error,
    setPage,
    setPageSize,
    setSort,
    setQuery,
    refetch,
  };
}
