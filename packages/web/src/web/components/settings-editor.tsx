import { useState } from "react";
import { useSettings, useUpdateSettings } from "../queries/settings";

export function SettingsEditor() {
  const settings = useSettings();
  const update = useUpdateSettings();
  const [draft, setDraft] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const url = draft ?? settings.data?.tidycalUrl ?? "";
  const dirty = url !== settings.data?.tidycalUrl;

  return (
    <form className="mt-8 rounded-xl border border-border bg-surface p-5" onSubmit={async (event) => {
      event.preventDefault();
      setSaved(false);
      try {
        const next = await update.mutateAsync({ tidycalUrl: url });
        setDraft(next.tidycalUrl);
        setSaved(true);
      } catch { /* The mutation error is shown below; keep the draft. */ }
    }}>
      <p className="label-mono">Booking settings</p>
      <label className="mt-4 block space-y-2">
        <span className="label-mono">TidyCal URL</span>
        <input type="url" required aria-label="TidyCal URL" value={url}
          disabled={!settings.data || update.isPending}
          onChange={(event) => { setDraft(event.target.value); setSaved(false); }}
          className="w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent/60" />
      </label>
      <p className="mt-2 text-sm text-muted-foreground">Used by all booking links on the site, including How I can help you.</p>
      <button type="submit" disabled={!settings.data || !dirty || update.isPending}
        className="mt-4 rounded-full bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--accent-foreground)] disabled:opacity-40">
        {update.isPending ? "Saving…" : "Save booking link"}
      </button>
      {saved ? <output className="mt-2 block text-sm text-muted-foreground">Booking link saved.</output> : null}
      {update.error || settings.error ? <p role="alert" className="mt-2 text-sm text-[color:var(--destructive)]">{(update.error ?? settings.error)?.message}</p> : null}
    </form>
  );
}