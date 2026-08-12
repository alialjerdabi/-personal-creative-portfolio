"use client";

import { useState } from "react";

/**
 * The enquiry form.
 *
 * Posts to Web3Forms, which emails the submission straight to Ali. No
 * backend route, no runtime dependency, no secret held by this app —
 * the access key is a public form identifier, which is why it can sit in
 * a NEXT_PUBLIC_ variable without being a leak.
 *
 * RENDERS NOTHING WITHOUT A KEY. A form that silently fails to send is
 * worse than no form at all: the visitor believes they have made contact
 * and never follows up, and the enquiry is lost with no trace on either
 * side. Until NEXT_PUBLIC_WEB3FORMS_KEY is set, the contact section
 * falls back to WhatsApp and email, which both work today.
 *
 * `botcheck` is Web3Forms' honeypot — hidden from people, filled in by
 * bots, and submissions carrying it are dropped. Cheaper and less
 * hostile than a CAPTCHA, which visitors should never be asked to solve
 * to send an email.
 */
const ENDPOINT = "https://api.web3forms.com/submit";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm({ accessKey }: { accessKey: string }) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");

    const data = new FormData(event.currentTarget);
    data.append("access_key", accessKey);
    data.append("subject", "New enquiry from alialjardabi.com");

    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      setStatus(result.success ? "sent" : "error");
    } catch {
      /*
       * Network failure, blocked request, offline. The catch matters:
       * without it the promise rejects, the button stays on "Sending…"
       * for ever, and the visitor cannot tell whether it worked.
       */
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <p
        role="status"
        className="mt-10 rounded-[1.25rem] border border-white/20 bg-white/5 p-6 font-display text-[16px] leading-relaxed text-white"
      >
        Thanks — that reached me. I&rsquo;ll reply from{" "}
        <span className="font-bold">alialjardabi@gmail.com</span>, usually
        within a day.
      </p>
    );
  }

  const field =
    "w-full rounded-[0.9rem] border border-white/20 bg-white/5 px-4 py-3 font-display text-[16px] text-white placeholder:text-white/40 focus:border-white/50 focus:outline-none focus:ring-2 focus:ring-white/30";

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-xl">
      {/* Honeypot. Hidden from people, irresistible to bots. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="font-display text-[14px] text-white/60">Name</span>
          <input
            type="text"
            name="name"
            required
            autoComplete="name"
            className={`mt-2 ${field}`}
          />
        </label>
        <label className="block">
          <span className="font-display text-[14px] text-white/60">Email</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            className={`mt-2 ${field}`}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="font-display text-[14px] text-white/60">
          What are you building?
        </span>
        <textarea
          name="message"
          required
          rows={4}
          className={`mt-2 resize-y ${field}`}
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-white px-7 py-3.5 font-display text-[15px] font-bold text-lab-ink-warm transition-transform hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-lab-ink-warm disabled:scale-100 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send it"}
        </button>

        {status === "error" && (
          <p role="alert" className="font-display text-[15px] text-white/80">
            That didn&rsquo;t send. WhatsApp or email me instead — both are
            above.
          </p>
        )}
      </div>
    </form>
  );
}
