import { asc, count, desc } from "drizzle-orm";
import { db } from "@/api/database";
import { transactions } from "@/api/database/schema";
import type { GetTransactionsResponseDto, QueryParamsDto } from "@/api/services/dto";
import { buildWhere, sortByToColumn } from "../utils/helper";

const transactionListColumns = {
  id: transactions.id,
  method: transactions.method,
  buyAmount: transactions.buyAmount,
  buyCurrency: transactions.buyCurrency,
  buyToken: transactions.buyToken,
  sellAmount: transactions.sellAmount,
  sellCurrency: transactions.sellCurrency,
  sellToken: transactions.sellToken,
  feeAmount: transactions.feeAmount,
  feeCurrency: transactions.feeCurrency,
  feeToken: transactions.feeToken,
  date: transactions.date,
  txHash: transactions.txHash,
  blockHeight: transactions.blockHeight,
  network: transactions.network,
  smartContract: transactions.smartContract,
  senderAddress: transactions.senderAddress,
  receiverAddress: transactions.receiverAddress,
  comments: transactions.comments,
} as const;

export async function findTransactionsPaged(params: QueryParamsDto): Promise<GetTransactionsResponseDto> {
  const where = buildWhere(params.filter);
  const orderBy =
    params.sortDir === "asc" ? asc(sortByToColumn[params.sortBy]) : desc(sortByToColumn[params.sortBy]);

  const [items, totalRows] = await Promise.all([
    db
      .select(transactionListColumns)
      .from(transactions)
      .where(where)
      .orderBy(orderBy)
      .limit(params.limit)
      .offset(params.offset),
    db.select({ total: count() }).from(transactions).where(where),
  ]);

  return {
    items,
    total: totalRows[0]?.total ?? 0,
    limit: params.limit,
    offset: params.offset,
  };
}
