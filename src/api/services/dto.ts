// src/api/dtos/transactions.dto.ts

import type { SortDirection, TransactionFilter, TransactionRow, TransactionSortBy } from "../utils/types";

export interface GetTransactionsResponseDto {
  items: TransactionRow[];
  total: number;
  limit: number;
  offset: number;
}

export interface QueryParamsDto{
  limit: number;
  offset: number;
  sortBy: TransactionSortBy;
  sortDir: SortDirection;
  filter?: TransactionFilter;
}