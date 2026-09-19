/**
 * "Made with Runable" badge — 50% opacity, full opacity on hover.
 * Referral code comes from VITE_REFERRAL_CODE when set, otherwise "gtn".
 */
export function MadeWithRunable() {
  const code = import.meta.env.VITE_REFERRAL_CODE || "gtn";
  return (
    <a
      href={`https://runable.link/${code}`}
      target="_blank"
      rel="noopener noreferrer"
      data-runable-ignore
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3.5 py-2 font-mono text-[11px] tracking-wide text-muted-foreground opacity-50 backdrop-blur transition-all hover:-translate-y-px hover:opacity-100 hover:text-foreground"
    >
      <span className="size-1.5 rounded-full bg-accent" />
      Made with Runable
    </a>
  );
}
