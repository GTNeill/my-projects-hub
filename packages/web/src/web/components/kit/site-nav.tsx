import { useEffect, useState } from "react";
import { Link } from "wouter";
import { nav, profile } from "../../data/kit";
import { applyTheme, storedTheme, type Theme } from "../../lib/theme";
import { useScrollSpy } from "../../hooks/use-reveal";
import { Wordmark } from "./primitives";

const NAV_IDS = nav.map((n) => n.id);

/**
 * The portfolio owns the theme: it stores under "projects-theme" and flips the
 * `.light` class on <html>. This page shares that, so the toggle here and the
 * one on the projects page never disagree — the kit's own useTheme used a
 * separate key and a `.dark` class that this stylesheet does not read.
 */
function useSiteTheme() {
  const [theme, setTheme] = useState<Theme>(() => storedTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
}

export function SiteNav() {
  const { theme, toggle } = useSiteTheme();
  const [scrolled, setScrolled] = useState(false);
  useScrollSpy(NAV_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="no-print sticky top-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: scrolled ? "color-mix(in oklab, var(--background) 88%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : undefined,
        borderBottom: `1px solid ${scrolled ? "var(--rule)" : "transparent"}`,
      }}
    >
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-6 px-6 py-4 md:flex-nowrap md:px-10">
        <a href="#top" className="shrink-0">
          <Wordmark size="1.05rem" />
        </a>

        <nav className="no-scrollbar ml-auto hidden items-center gap-1 overflow-x-auto md:flex">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-nav-item={item.id}
              className="label rounded-[3px] px-2.5 py-1.5 transition-colors hover:text-[var(--foreground)] data-[active=true]:text-[var(--accent)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <nav className="no-scrollbar order-last -mx-6 mt-3 flex w-[calc(100%+3rem)] items-center gap-1 overflow-x-auto px-6 md:hidden">
          {nav.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              data-nav-item={item.id}
              className="label shrink-0 rounded-[3px] px-2.5 py-1.5 transition-colors data-[active=true]:text-[var(--accent)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href="/"
            className="label rounded-[3px] px-2.5 py-1.5 transition-colors hover:text-[var(--accent)]"
          >
            All projects
          </Link>
          <button
            type="button"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-[var(--border)] text-[var(--muted-foreground)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="10" cy="10" r="3.4" />
                <path d="M10 2v1.6M10 16.4V18M2 10h1.6M16.4 10H18M4.4 4.4l1.1 1.1M14.5 14.5l1.1 1.1M15.6 4.4l-1.1 1.1M5.5 14.5l-1.1 1.1" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M16.5 12.4A7 7 0 0 1 7.6 3.5a7 7 0 1 0 8.9 8.9Z" />
              </svg>
            )}
          </button>
          <a
            href={profile.bookingUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-primary !px-4 !py-2.5 !text-[11px]"
          >
            Book a call
          </a>
        </div>
      </div>
    </header>
  );
}
