import { Link } from "wouter";
import { useProjects } from "../../queries/projects";
import { useBookingUrl } from "../../queries/settings";
import { hero, profile } from "../../data/kit";
import { Arrow, Ext, Kicker, Reveal, Wordmark } from "./primitives";

export function Hero() {
  const bookingUrl = useBookingUrl();
  const projects = useProjects();
  const items = projects.data ?? [];
  const liveNow = items.slice(0, 4);
  const remaining = Math.max(items.length - liveNow.length, 0);
  return (
    <section id="top" className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-32 h-[420px] w-[420px] rounded-full opacity-[0.16] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 68%)" }}
      />
      <div className="relative mx-auto grid max-w-[1240px] gap-14 px-6 md:px-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <Kicker accent>{hero.kicker}</Kicker>
          </Reveal>

          <Reveal delay={60}>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Wordmark size="1.5rem" />
              <span className="label !tracking-[0.14em]">
                {profile.name} · {profile.location}
              </span>
            </div>
          </Reveal>

          <Reveal delay={110}>
            <h1 className="display-xl mt-8 text-balance">{hero.title}</h1>
          </Reveal>

          <Reveal delay={170}>
            <p className="lede mt-7 max-w-[54ch]">{hero.standfirst}</p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Ext href={bookingUrl} className="btn btn-primary">
                {profile.bookingLabel} <Arrow />
              </Ext>
              <Ext href={`mailto:${profile.email}`} className="btn btn-ghost">
                {profile.email}
              </Ext>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <ul className="mt-9 flex flex-wrap gap-2">
              {hero.credentials.map((c) => (
                <li key={c} className="pill">
                  {c}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={330}>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="label">Where to look</span>
              {hero.jumpLinks.map((l) => (
                <a key={l.href} href={l.href} className="label !text-[var(--foreground)] hover:!text-[var(--accent)]">
                  {l.label} →
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={200} className="lg:col-span-5">
          <div className="card grain overflow-hidden">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-3.5">
              <span className="label">Live right now</span>
              <span className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--accent)", boxShadow: "0 0 0 3px color-mix(in oklab, var(--accent) 22%, transparent)" }}
                />
                <span className="label !text-[var(--accent)]">In production</span>
              </span>
            </div>
            {projects.isPending ? <p className="px-5 py-4 text-sm text-muted-foreground">Loading projects…</p> : null}
            {projects.isError ? <p className="px-5 py-4 text-sm text-muted-foreground">Projects could not be loaded.</p> : null}
            {projects.isSuccess && items.length === 0 ? <p className="px-5 py-4 text-sm text-muted-foreground">No public projects yet.</p> : null}
            <ul>
              {liveNow.map((t, i) => (
                <li key={t.id} className={i > 0 ? "border-t border-[var(--border)]" : ""}>
                  <Ext
                    href={t.url}
                    printUrl
                    className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-[var(--surface-2)]"
                  >
                    <span>
                      <span className="display-md block !text-[1.02rem]">{t.title}</span>
                      <span className="label mt-1 block !text-[10px] !tracking-[0.1em]">
                        {t.url.replace("https://", "")}
                      </span>
                    </span>
                    <Arrow className="text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--accent)]" />
                  </Ext>
                </li>
              ))}
            </ul>
            <div className="border-t border-[var(--border)] px-5 py-4">
              <p className="label !leading-[1.9]">
                {remaining > 0 ? `${remaining} more projects — ` : ""}
                <Link href="/" className="text-[var(--foreground)] hover:text-[var(--accent)]">
                  {projects.isSuccess ? `see all ${items.length}` : "see all projects"}
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
