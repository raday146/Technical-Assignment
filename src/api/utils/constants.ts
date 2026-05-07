import type { TransactionSortBy } from "./types";

export const TRANSACTIONS_ROUTE = "/api/transactions";
export const DEFAULT_LIMIT = 25;
export const MIN_LIMIT = 1;
export const MAX_LIMIT = 200;
export const MAX_OFFSET = 10_000_000;

export const SORT_WHITELIST = new Set<TransactionSortBy>([
  "date",
  "id",
  "buyAmount",
  "sellAmount",
  "feeAmount",
  "method",
  "network",
]);
