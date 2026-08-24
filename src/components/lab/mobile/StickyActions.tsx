"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LabContent } from "@/data/lab";

/**
 * VARIANT C — an action that is always within reach.
 *
 * HYPOTHESIS: the page is 15.6 screens tall on a phone and carries a way
 * to act on the first screen and the last. In between there are roughly
 * thirteen screens of work, clients and services with nothing to press.
 * The WhatsApp button is present throughout, but it opens a chat — it
 * asks the visitor to compose a message from nothing, which is a harder
 * thing to start than answering a question.
 *
 * A bar with two actions and the price floor, appearing once the hero has
 * gone and hiding again over the closing section, where the page makes
 * the same offer at full size and a duplicate would only compete with it.
 *
 * IT REPLACES THE FLOATING WHATSAPP BUTTON rather than joining it. Two
 * round WhatsApp affordances in one corner is the collision this project
 * has already fixed twice; the bar carries WhatsApp itself.
 *
 * MOBILE ONLY, and it respects reduced motion by appearing without the
 * slide.
 */
export default function StickyActions({ content }: { content: LabContent }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    /*
     * OBSERVE THE HERO, NOT A SENTINEL.
     *
     * The first version rendered a marker div and observed that — but
     * this component is mounted at the END of the composition, so the
     * marker sat at the bottom of the page rather than after the hero
     * and the bar could never appear. Measured: shown=false at the top,
     * mid-page and at the closing section alike.
     *
     * The hero is already in the document and is exactly the thing the
     * bar waits for, so there is nothing to place and nothing to keep in
     * sync.
     */
    const hero = document.querySelector(".opening");
    const closing = document.querySelector("[data-contact-close]");
    if (!hero) return;

    let pastHero = false;
    let atClosing = false;
    const settle = () => setShown(pastHero && !atClosing);

    const heroWatch = new IntersectionObserver(
      ([entry]) => {
        pastHero = !entry.isIntersecting;
        settle();
      },
      { threshold: 0 }
    );
    heroWatch.observe(hero);

    let closeWatch: IntersectionObserver | undefined;
    if (closing) {
      closeWatch = new IntersectionObserver(
        ([entry]) => {
          atClosing = entry.isIntersecting;
          settle();
        },
        { threshold: 0.15 }
      );
      closeWatch.observe(closing);
    }

    return () => {
      heroWatch.disconnect();
      closeWatch?.disconnect();
    };
  }, []);

  return (
    <>
      <div className="sticky-actions" data-shown={shown || undefined}>
        <span className="sticky-actions__from">From {content.services.items[2].from.replace(/^From /, "")}</span>
        <div className="sticky-actions__buttons">
          <a
            href={`https://wa.me/${content.contact.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="sticky-actions__ghost"
          >
            WhatsApp
          </a>
          <Link href="/start" className="sticky-actions__solid">
            Start a project
          </Link>
        </div>
      </div>
    </>
  );
}
