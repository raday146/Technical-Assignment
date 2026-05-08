import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { exportToCSV } from "@/lib/exportUtils";
import { useTransactions } from "@/frontend/hooks/useTransactions";
import { useMemo } from "react";
import type { Transaction } from "@/frontend/type";
import { toCSVRows, formatDate, formatLabel, methodBadgeClass, networkDotClass } from "@/lib/utils";
import { SkeletonTable } from "../SkeletonTable";
import { useSearchDebounce } from "../../hooks/useSearchDebounce";
import  { TruncatedMonoTooltip } from "../TruncatedMonoTooltip";
import  { AmountCell } from "./AmountCell";




export function TransactionsTable() {
  const {
    data,
    total,
    page,
    pageSize,
    q,
    sortBy,
    sortDir,
    isLoading,
    error,
    setPage,
    setPageSize,
    setSort,
    setQuery,
    refetch,
  } = useTransactions<Transaction>();

  const search = useSearchDebounce({
    value: q || "",
    delayMs: 500,
    isLoading,
    onCommit: setQuery,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 0;
  const canNext = page + 1 < totalPages;
  const exportRows = useMemo(() => toCSVRows(data as Transaction[]), [data]);

  const sortIndicator = (col: "date" | "method") => {
    if (sortBy !== col) return "";
    return sortDir === "asc" ? " ▲" : " ▼";
  };

  const isBusy = search.isBusy;
  const isInitialLoad = isLoading && data.length === 0 && !error;

  return (
    <Card className="text-left">
      <CardHeader className="gap-1">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl sm:text-2xl">Transactions</CardTitle>
            <CardDescription>
              {total.toLocaleString()} total • Page {page + 1} / {totalPages}
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => exportToCSV({ filename: `transactions_page_${page + 1}`, rows: exportRows })}
              disabled={isLoading || data.length === 0}
            >
              Export CSV
            </Button>
            <Button variant="secondary" onClick={() => void refetch()} disabled={isLoading}>
              Refresh
            </Button>
          </div>
        </div>

        <div className="pt-2">
          <div className="relative">
            <Input
              value={search.draft}
              onChange={(e) => {
                search.onChange(e.currentTarget.value);
              }}
              placeholder="Search (tx hash, addresses, network, currency, method)…"
              className="w-full pr-20"
            />

            {search.draft ? (
              <button
                type="button"
                onClick={search.clear}
                className="absolute right-8 top-1/2 -translate-y-1/2 inline-flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                aria-label="Clear search"
              >
                ×
              </button>
            ) : null}

            {isBusy ? (
              <div
                className="absolute right-2 top-1/2 -translate-y-1/2 size-4 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin"
                aria-label="Loading"
              />
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setPage(page - 1)} disabled={!canPrev || isLoading}>
              Prev
            </Button>
            <Button variant="outline" onClick={() => setPage(page + 1)} disabled={!canNext || isLoading}>
              Next
            </Button>
            <div className="text-sm text-muted-foreground">
              Showing {Math.min(total, page * pageSize + 1).toLocaleString()}–
              {Math.min(total, (page + 1) * pageSize).toLocaleString()}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Rows</div>
            <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
              <SelectTrigger className="w-[110px]">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent align="end">
                {[10, 25, 50, 100, 200].map((n: number) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="min-h-[600px]">
          {isInitialLoad ? (
            <SkeletonTable />
          ) : error ? (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
              <div className="font-medium">Failed to load transactions</div>
              <div className="text-muted-foreground mt-1">{error}</div>
              <div className="mt-3">
                <Button variant="secondary" onClick={() => void refetch()}>
                  Try again
                </Button>
              </div>
            </div>
          ) : data.length === 0 ? (
            <div className="rounded-xl border border-border bg-muted/20 p-6 text-sm">
              <div className="font-medium">No results found</div>
              <div className="mt-1 text-muted-foreground">
                {q ? (
                  <>
                    No transactions match <span className="font-mono">“{q}”</span>.
                  </>
                ) : (
                  <>No transactions found for this page.</>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {q ? (
                  <Button variant="secondary" onClick={search.clear}>
                    Clear search
                  </Button>
                ) : null}
                <Button variant="outline" onClick={() => setPage(0)}>
                  Go to first page
                </Button>
              </div>
            </div>
          ) : (
            <div className={`space-y-4 ${isBusy ? "opacity-50 pointer-events-none" : ""}`}>
              <div className="md:hidden space-y-3">
                {data.map((t) => (
                  <div key={t.id} className="rounded-xl border border-border p-4 wrap-break-word">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${methodBadgeClass(
                              t.method,
                            )}`}
                          >
                            {formatLabel(t.method)}
                          </span>
                          <span className="text-xs text-muted-foreground font-mono tabular-nums">
                            #{t.id}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">{formatDate(t.date)}</div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right shrink-0">
                        <div className="inline-flex items-center gap-2">
                          <span className={`size-2 rounded-full ${networkDotClass(t.network)}`} />
                          <span>{t.network ? formatLabel(t.network) : "—"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">Buy</div>
                        <AmountCell amount={t.buyAmount} token={t.buyToken} currency={t.buyCurrency} tone="buy" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">Sell</div>
                        <AmountCell amount={t.sellAmount} token={t.sellToken} currency={t.sellCurrency} tone="sell" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">Fee</div>
                        <AmountCell amount={t.feeAmount} token={t.feeToken} currency={t.feeCurrency} tone="fee" />
                      </div>
                      <div className="min-w-0 col-span-2">
                        <div className="text-xs text-muted-foreground">Route</div>
                        <div className="inline-flex items-center gap-2 whitespace-nowrap">
                          <TruncatedMonoTooltip value={t.senderAddress} widthClass="w-[120px]" />
                          <span className="text-muted-foreground/60">→</span>
                          <TruncatedMonoTooltip value={t.receiverAddress} widthClass="w-[120px]" />
                        </div>
                      </div>
                      <div className="min-w-0 col-span-2">
                        <div className="text-xs text-muted-foreground">Contract</div>
                        <div className="inline-flex items-center whitespace-nowrap">
                          <TruncatedMonoTooltip value={t.smartContract} widthClass="w-[160px]" />
                        </div>
                      </div>
                      <div className="min-w-0 col-span-2">
                        <div className="text-xs text-muted-foreground">Blockchain ID</div>
                        <div className="inline-flex items-center gap-3 whitespace-nowrap">
                          <span className="font-mono text-xs text-muted-foreground">{t.blockHeight || "—"}</span>
                          <span className="text-muted-foreground/60">•</span>
                          <TruncatedMonoTooltip value={t.txHash} widthClass="w-[160px]" />
                        </div>
                      </div>
                      <div className="min-w-0 col-span-2">
                        <div className="text-xs text-muted-foreground">Notes</div>
                        <div
                          className="text-xs italic text-muted-foreground truncate"
                          title={t.comments ?? ""}
                        >
                          {t.comments?.trim() ? t.comments : "—"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block rounded-xl ring-1 ring-foreground/10 overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted/40">
                    <TableRow className="border-border/50">
                      <TableHead className="w-[80px] px-6 whitespace-nowrap text-muted-foreground">
                        ID
                      </TableHead>
                      <TableHead className="w-[220px] px-6 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-2 px-2"
                          onClick={() => setSort("date")}
                          aria-label={`Sort by date${sortBy === "date" ? ` (${sortDir})` : ""}`}
                        >
                          Date{sortIndicator("date")}
                        </Button>
                      </TableHead>
                      <TableHead className="w-[160px] px-6 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="-ml-2 px-2"
                          onClick={() => setSort("method")}
                          aria-label={`Sort by method${sortBy === "method" ? ` (${sortDir})` : ""}`}
                        >
                          Method{sortIndicator("method")}
                        </Button>
                      </TableHead>
                      <TableHead className="px-6 whitespace-nowrap min-w-[180px]">Network</TableHead>
                      <TableHead className="px-6 whitespace-nowrap text-right">Buy</TableHead>
                      <TableHead className="px-6 whitespace-nowrap text-right">Sell</TableHead>
                      <TableHead className="px-6 whitespace-nowrap text-right">Fee</TableHead>
                      <TableHead className="px-6 whitespace-nowrap min-w-[240px]">Route</TableHead>
                      <TableHead className="px-6 whitespace-nowrap min-w-[180px]">Contract</TableHead>
                      <TableHead className="px-6 whitespace-nowrap min-w-[220px]">Blockchain ID</TableHead>
                      <TableHead className="px-6 whitespace-nowrap min-w-[240px]">Comments/Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.map((t) => (
                      <TableRow key={t.id} className="h-12 border-border/50 hover:bg-muted/50">
                        <TableCell className="px-6 whitespace-nowrap font-mono text-xs text-muted-foreground">
                          #{t.id}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap px-6">
                          {formatDate(t.date)}
                        </TableCell>
                        <TableCell className="font-medium px-6">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${methodBadgeClass(
                              t.method,
                            )}`}
                          >
                            {formatLabel(t.method)}
                          </span>
                        </TableCell>
                        <TableCell className="px-6">
                          <span className="inline-flex items-center gap-2">
                            <span className={`size-2 rounded-full ${networkDotClass(t.network)}`} />
                            <span>{t.network ? formatLabel(t.network) : "—"}</span>
                          </span>
                        </TableCell>
                        <TableCell className="px-6">
                          <AmountCell amount={t.buyAmount} token={t.buyToken} currency={t.buyCurrency} tone="buy" />
                        </TableCell>
                        <TableCell className="px-6">
                          <AmountCell amount={t.sellAmount} token={t.sellToken} currency={t.sellCurrency} tone="sell" />
                        </TableCell>
                        <TableCell className="px-6">
                          <AmountCell amount={t.feeAmount} token={t.feeToken} currency={t.feeCurrency} tone="fee" />
                        </TableCell>
                        <TableCell className="px-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-2">
                            <TruncatedMonoTooltip value={t.senderAddress} widthClass="w-[120px]" />
                            <span className="text-muted-foreground/60">→</span>
                            <TruncatedMonoTooltip value={t.receiverAddress} widthClass="w-[120px]" />
                          </span>
                        </TableCell>
                        <TableCell className="px-6 whitespace-nowrap">
                          <TruncatedMonoTooltip value={t.smartContract} widthClass="w-[120px]" />
                        </TableCell>
                        <TableCell className="px-6 whitespace-nowrap">
                          <span className="inline-flex items-center gap-3">
                            <span className="font-mono text-xs text-muted-foreground">{t.blockHeight || "—"}</span>
                            <span className="text-muted-foreground/60">•</span>
                            <TruncatedMonoTooltip value={t.txHash} widthClass="w-[120px]" />
                          </span>
                        </TableCell>
                        <TableCell className="px-6 whitespace-nowrap">
                          <span
                            className="block max-w-[280px] truncate italic text-muted-foreground"
                            title={t.comments ?? ""}
                          >
                            {t.comments?.trim() ? t.comments : "—"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TransactionsTable;
