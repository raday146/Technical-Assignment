import index from "../index.html";
import { handleGetTransactions } from "./controllers/transactionController";
import {TRANSACTIONS_ROUTE} from "./utils/constants";

const transactionApiRoutes = {
  [TRANSACTIONS_ROUTE]: {
    GET: handleGetTransactions,
  }
} as const;
export const routes = {
  "/*": index,
  ...transactionApiRoutes,
};
