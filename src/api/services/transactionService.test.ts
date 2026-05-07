import { test, expect } from "bun:test";
import { listTransactions } from "./transactionService";
import { validateTransactionQueryParams } from "../utils/transactionValidator";
import { ValidationError } from "../utils/errors";

test("validateTransactionQueryParams applies defaults", () => {
  const p = validateTransactionQueryParams(new URLSearchParams(""));
  expect(p.limit).toBe(25);
  expect(p.offset).toBe(0);
  expect(p.sortBy).toBe("date");
  expect(p.sortDir).toBe("desc");
});

test("validateTransactionQueryParams rejects limit out of bounds", () => {
  expect(() => validateTransactionQueryParams(new URLSearchParams("limit=0"))).toThrow(ValidationError);
  expect(() => validateTransactionQueryParams(new URLSearchParams("limit=201"))).toThrow(ValidationError);
});

test("validateTransactionQueryParams rejects non-numeric limit when provided", () => {
  expect(() => validateTransactionQueryParams(new URLSearchParams("limit=abc"))).toThrow(ValidationError);
});

test("validateTransactionQueryParams rejects invalid sortBy", () => {
  expect(() => validateTransactionQueryParams(new URLSearchParams("sortBy=invalid_column"))).toThrow(
    ValidationError,
  );
});

test("validateTransactionQueryParams rejects invalid sortDir", () => {
  expect(() => validateTransactionQueryParams(new URLSearchParams("sortDir=both"))).toThrow(ValidationError);
});

test("listTransactions paginates against SQLite database.db", async () => {
  const params = validateTransactionQueryParams(
    new URLSearchParams("limit=5&offset=0&sortBy=date&sortDir=desc"),
  );
  const r = await listTransactions(params);
  expect(r.items.length).toBeLessThanOrEqual(5);
  expect(r.total).toBeGreaterThan(0);
  expect(r.limit).toBe(5);
  expect(r.offset).toBe(0);
});

test("listTransactions returns no rows for empty search", async () => {
  const params = validateTransactionQueryParams(
    new URLSearchParams("limit=10&q=__no_matches_expected_xyz_123__"),
  );
  const r = await listTransactions(params);
  expect(r.items.length).toBe(0);
  expect(r.total).toBe(0);
});
