"use client";

import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "lab-theme";
const EVENT = "lab-theme-change";

function readStored(): Theme | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    /* Storage throws outright in some hardened browsing modes. */
    return null;
  }
}

/**
 * The applied theme, read from the DOM rather than mirrored in state.
 *
 * `useSyncExternalStore` and not `useState` + `useEffect`: the source of
 * truth is an attribute on <html> that an inline script in layout.tsx
 * writes before React exists. Copying that into component state means
 * setting state inside an effect, which cascades a second render on
 * every mount — and React's linter rejects it for exactly that reason.
 */
function subscribe(onChange: () => void) {
  const query = window.matchMedia("(prefers-color-scheme: dark)");

  /*
   * Follow the OS only while the visitor has not chosen. Pressing the
   * button is a decision, and a later system change must not silently
   * overrule it.
   */
  const onSystem = (event: MediaQueryListEvent) => {
    if (readStored()) return;
    if (event.matches) document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    onChange();
  };

  query.addEventListener("change", onSystem);
  window.addEventListener(EVENT, onChange);
  return () => {
    query.removeEventListener("change", onSystem);
    window.removeEventListener(EVENT, onChange);
  };
}

const getSnapshot = (): Theme =>
  document.documentElement.dataset.theme === "dark" ? "dark" : "light";

/*
 * The server cannot know what a visitor's OS prefers, so it renders the
 * light-theme label and the client corrects it after hydration. This is
 * the sanctioned use of a differing server snapshot — guessing instead
 * would be a coin flip and a hydration mismatch half the time.
 */
const getServerSnapshot = (): Theme => "light";

/**
 * The theme switch.
 *
 * THREE STATES, TWO SHOWN. A visitor who has never pressed it follows
 * their operating system; pressing it pins a choice and stores it. That
 * is what makes it native — the default is the decision they already
 * made everywhere else, not one this site made for them.
 *
 * The attribute itself is written before first paint by a script in
 * layout.tsx. Anything React-side runs after hydration, by which point
 * the wrong ground has already been painted.
 */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dark = theme === "dark";

  const toggle = () => {
    const next: Theme = dark ? "light" : "dark";
    if (next === "dark") document.documentElement.dataset.theme = "dark";
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* The choice still holds for this page; it just will not persist. */
    }
    window.dispatchEvent(new Event(EVENT));
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="lab-theme-toggle"
      aria-pressed={dark}
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {/* Both glyphs sit in the same cell and cross-fade, so the button
          never changes size and the nav beside it never shifts. */}
      <span aria-hidden="true" className="lab-theme-toggle__glyphs">
        <svg viewBox="0 0 24 24" fill="none" data-glyph="sun">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
            <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2" />
            <path d="M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
          </g>
        </svg>
        <svg viewBox="0 0 24 24" fill="none" data-glyph="moon">
          <path
            d="M20 13.4A8.2 8.2 0 1 1 10.6 4a6.6 6.6 0 0 0 9.4 9.4Z"
            fill="currentColor"
          />
        </svg>
      </span>
    </button>
  );
}
