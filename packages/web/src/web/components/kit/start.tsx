import { useBookingUrl } from "../../queries/settings";
import { useMemo, useState } from "react";
import { builder, profile, start } from "../../data/kit";
import { Arrow, Ext, Kicker, Reveal } from "./primitives";

function buildMessage(org: string, picked: string[], notes: string, bookingUrl: string) {
  const orgName = org.trim() || "[your organization]";
  const subject = picked.length
    ? `Project inquiry — ${orgName}: ${picked.length} thing${picked.length > 1 ? "s" : ""}`
    : `Project inquiry — ${orgName}`;

  const lines: string[] = [
    `Hi George,`,
    ``,
    `I'm with ${orgName}. We came across your media kit through [where you found it].`,
    ``,
  ];

  if (picked.length) {
    lines.push(`Here's what we're dealing with:`);
    picked.forEach((p) => lines.push(`  - ${p}`));
    lines.push(``);
  } else {
    lines.push(`Here's what we're dealing with: [one line about it]`, ``);
  }

  if (notes.trim()) {
    lines.push(`A bit more: ${notes.trim()}`, ``);
  }

  lines.push(
    `What we'd want out of it: [what would be different if this worked]`,
    ``,
    `We're a [type of organization], roughly [number] people.`,
    ``,
    `Happy to do a 30-minute call — whatever's easiest: ${bookingUrl}`,
    ``,
    `Thanks,`,
    `[your name]`,
  );

  return { subject, body: lines.join("\n") };
}

export function Start() {
  const bookingUrl = useBookingUrl();
  const [org, setOrg] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [copied, setCopied] = useState(false);

  const { subject, body } = useMemo(() => buildMessage(org, picked, notes, bookingUrl), [org, picked, notes, bookingUrl]);

  const toggle = (label: string) =>
    setPicked((prev) => (prev.includes(label) ? prev.filter((p) => p !== label) : [...prev, label]));

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${subject}\n\n${body}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="start" className="hairline py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <Reveal>
          <Kicker>{builder.kicker}</Kicker>
          <h2 className="display-lg mt-5 max-w-[24ch]">{builder.title}</h2>
          <p className="lede mt-5 max-w-[58ch]">{builder.standfirst}</p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal className="lg:col-span-6">
            <div className="card p-6 md:p-7">
              <label className="label block" htmlFor="org">
                Your organization
              </label>
              <input
                id="org"
                aria-label="Your organization"
                value={org}
                onChange={(e) => setOrg(e.target.value)}
                placeholder={builder.orgPlaceholder}
                className="mt-3 w-full rounded-[3px] border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[1rem] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
              />

              <fieldset className="mt-8">
                <legend className="label">What's going on? Tick anything that fits.</legend>
                <div className="mt-4 flex flex-col gap-2">
                  {builder.needs.map((n) => {
                    const on = picked.includes(n.label);
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => toggle(n.label)}
                        aria-pressed={on}
                        className="flex items-start gap-3.5 rounded-[3px] border px-4 py-3.5 text-left transition-colors"
                        style={{
                          borderColor: on ? "var(--accent)" : "var(--border)",
                          background: on ? "color-mix(in oklab, var(--accent) 7%, transparent)" : "transparent",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[3px] flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[2px] border transition-colors"
                          style={{
                            borderColor: on ? "var(--accent)" : "var(--border)",
                            background: on ? "var(--accent)" : "transparent",
                            color: "var(--accent-foreground)",
                          }}
                        >
                          {on ? (
                            <svg viewBox="0 0 12 12" className="h-[10px] w-[10px]" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M2 6.4 4.6 9 10 3.2" />
                            </svg>
                          ) : null}
                        </span>
                        <span>
                          <span className="block text-[0.97rem] leading-[1.5]">{n.label}</span>
                          <span className="label mt-1 block !text-[10px] !tracking-[0.1em]">{n.hint}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <label className="label mt-8 block" htmlFor="notes">
                Anything else worth knowing (optional)
              </label>
              <textarea
                id="notes"
                aria-label="Anything else worth knowing"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="We're a block club of about 40 households and the flyer wall by the co-op is overflowing."
                className="mt-3 w-full resize-y rounded-[3px] border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-[0.97rem] leading-[1.6] outline-none transition-colors placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)]"
              />
            </div>
          </Reveal>

          <Reveal delay={90} className="lg:col-span-6">
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
                <span className="label">Your message, ready to send</span>
                <span className="label !text-[10px]">{picked.length} selected</span>
              </div>
              <div className="max-h-[340px] overflow-auto px-5 py-5">
                <p className="label !text-[var(--foreground)]">Subject</p>
                <p className="mt-2 text-[0.95rem]">{subject}</p>
                <p className="label mt-6 !text-[var(--foreground)]">Body</p>
                <pre className="mt-2 font-sans text-[0.93rem] leading-[1.65] whitespace-pre-wrap text-[var(--muted-foreground)]">
                  {body}
                </pre>
              </div>
              <div className="flex flex-wrap gap-3 border-t border-[var(--border)] px-5 py-4">
                <Ext href={mailto} className="btn btn-primary">
                  {builder.submitLabel} <Arrow />
                </Ext>
                <button type="button" onClick={copy} className="btn btn-ghost">
                  {copied ? "Copied" : builder.copyLabel}
                </button>
              </div>
            </div>

            <div className="mt-6 grid gap-px border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2">
              <Ext
                href={bookingUrl}
                printUrl
                className="group bg-[var(--surface)] p-6 transition-colors hover:bg-[var(--surface-2)]"
              >
                <span className="label">Fastest</span>
                <span className="display-md mt-3 block !text-[1.05rem]">{profile.bookingLabel}</span>
                <span className="label mt-2 block !text-[10px] !tracking-[0.1em]">
                  {bookingUrl.replace(/^https:\/\//, "")}
                </span>
              </Ext>
              <Ext
                href={`mailto:${profile.email}`}
                className="group bg-[var(--surface)] p-6 transition-colors hover:bg-[var(--surface-2)]"
              >
                <span className="label">Or just email</span>
                <span className="display-md mt-3 block !text-[1.05rem]">{profile.email}</span>
                <span className="label mt-2 block !text-[10px] !tracking-[0.1em]">
                  Replies within a day
                </span>
              </Ext>
            </div>
          </Reveal>
        </div>

        <Reveal delay={60}>
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {start.nextSteps.map((s, i) => (
              <li key={s} className="hairline pt-5">
                <span className="label !text-[var(--accent)]">Step {i + 1}</span>
                <p className="mt-3 max-w-[40ch] text-[0.95rem] leading-[1.65] text-[var(--muted-foreground)]">{s}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
