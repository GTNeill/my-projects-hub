import { shelf } from "../../data/kit";
import { Arrow, Ext, Kicker, Reveal } from "./primitives";

export function Shelf() {
  return (
    <section id="shelf" className="hairline py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <Reveal>
          <Kicker>{shelf.kicker}</Kicker>
          <h2 className="display-lg mt-5 max-w-[20ch]">{shelf.title}</h2>
          <p className="lede mt-5 max-w-[54ch]">{shelf.standfirst}</p>
        </Reveal>

        <ul className="mt-14 grid gap-px border border-[var(--border)] bg-[var(--border)] md:grid-cols-2 lg:grid-cols-3">
          {shelf.items.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 60} as="li" className="bg-[var(--surface)]">
              <Ext
                href={t.url}
                printUrl
                className="group flex h-full flex-col p-6 transition-colors hover:bg-[var(--surface-2)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="label">{t.tag}</span>
                  <Arrow className="mt-1 text-[var(--muted-foreground)] transition-colors group-hover:text-[var(--accent)]" />
                </div>
                <h3 className="display-md mt-5 !text-[1.12rem]">{t.name}</h3>
                <p className="mt-3 text-[0.93rem] leading-[1.65] text-[var(--muted-foreground)]">
                  {t.blurb}
                </p>
                <span className="label mt-6 !text-[10px] !tracking-[0.1em] group-hover:!text-[var(--accent)]">
                  {t.urlLabel}
                </span>
              </Ext>
            </Reveal>
          ))}

          <Reveal as="li" className="bg-[var(--surface-2)]">
            <a
              href="#start"
              className="group flex h-full flex-col justify-between p-6 transition-colors hover:bg-[var(--surface)]"
            >
              <span className="label">Not on the list</span>
              <span>
                <span className="display-md mt-5 block !text-[1.12rem]">
                  Your problem is the one I haven't built yet.
                </span>
                <span className="mt-3 block text-[0.93rem] leading-[1.65] text-[var(--muted-foreground)]">
                  Tell me what your organization keeps doing by hand and I'll tell you straight
                  whether it's worth building.
                </span>
                <span className="label mt-6 block !text-[10px] !tracking-[0.1em] group-hover:!text-[var(--accent)]">
                  Start a project →
                </span>
              </span>
            </a>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
