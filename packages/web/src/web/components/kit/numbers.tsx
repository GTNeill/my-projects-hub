import { stats } from "../../data/kit";
import { Kicker, Reveal } from "./primitives";

export function Numbers() {
  return (
    <section id="numbers" className="hairline py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <Reveal>
          <Kicker>{stats.kicker}</Kicker>
          <h2 className="display-lg mt-5 max-w-[24ch]">{stats.title}</h2>
        </Reveal>

        <dl className="mt-14 grid gap-px border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {stats.items.map((s, i) => (
            <Reveal key={s.label} delay={i * 70} as="div" className="bg-[var(--surface)] p-7 md:p-8">
              <dt className="label">{s.label}</dt>
              <dd>
                <span className="display mt-5 block text-[clamp(2.6rem,5vw,3.6rem)] leading-none">
                  {s.figure}
                </span>
                <p className="mt-5 text-[0.95rem] leading-[1.65] text-[var(--muted-foreground)]">
                  {s.detail}
                </p>
              </dd>
            </Reveal>
          ))}
        </dl>

        <div className="mt-8 grid gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-2">
          {stats.strip.points.map((p, i) => (
            <Reveal key={p.title} delay={90 + i * 70} className="bg-[var(--surface-2)] p-7 md:p-8">
              <h3 className="display-md !text-[1.2rem]">{p.title}</h3>
              <p className="mt-4 max-w-[52ch] text-[0.96rem] leading-[1.7] text-[var(--muted-foreground)]">
                {p.body}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <p className="label mt-6 !tracking-[0.1em]">{stats.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
