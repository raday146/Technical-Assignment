import { asc, count, desc } from "drizzle-orm";
import { db } from "@/api/database";
import { transactions } from "@/api/database/schema";
import { buildWhere, sortByToColumn } from "../utils/helper";
import type { GetTransactionsResponseDto, QueryParamsDto } from "./dto";




export async function getTransactions(params: QueryParamsDto): Promise<GetTransactionsResponseDto> {
  const where = buildWhere(params?.filter);
  const orderBy = params?.sortDir === "asc" ? asc(sortByToColumn[params?.sortBy]) : desc(sortByToColumn[params?.sortBy]);

  const [items, totalRows] = await Promise.all([
    db
      .select()
      .from(transactions)
      .where(where)
      .orderBy(orderBy)
      .limit(params?.limit)
      .offset(params?.offset),
    db.select({ total: count() }).from(transactions).where(where),
  ]);

  return {
    items,
    total: totalRows[0]?.total ?? 0,
    limit: params?.limit,
    offset: params?.offset,
  };
}

