import { truncateValue, copyToClipboard } from "@/lib/utils";

export function TruncatedMonoTooltip({
  value,
  widthClass = "w-[120px]",
}: {
  value: string | null;
  widthClass?: string;
}) {
  const v = value?.trim() ?? "";
  if (!v) return <span className={`font-mono text-xs text-muted-foreground ${widthClass}`}>—</span>;

  return (
    <span className="relative inline-flex items-center gap-2 group align-middle">
      <span
        className={`font-mono text-xs text-muted-foreground ${widthClass} truncate whitespace-nowrap cursor-help`}
      >
        {truncateValue(v)}
      </span>

      <span className="absolute left-0 top-full z-50 pt-2 hidden group-hover:block">
        <span className="inline-flex max-w-[520px] items-center gap-2 rounded-lg border border-border/60 bg-popover px-3 py-2 text-xs shadow-md shadow-black/20">
          <span className="font-mono text-popover-foreground break-all">
            {v}
          </span>
          <button
            type="button"
            className="inline-flex items-center rounded-md px-2 py-1 text-muted-foreground hover:bg-muted/60 hover:text-foreground shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              void copyToClipboard(v);
            }}
            aria-label="Copy"
          >
            ⧉
          </button>
        </span>
      </span>
    </span>
  );
}