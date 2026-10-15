import type { ReactNode } from "react";
import { profile } from "../../data/kit";

/** Fades + rises on first intersection. Delay is the stagger, in ms. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article" | "header";
}) {
  return (
    <Tag className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </Tag>
  );
}

export function Wordmark({ size = "1rem" }: { size?: string }) {
  const { before, accent, after } = profile.wordmark;
  return (
    <span
      className="display inline-flex items-baseline gap-[0.32em]"
      style={{ fontSize: size, letterSpacing: "-0.03em" }}
    >
      <span>{before}</span>
      <span className="text-[var(--accent)] font-normal italic">{accent}</span>
      <span>{after}</span>
    </span>
  );
}

export function Kicker({ children, accent = false }: { children: ReactNode; accent?: boolean }) {
  return <p className={accent ? "label-accent" : "label"}>{children}</p>;
}

export function SectionHead({
  kicker,
  title,
  standfirst,
  className = "",
}: {
  kicker: string;
  title: string;
  standfirst?: string;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <Kicker>{kicker}</Kicker>
      <h2 className="display-lg mt-5 max-w-[19ch]">{title}</h2>
      {standfirst ? <p className="lede mt-5 max-w-[58ch]">{standfirst}</p> : null}
    </Reveal>
  );
}

export function Ext({
  href,
  children,
  className = "",
  printUrl = false,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  printUrl?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer noopener" : undefined}
      className={className}
      {...(printUrl ? { "data-print-url": "true" } : {})}
    >
      {children}
    </a>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      aria-hidden="true"
      className={`h-3 w-3 shrink-0 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" />
    </svg>
  );
}
