import { useEffect, useRef, useState } from "react";

export function useSearchDebounce(opts: {
  value: string;
  delayMs?: number;
  isLoading: boolean;
  onCommit: (nextValue: string) => void;
}) {
  const delayMs = opts.delayMs ?? 500;

  const [draft, setDraft] = useState<string>(opts.value);
  const [debouncedValue, setDebouncedValue] = useState<string>(opts.value);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const lastIssuedRef = useRef<string>(opts.value);

  // Keep input synchronized with URL-driven value (back/forward, programmatic changes).
  useEffect(() => {
    setDraft(opts.value);
    setDebouncedValue(opts.value);
  }, [opts.value]);

  // Real debounce: draft -> debouncedValue with cleanup.
  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedValue(draft.trim());
    }, delayMs);
    return () => window.clearTimeout(t);
  }, [delayMs, draft]);

  // Commit debounced changes into URL/source-of-truth. Keep typing state until fetch settles.
  useEffect(() => {
    if (debouncedValue === opts.value) return;
    lastIssuedRef.current = debouncedValue;
    opts.onCommit(debouncedValue);
  }, [debouncedValue, opts]);

  // End typing once the request finished and URL value matches the latest issued value.
  useEffect(() => {
    if (opts.isLoading) return;
    if (opts.value === lastIssuedRef.current) setIsTyping(false);
  }, [opts.isLoading, opts.value]);

  const onChange = (nextDraft: string) => {
    setIsTyping(true);
    setDraft(nextDraft);
  };

  const clear = () => {
    setIsTyping(true);
    lastIssuedRef.current = "";
    setDraft("");
    setDebouncedValue("");
    opts.onCommit("");
  };

  return {
    draft,
    onChange,
    clear,
    debouncedValue,
    isTyping,
    isBusy: isTyping || opts.isLoading,
  };
}