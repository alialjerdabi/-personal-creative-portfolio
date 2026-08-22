"use client";

import { useState } from "react";
import type { LabContent } from "@/data/lab";

/**
 * The brief — one page that arrives already qualified.
 *
 * WHY THIS EXISTS: "get in touch" produces an enquiry that says "how
 * much for a logo". This produces one that names the service, the
 * timeline, the budget band, what the business does and what is actually
 * wrong. Ali can answer it properly, or decline it, without a round of
 * questions first — and the visitor spends two minutes instead of
 * composing a message from nothing.
 *
 * IT WORKS WITHOUT A KEY. Web3Forms mails the submission straight
 * through when NEXT_PUBLIC_WEB3FORMS_KEY is set. When it is not, the
 * same answers are composed into a WhatsApp message instead — which is
 * the channel Ali already answers fastest. The form is never a dead end
 * that swallows an enquiry silently; that failure is invisible to the
 * visitor and expensive to the business.
 *
 * The budget bands are the VISITOR'S budget, not a price list. Nothing
 * here quotes a figure the site cannot stand behind — the real floors
 * live on /services and come from Ali.
 */

const ENDPOINT = "https://api.web3forms.com/submit";

const TIMELINES = [
  "As soon as possible",
  "Within a month",
  "One to three months",
  "Still exploring",
];

const BUDGETS = [
  "Under BHD 500",
  "BHD 500 – 1,500",
  "BHD 1,500 – 3,000",
  "BHD 3,000 +",
  "Not sure yet",
];

type Status = "idle" | "sending" | "sent" | "error";

export default function BriefForm({
  content,
  initialService,
  formKey,
}: {
  content: LabContent;
  initialService?: string;
  formKey?: string;
}) {
  const services = content.services.items;
  const [chosen, setChosen] = useState<string[]>(() => {
    const match = services.find((s) => s.index === initialService);
    return match ? [match.name] : [];
  });
  const [status, setStatus] = useState<Status>("idle");

  function toggle(name: string) {
    setChosen((current) =>
      current.includes(name) ? current.filter((x) => x !== name) : [...current, name]
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    /*
     * No key means no inbox. Rather than fail, hand the same answers to
     * WhatsApp — the visitor keeps their two minutes of work and Ali
     * still receives a qualified brief.
     */
    if (!formKey) {
      const lines = [
        "New project brief",
        `Services: ${chosen.join(", ") || "Not specified"}`,
        `Timeline: ${data.get("timeline") || "—"}`,
        `Budget: ${data.get("budget") || "—"}`,
        `Business: ${data.get("business") || "—"}`,
        `Problem: ${data.get("problem") || "—"}`,
        `From: ${data.get("name") || "—"} (${data.get("email") || "—"})`,
      ];
      window.open(
        `https://wa.me/${content.contact.whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
        "_blank",
        "noreferrer"
      );
      setStatus("sent");
      return;
    }

    setStatus("sending");
    data.append("access_key", formKey);
    data.append("subject", "New project brief from alialjardabi.com");
    data.append("services", chosen.join(", ") || "Not specified");

    try {
      const response = await fetch(ENDPOINT, { method: "POST", body: data });
      const result = await response.json();
      setStatus(result.success ? "sent" : "error");
    } catch {
      /* Offline, blocked, or refused. Without this the button says
         "Sending…" for ever and the visitor cannot tell. */
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p role="status" className="lab-page-lede max-w-xl">
        Thank you — that reached me with everything I need. I read every brief
        myself and reply from{" "}
        <span className="font-bold">{content.contact.email}</span>, usually
        within a day.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="brief">
      {/* Web3Forms' honeypot: hidden from people, filled by bots. */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} />

      <fieldset className="brief__group">
        <legend className="brief__legend">01 — What do you need</legend>
        <div className="brief__options">
          {services.map((service) => (
            <label key={service.index} className="brief__pill">
              <input
                type="checkbox"
                name="service"
                value={service.name}
                checked={chosen.includes(service.name)}
                onChange={() => toggle(service.name)}
              />
              <span>{service.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="brief__group">
        <legend className="brief__legend">02 — When</legend>
        <div className="brief__options">
          {TIMELINES.map((option) => (
            <label key={option} className="brief__pill">
              <input type="radio" name="timeline" value={option} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="brief__group">
        <legend className="brief__legend">03 — Budget</legend>
        <div className="brief__options">
          {BUDGETS.map((option) => (
            <label key={option} className="brief__pill">
              <input type="radio" name="budget" value={option} />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <p className="brief__note">
          A range is enough. It decides what is possible, not whether I reply.
        </p>
      </fieldset>

      <fieldset className="brief__group">
        <legend className="brief__legend">04 — The business</legend>
        <textarea
          name="business"
          rows={3}
          required
          className="brief__field"
          placeholder="What does the business sell, and who buys it?"
        />
      </fieldset>

      <fieldset className="brief__group">
        <legend className="brief__legend">05 — The problem</legend>
        <textarea
          name="problem"
          rows={4}
          required
          className="brief__field"
          placeholder="What is not working? Be blunt — this is the part I actually work from."
        />
      </fieldset>

      <fieldset className="brief__group">
        <legend className="brief__legend">06 — You</legend>
        <input
          name="name"
          required
          autoComplete="name"
          className="brief__field"
          placeholder="Your name"
        />
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          className="brief__field"
          placeholder="Email"
        />
      </fieldset>

      <div>
        <button type="submit" className="brief__submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send the brief"}
          <span aria-hidden="true">→</span>
        </button>
        {status === "error" && (
          <p role="alert" className="brief__note">
            That did not send. Message me on WhatsApp at{" "}
            <a href={`https://wa.me/${content.contact.whatsapp}`} className="font-bold underline">
              +{content.contact.whatsapp}
            </a>{" "}
            and it will reach me.
          </p>
        )}
      </div>
    </form>
  );
}
