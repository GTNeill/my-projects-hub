import { useEffect } from "react";

/**
 * Adds `is-in` to every `.reveal` element as it scrolls into view, once.
 * Staggering comes from the element's own `transitionDelay` (see Reveal component).
 */
export function useReveal() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (!nodes.length) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);
}

/** Tracks which section id is currently in view, for the sticky nav. */
export function useScrollSpy(ids: string[]) {
  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (!sections.length) return;

    const onScroll = () => {
      const probe = window.innerHeight * 0.35;
      let current = "";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= probe) current = section.id;
      }
      document.querySelectorAll<HTMLElement>("[data-nav-item]").forEach((el) => {
        const active = el.dataset.navItem === current;
        el.dataset.active = active ? "true" : "false";
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);
}
