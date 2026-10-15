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

/**
 * The media kit, served at /how-i-can-help on the portfolio domain.
 *
 * `kit` carries the base type scale the kit was designed against (17px / 1.7)
 * without touching the projects page, which uses Tailwind's own sizes.
 */
function Help() {
  useReveal();

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
