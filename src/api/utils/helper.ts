import { transactions } from "@/api/database/schema";
import type { TransactionSortBy, TransactionFilter } from "../utils/types";
import { type AnyColumn, eq, gte, lte, or, like, and } from "drizzle-orm";


export const sortByToColumn = {
  date: transactions.date,
  id: transactions.id,
  buyAmount: transactions.buyAmount,
  sellAmount: transactions.sellAmount,
  feeAmount: transactions.feeAmount,
  method: transactions.method,
  network: transactions.network,
} satisfies Record<TransactionSortBy, AnyColumn>;

export function buildWhere(filter?: TransactionFilter) {
  if (!filter) return undefined;

  const conditions = [];

  if (filter.method) conditions.push(eq(transactions.method, filter.method));
  if (filter.network) conditions.push(eq(transactions.network, filter.network));
  if (typeof filter.dateFrom === "number") conditions.push(gte(transactions.date, new Date(filter.dateFrom)));
  if (filter.dateFrom instanceof Date) conditions.push(gte(transactions.date, filter.dateFrom));
  if (typeof filter.dateTo === "number") conditions.push(lte(transactions.date, new Date(filter.dateTo)));
  if (filter.dateTo instanceof Date) conditions.push(lte(transactions.date, filter.dateTo));

  const q = filter.q?.trim();
  if (q) {
    const pattern = `%${q}%`;
    conditions.push(
      or(
        like(transactions.txHash, pattern),
        like(transactions.senderAddress, pattern),
        like(transactions.receiverAddress, pattern),
        like(transactions.network, pattern),
        like(transactions.method, pattern),
        like(transactions.buyCurrency, pattern),
        like(transactions.sellCurrency, pattern),
      ),
    );
  }

  return conditions.length ? and(...conditions) : undefined;
}