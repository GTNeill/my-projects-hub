import { process, quotes } from "../../data/kit";
import { Kicker, Reveal } from "./primitives";

export function Process() {
  return (
    <section id="process" className="hairline py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <Reveal>
          <Kicker>{process.kicker}</Kicker>
          <h2 className="display-lg mt-5 max-w-[16ch]">{process.title}</h2>
        </Reveal>

        <ol className="mt-14 grid gap-px border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-4">
          {process.steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 70} as="li" className="bg-[var(--surface)] p-7">
              <span className="label !text-[var(--accent)]">{s.n}</span>
              <h3 className="display-md mt-5 !text-[1.15rem]">{s.title}</h3>
              <p className="mt-3 text-[0.93rem] leading-[1.65] text-[var(--muted-foreground)]">{s.body}</p>
            </Reveal>
          ))}
        </ol>

        {quotes.length > 0 ? (
          <div className="mt-16">
            <Reveal>
              <Kicker>In their words</Kicker>
            </Reveal>
            <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {quotes.map((q, i) => (
                <Reveal key={q.name} delay={i * 70} as="li" className="card flex flex-col p-7">
                  <blockquote className="display-md !text-[1.05rem] !leading-[1.5]">“{q.text}”</blockquote>
                  <footer className="label mt-auto pt-6">
                    {q.name} — {q.role}
                  </footer>
                </Reveal>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
