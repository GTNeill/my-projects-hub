import { useEffect } from "react";
import { Background } from "../components/kit/background";
import { Footer } from "../components/kit/footer";
import { Hero } from "../components/kit/hero";
import { Numbers } from "../components/kit/numbers";
import { Packages } from "../components/kit/packages";
import { Process } from "../components/kit/process";
import { Shelf } from "../components/kit/shelf";
import { SiteNav } from "../components/kit/site-nav";
import { Start } from "../components/kit/start";
import { Work } from "../components/kit/work";
import { useReveal } from "../hooks/use-reveal";

const TITLE = "How I can help you — tech by George";
const DESCRIPTION =
  "For neighborhood groups and nonprofits: the tools I've built, the numbers behind them, and a short message builder that starts the conversation.";

/**
 * The media kit, served at /how-i-can-help on the portfolio domain.
 *
 * `kit` carries the base type scale the kit was designed against (17px / 1.7)
 * without touching the projects page, which uses Tailwind's own sizes.
 */
function Help() {
  useReveal();

  // One index.html serves every route, so the title and description have to be
  // swapped here or a shared /how-i-can-help link previews as the projects page.
  useEffect(() => {
    const previousTitle = document.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = meta?.content;
    document.title = TITLE;
    if (meta) meta.content = DESCRIPTION;
    return () => {
      document.title = previousTitle;
      if (meta && previousDescription !== undefined) meta.content = previousDescription;
    };
  }, []);

  return (
    <div className="kit min-h-screen">
      <SiteNav />
      <main>
        <Hero />
        <Numbers />
        <Work />
        <Shelf />
        <Background />
        <Packages />
        <Process />
        <Start />
      </main>
      <Footer />
    </div>
  );
}

export default Help;
