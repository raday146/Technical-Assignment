import index from "../index.html";
import { handleGetTransactions } from "./controllers/transactionController";


const transactionApiRoutes = {
  TRANSACTIONS_ROUTE: async (req: Request) => handleGetTransactions(req),
} as const;
export const routes = {
  "/*": index,
  ...transactionApiRoutes,
};
