"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The guide's contents, marking the section being read.
 *
 * Plain anchors: every entry works with JavaScript off, and the browser
 * owns the scroll. The observer only moves the marker — a band across
 * the upper third of the viewport decides which section is "current",
 * so a short section is not skipped over on its way past.
 */
export default function GuideNav({
  sections,
}: {
  sections: { id: string; label: string }[];
}) {
  const [active, setActive] = useState(sections[0]?.id);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    for (const { id } of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  /* On a phone the contents are one scrolling row of chips. Keep the
     current one in view, or the marker moves off the edge and the row
     stops saying where you are. Scrolls the row only, never the page. */
  useEffect(() => {
    const row = list.current;
    const chip = row?.querySelector<HTMLElement>("[aria-current]");
    if (!row || !chip || row.scrollWidth <= row.clientWidth) return;
    const left = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
    row.scrollTo({ left, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label="Guide sections">
      <ol
        ref={list}
        className="relative flex gap-1 overflow-x-auto [scrollbar-width:none] lg:flex-col lg:gap-0.5 lg:overflow-visible"
      >
        {sections.map((section, index) => (
          <li key={section.id} className="shrink-0">
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
              className="brand-toc-link"
            >
              <span className="font-mono text-[11px] opacity-60">
                {String(index + 1).padStart(2, "0")}
              </span>
              {section.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
