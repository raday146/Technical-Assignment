import type { Transaction } from "@/frontend/type";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function clampInt(n: number, { min, max }: { min: number; max: number }) {
  return Math.max(min, Math.min(max, n));
}

export function formatNumber(n: number | null) {
  if (n == null) return "—";
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);
}

export function formatDate(isoOrMs: string) {
  const d = new Date(isoOrMs);
  if (Number.isNaN(d.getTime())) return isoOrMs;
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(d);
}

export function toCSVRows(items: Transaction[]) {
  return items.map((t) => ({
    id: t.id,
    date: t.date,
    method: t.method,
    network: t.network ?? "",
    buyAmount: t.buyAmount ?? "",
    buyCurrency: t.buyCurrency ?? "",
    buyToken: t.buyToken ?? "",
    sellAmount: t.sellAmount ?? "",
    sellCurrency: t.sellCurrency ?? "",
    sellToken: t.sellToken ?? "",
    feeAmount: t.feeAmount ?? "",
    feeCurrency: t.feeCurrency ?? "",
    feeToken: t.feeToken ?? "",
    txHash: t.txHash ?? "",
    senderAddress: t.senderAddress ?? "",
    receiverAddress: t.receiverAddress ?? "",
    comments: t.comments ?? "",
  }));
}

export function parseIntParam(sp: URLSearchParams, key: string) {
  const raw = sp.get(key);
  if (raw == null) return undefined;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : undefined;
}

export const truncateValue = (val: string | null | undefined, start = 6, end = 4) => {
  if (!val) return "";
  if (val.length <= start + end) return val;
  return `${val.slice(0, start)}...${val.slice(-end)}`;
};

export const formatLabel = (str: string | null | undefined): string => {
  if (!str) return "";
  
  return str
    .replace(/_/g, " ") 
    .split(" ")         
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
    .join(" ");        
};

export function dashIfEmpty(value: string) {
  const v = value.trim();
  return v === "" ? "—" : v;
}

export function methodBadgeClass(methodRaw: string) {
  const method = methodRaw.toLowerCase();
  if (method.includes("deposit"))
    return "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 ring-indigo-500/20";
  if (method.includes("bridge"))
    return "bg-purple-500/10 text-purple-700 dark:text-purple-300 ring-purple-500/20";
  if (method.includes("withdraw") || method.includes("sell"))
    return "bg-slate-500/10 text-slate-700 dark:text-slate-300 ring-slate-500/20";
  return "bg-muted text-foreground/80 ring-foreground/10";
}

export function networkDotClass(networkRaw: string | null) {
  const network = (networkRaw ?? "").toLowerCase();
  if (network.includes("ethereum") || network === "eth") return "bg-blue-500";
  if (network.includes("polygon") || network.includes("matic")) return "bg-purple-500";
  if (network.includes("binance") || network.includes("bsc")) return "bg-yellow-400";
  return "bg-muted-foreground/40";
}

export async function copyToClipboard(text: string) {
  if (!text) return;
  // Modern clipboard API (avoids deprecated document.execCommand).
  if (!navigator.clipboard?.writeText) return;
  await navigator.clipboard.writeText(text);
}

export function assetLabel(token: string | null, currency: string | null) {
  const tok = token?.trim() ?? "";
  const curr = currency?.trim() ?? "";
  if (!tok && !curr) return "—";
  if (!tok) return curr;
  if (!curr || curr.toLowerCase() === tok.toLowerCase()) return tok;
  return `${tok} (${curr})`;
}