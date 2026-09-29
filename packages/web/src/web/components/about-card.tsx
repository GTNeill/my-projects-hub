import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { SupportButton } from "./support-button";
import { useAbout } from "../queries/about";

/**
 * "Built by George Neill", where the name opens a card with his bio, the Ko-fi
 * badge, and a link to LinkedIn.
 *
 * Dismissal follows the brief: the card stays put until it is explicitly
 * closed, any key is pressed, or the user clicks outside it. That means no
 * hover-to-open and no hover-to-close — a card this long needs to survive the
 * pointer leaving it so it can actually be read and its links clicked.
 */
export function AboutCard() {
  const [open, setOpen] = useState(false);
  // The copy lives in the database and is edited from /admin. Fetched on mount
  // rather than on open, so the text is already in hand by the time the card
  // is clicked.
  const about = useAbout();
  const cardRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cardId = useId();

  useEffect(() => {
    if (!open) return;

    // Any key closes, per the brief — not just Escape. Modifier presses on
    // their own are ignored, otherwise tabbing or holding Shift to select text
    // would dismiss the card mid-read.
    const onKeyDown = (event: KeyboardEvent) => {
      if (["Shift", "Control", "Alt", "Meta"].includes(event.key)) return;
      setOpen(false);
    };

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (cardRef.current?.contains(target)) return;
      // Let the trigger's own handler do the toggle, or this would close the
      // card and the click would immediately reopen it.
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="relative inline-block">
      <p className="label-mono">
        Built by{" "}
        <button
          ref={triggerRef}
          type="button"
          onClick={() => setOpen((wasOpen) => !wasOpen)}
          aria-expanded={open}
          aria-controls={open ? cardId : undefined}
          title="About George"
          className="cursor-pointer underline decoration-dotted decoration-from-font underline-offset-4 transition-colors hover:text-foreground"
          style={{ font: "inherit", letterSpacing: "inherit" }}
        >
          George Neill
        </button>
      </p>

      {open ? (
        /* A disclosure, not a dialog: it does not trap focus or block the
           page, and the trigger carries aria-expanded/aria-controls, so a
           section labelled by its heading is the right semantics. */
        <section
          ref={cardRef}
          id={cardId}
          aria-labelledby={`${cardId}-title`}
          className="about-card absolute left-0 top-full z-40 mt-3 w-[min(30rem,calc(100vw-2.5rem))] rounded-2xl border border-border bg-surface p-5 shadow-2xl shadow-black/20 sm:p-6"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute right-3 top-3 grid size-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <X className="size-4" />
          </button>

          <h2 id={`${cardId}-title`} className="label-mono pr-8">
            {about.data?.heading ?? "George Neill"}
          </h2>

          <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {about.data ? (
              about.data.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))
            ) : (
              <p>{about.isError ? "The bio could not be loaded." : "Loading…"}</p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-border pt-4">
            <SupportButton className="opacity-100" />
            {/* Blank LinkedIn URL in the admin console hides the pill. */}
            {about.data?.linkedinUrl ? (
              <a
                href={about.data.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${about.data.heading} on LinkedIn`}
                title="LinkedIn"
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground"
              >
                <LinkedInIcon />
                LinkedIn
              </a>
            ) : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="size-3.5 shrink-0" fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM2.4 9.75h5.16V21H2.4V9.75Zm7.74 0h4.95v1.54h.07a5.42 5.42 0 0 1 4.88-2.68c3.52 0 4.56 2.32 4.56 5.98V21h-5.16v-5.74c0-1.37-.49-2.3-1.71-2.3-.93 0-1.49.63-1.73 1.24-.09.22-.11.52-.11.82V21h-5.16s.07-10.25 0-11.25Z" />
    </svg>
  );
}
