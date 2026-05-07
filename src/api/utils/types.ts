import type { transactions } from "../database/schema";

export type TransactionRow = typeof transactions.$inferSelect;

export type TransactionSortBy =
  | "date"
  | "id"
  | "buyAmount"
  | "sellAmount"
  | "feeAmount"
  | "method"
  | "network";

export type TransactionFilter = {
  q?: string;
  method?: string;
  network?: string;
  dateFrom?: number | Date;
  dateTo?: number | Date;
};
export  type SortDirection =  "asc" | "desc";