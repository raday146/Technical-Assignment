import type { GetTransactionsResponseDto, QueryParamsDto } from "@/api/services/dto";
import { findTransactionsPaged } from "@/api/database/transactionRepository";
import { validateTransactionQueryParams } from "@/api/utils/transactionValidator";

async function fetchPaged(params: QueryParamsDto): Promise<GetTransactionsResponseDto> {
  try {
    return await findTransactionsPaged(params);
  } catch (cause) {
    if (cause instanceof Error) throw cause;
    throw new Error(String(cause));
  }
}

export async function listTransactions(params: QueryParamsDto): Promise<GetTransactionsResponseDto> {
  return fetchPaged(params);
}

export async function listTransactionsFromSearchParams(
  searchParams: URLSearchParams,
): Promise<GetTransactionsResponseDto> {
  const params = validateTransactionQueryParams(searchParams);
  return fetchPaged(params);
}
