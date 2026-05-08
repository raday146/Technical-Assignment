import { dashIfEmpty, formatNumber, assetLabel, truncateValue } from "@/lib/utils";

export function AmountCell({
    amount,
    token,
    currency,
    tone,
  }: {
    amount: number | null;
    token: string | null;
    currency: string | null;
    tone: "buy" | "sell" | "fee";
  }) {
    const amountText = dashIfEmpty(formatNumber(amount));
    // Token shown always when present; currency only shown when different.
    // e.g. "USDC (ERC20)" or "USDC" when currency === token.
    const tokenText = assetLabel(token, currency);
    const amountClass =
      tone === "buy"
        ? "text-emerald-500"
        : tone === "sell"
          ? "text-rose-500"
          : "text-muted-foreground";
    return (
      <div className="whitespace-nowrap font-mono tabular-nums text-right">
        <span className={amountClass}>{truncateValue(amountText)}</span>{" "}
        <span className="text-muted-foreground">{truncateValue(tokenText)}</span>
      </div>
    );
  }