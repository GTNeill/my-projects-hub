import { useEffect, useState } from "react";
import { RotateCcw, Save } from "lucide-react";
import { useAbout, useResetAbout, useUpdateAbout } from "../queries/about";

const field =
  "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent/60";

/**
 * Edits the copy inside the About card — the popup behind the "Built by
 * George Neill" byline on the public index page.
 *
 * The bio is one plain textarea: a blank line starts a new paragraph, which is
 * how the card renders it. That keeps the editing model obvious instead of
 * asking for markup.
 */
export function AboutEditor() {
  const about = useAbout();
  const update = useUpdateAbout();
  const reset = useResetAbout();

  const [draft, setDraft] = useState({ heading: "", bio: "", linkedinUrl: "" });
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(false);

  // Fill the form once, when the saved copy first arrives. Later refetches are
  // ignored on purpose: overwriting the textarea mid-sentence because a
  // background refresh landed would lose whatever was being typed. Saving and
  // restoring set the draft themselves from what the server returned.
  const serverValues = about.data;
  useEffect(() => {
    if (!serverValues || loaded) return;
    setDraft({
      heading: serverValues.heading,
      bio: serverValues.bio,
      linkedinUrl: serverValues.linkedinUrl,
    });
    setLoaded(true);
  }, [serverValues, loaded]);

  const dirty =
    loaded &&
    Boolean(serverValues) &&
    (draft.heading !== serverValues?.heading ||
      draft.bio !== serverValues?.bio ||
      draft.linkedinUrl !== serverValues?.linkedinUrl);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaved(false);
    const next = await update.mutateAsync(draft);
    setDraft({ heading: next.heading, bio: next.bio, linkedinUrl: next.linkedinUrl });
    setSaved(true);
  };

  const restore = async () => {
    setSaved(false);
    const next = await reset.mutateAsync({});
    setDraft({ heading: next.heading, bio: next.bio, linkedinUrl: next.linkedinUrl });
    setSaved(true);
  };

  const error = update.error ?? reset.error;
  const paragraphCount = draft.bio.split(/\n\s*\n/).filter((p) => p.trim()).length;

  return (
    <form onSubmit={save} className="mt-8 rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="label-mono">About card</p>
        <span className="font-mono text-[11px] text-muted-foreground">
          shown when someone clicks &ldquo;George Neill&rdquo; on the home page
        </span>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="label-mono">Heading</span>
          <input
            aria-label="About card heading"
            className={field}
            value={draft.heading}
            onChange={(e) => setDraft({ ...draft, heading: e.target.value })}
          />
        </label>
        <label className="space-y-1">
          <span className="label-mono">LinkedIn URL</span>
          <input
            aria-label="About card LinkedIn URL"
            className={field}
            value={draft.linkedinUrl}
            placeholder="https://linkedin.com/in/…  (blank hides the link)"
            onChange={(e) => setDraft({ ...draft, linkedinUrl: e.target.value })}
          />
        </label>
      </div>

      <label className="mt-3 block space-y-1">
        <span className="label-mono">Bio</span>
        <textarea
          aria-label="About card bio"
          className={`${field} min-h-56 leading-relaxed`}
          value={draft.bio}
          onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
        />
      </label>
      <p className="mt-1.5 font-mono text-[11px] text-muted-foreground">
        Leave a blank line between paragraphs · {paragraphCount}{" "}
        {paragraphCount === 1 ? "paragraph" : "paragraphs"}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={update.isPending || !dirty}
          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--accent-foreground)] disabled:opacity-40"
        >
          <Save className="size-3.5" />
          {update.isPending ? "Saving…" : dirty ? "Save" : "Saved"}
        </button>
        <button
          type="button"
          onClick={restore}
          disabled={reset.isPending}
          className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground disabled:opacity-40"
        >
          <RotateCcw className="size-3.5" />
          {reset.isPending ? "Restoring…" : "Restore default text"}
        </button>
        {saved && !dirty ? (
          <span className="font-mono text-[11px] text-muted-foreground">Live on the site.</span>
        ) : null}
      </div>

      {error ? (
        <p className="mt-3 font-mono text-[11px] text-[color:var(--destructive)]">
          {error.message}
        </p>
      ) : null}
    </form>
  );
}
