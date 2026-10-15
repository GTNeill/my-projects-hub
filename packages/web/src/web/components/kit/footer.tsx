import { useBookingUrl } from "../../queries/settings";
import { nav, profile } from "../../data/kit";
import { Ext, Reveal, Wordmark } from "./primitives";

export function Footer() {
  const bookingUrl = useBookingUrl();
  return (
    <footer className="hairline mt-4 py-14">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Wordmark size="1.35rem" />
              <p className="label mt-4">
                {profile.name} · {profile.location}
              </p>
              <p className="mt-5 max-w-[44ch] text-[0.95rem] leading-[1.7] text-[var(--muted-foreground)]">
                Media kit {profile.kitYear}. Built for the people who hold community groups and nonprofits
                together — take what's useful, ignore the rest.
              </p>
            </div>

            <div className="lg:col-span-3 lg:col-start-7">
              <p className="label">On this page</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {nav.map((n) => (
                  <li key={n.id}>
                    <a
                      href={`#${n.id}`}
                      className="text-[0.93rem] text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
                    >
                      {n.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3 lg:col-start-10">
              <p className="label">Get in touch</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                <li>
                  <Ext
                    href={bookingUrl}
                    printUrl
                    className="text-[0.93rem] text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
                  >
                    Book a 30-minute call
                  </Ext>
                </li>
                <li>
                  <Ext
                    href={`mailto:${profile.email}`}
                    className="text-[0.93rem] text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
                  >
                    {profile.email}
                  </Ext>
                </li>
                <li>
                  <Ext
                    href={profile.portfolioUrl}
                    printUrl
                    className="text-[0.93rem] text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
                  >
                    tech.gneill.net
                  </Ext>
                </li>
                <li>
                  <Ext
                    href={profile.photosUrl}
                    printUrl
                    className="text-[0.93rem] text-[var(--muted-foreground)] transition-colors hover:text-[var(--accent)]"
                  >
                    photos by George
                  </Ext>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => window.print()}
                className="btn btn-ghost no-print mt-6 !px-4 !py-2.5 !text-[11px]"
              >
                Save as PDF
              </button>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--rule)] pt-6">
            <p className="label !text-[10px] !tracking-[0.1em]">
              © {profile.kitYear} {profile.name}
            </p>
            <p className="label !text-[10px] !tracking-[0.1em]">
              Everything on this page is live. Go click it.
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
