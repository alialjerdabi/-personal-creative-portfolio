"use client";

import { useRef, useState } from "react";

/**
 * Click to copy, with the confirmation said in place.
 *
 * The label swaps to "Copied" rather than raising a toast: the reader is
 * looking at the thing they pressed, and a toast in a corner is a second
 * place to look. An `aria-live` region carries the same word for screen
 * readers, since a changed button label alone is not announced.
 */
export default function CopyButton({
  value,
  children,
  className = "",
  label,
  style,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
  /** Accessible name. Defaults to "Copy <value>". */
  label?: string;
  style?: React.CSSProperties;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      /* Clipboard is refused on insecure origins and in some embedded
         browsers. Selecting a hidden field is the old route that still
         works there. */
      const field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={label ?? `Copy ${value}`}
      className={`brand-copy ${className}`}
      data-copied={copied || undefined}
      style={style}
    >
      {children}
      <span className="brand-copy__state" aria-live="polite">
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}
