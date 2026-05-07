import { ValidationError } from "@/api/utils/errors";
import { listTransactionsFromSearchParams } from "@/api/services/transactionService";
import { TRANSACTIONS_ROUTE } from "../utils/constants";


function logRequestFailure(route: string, status: number, message: string, searchParams: URLSearchParams) {
  console.error(
    JSON.stringify({
      route,
      status,
      message,
      query: Object.fromEntries(searchParams.entries()),
    }),
  );
}

function mapErrorToResponse(error: unknown, route: string, searchParams: URLSearchParams): Response {
  if (error instanceof ValidationError) {
    logRequestFailure(route, 400, error.message, searchParams);
    return Response.json({ error: { code: error.code, message: error.message } }, { status: 400 });
  }

  const message = error instanceof Error ? error.message : String(error);
  logRequestFailure(route, 500, message, searchParams);
  return Response.json(
    { error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred" } },
    { status: 500 },
  );
}

export async function handleGetTransactions(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const sp = url.searchParams;

  try {
    const result = await listTransactionsFromSearchParams(sp);
    return Response.json(result);
  } catch (e) {
    return mapErrorToResponse(e, TRANSACTIONS_ROUTE, sp);
  }
}
