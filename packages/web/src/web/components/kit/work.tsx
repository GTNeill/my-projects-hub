import { cases } from "../../data/kit";
import { Arrow, Ext, Kicker, Reveal } from "./primitives";

export function Work() {
  return (
    <section id="work" className="hairline py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <Reveal>
          <Kicker>02 — The work</Kicker>
          <h2 className="display-lg mt-5 max-w-[22ch]">Three projects, told the only way that matters.</h2>
          <p className="lede mt-5 max-w-[58ch]">
            Problem, solution, outcome. Not a features list — what was broken, what I built, and what
            changed for the people using it.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col gap-20 md:gap-28">
          {cases.map((c, i) => (
            <article key={c.index} className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <Reveal
                className={`lg:col-span-5 ${i % 2 === 1 ? "lg:order-2 lg:col-start-8" : ""}`}
                as="div"
              >
                <div className="flex items-baseline gap-4">
                  <span className="display text-[2.6rem] leading-none text-[var(--accent)]">{c.index}</span>
                  <span className="label !text-[var(--foreground)]">{c.client}</span>
                </div>
                <h3 className="display-lg mt-6 !text-[clamp(1.5rem,2.6vw,2.05rem)]">{c.title}</h3>
                <p className="label mt-4">{c.year}</p>

                <dl className="mt-8 flex flex-col gap-6">
                  <div>
                    <dt className="label !text-[var(--accent)]">Problem</dt>
                    <dd className="mt-2 text-[0.98rem] leading-[1.7] text-[var(--muted-foreground)]">
                      {c.problem}
                    </dd>
                  </div>
                  <div>
                    <dt className="label !text-[var(--accent)]">Solution</dt>
                    <dd className="mt-2 text-[0.98rem] leading-[1.7] text-[var(--muted-foreground)]">
                      {c.solution}
                    </dd>
                  </div>
                  <div>
                    <dt className="label !text-[var(--accent)]">Outcome</dt>
                    <dd className="mt-2 text-[0.98rem] leading-[1.7] text-[var(--foreground)]">
                      {c.outcome}
                    </dd>
                  </div>
                </dl>

                <ul className="mt-8 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <li key={t} className="pill">
                      {t}
                    </li>
                  ))}
                </ul>

                <Ext
                  href={c.url}
                  printUrl
                  className="btn btn-ghost mt-8"
                >
                  Open it live <Arrow />
                </Ext>
                <p className="label mt-3 !text-[10px] !tracking-[0.1em]">{c.urlLabel}</p>
              </Reveal>

              <Reveal
                delay={90}
                className={`lg:col-span-6 ${i % 2 === 1 ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"}`}
                as="div"
              >
                <figure className="card overflow-hidden">
                  <div className="flex items-center gap-2 border-b border-[var(--border)] px-4 py-2.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: "var(--border)" }} />
                    <span className="h-2 w-2 rounded-full" style={{ background: "var(--border)" }} />
                    <span className="h-2 w-2 rounded-full" style={{ background: "var(--accent)" }} />
                    <span className="label ml-2 !text-[10px] !tracking-[0.08em]">{c.urlLabel}</span>
                  </div>
                  <img
                    src={c.shot}
                    alt={c.shotAlt}
                    loading="lazy"
                    className="block w-full border-b border-[var(--border)] object-cover object-top"
                    style={{ aspectRatio: "16 / 10" }}
                  />
                  <figcaption className="label px-4 py-3 !text-[10px] !tracking-[0.08em]">
                    Screenshot, {c.year} · {c.urlLabel}
                  </figcaption>
                </figure>
              </Reveal>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
