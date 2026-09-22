/**
 * Ko-fi "Buy me a Coffee" pill. Rendered natively (no Ko-fi script) so nothing
 * loads over the network and it can be sized to sit inline in the footer.
 * Target comes from VITE_SUPPORT_URL, defaulting to ko-fi.com/georgeneill.
 */
export function SupportButton() {
  const url = import.meta.env.VITE_SUPPORT_URL || "https://ko-fi.com/georgeneill";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full bg-[#323842] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-white opacity-50 transition-all hover:-translate-y-px hover:opacity-100"
    >
      <CupIcon />
      Buy me a Coffee
    </a>
  );
}

function CupIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4Z" />
      <line x1="6" y1="2" x2="6" y2="4" />
      <line x1="10" y1="2" x2="10" y2="4" />
      <line x1="14" y1="2" x2="14" y2="4" />
    </svg>
  );
}
