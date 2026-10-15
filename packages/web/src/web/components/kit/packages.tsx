import { packages, profile } from "../../data/kit";
import { Arrow, Ext, Kicker, Reveal } from "./primitives";

export function Packages() {
  return (
    <section id="packages" className="hairline py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <Reveal>
          <Kicker>{packages.kicker}</Kicker>
          <h2 className="display-lg mt-5 max-w-[20ch]">{packages.title}</h2>
          <p className="lede mt-5 max-w-[58ch]">{packages.standfirst}</p>
        </Reveal>

        <ul className="mt-14 grid gap-px border border-[var(--border)] bg-[var(--border)] lg:grid-cols-3">
          {packages.terms.map((t, i) => (
            <Reveal key={t.index} delay={i * 80} as="li" className="bg-[var(--surface)] p-7 md:p-8">
              <div className="flex items-baseline justify-between gap-4">
                <span className="display text-[2.4rem] leading-none text-[var(--accent)]">{t.index}</span>
                <span className="label !text-right !text-[10px] !tracking-[0.1em] !leading-[1.7]">
                  {t.best}
                </span>
              </div>
              <h3 className="display-md mt-6">{t.name}</h3>
              <p className="mt-4 text-[0.95rem] leading-[1.7] text-[var(--muted-foreground)]">{t.body}</p>
              <ul className="mt-7 flex flex-col gap-3">
                {t.includes.map((inc) => (
                  <li key={inc} className="flex gap-3 text-[0.92rem] leading-[1.6]">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-[5px] w-[5px] shrink-0"
                      style={{ background: "var(--accent)" }}
                    />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={100}>
          <div
            className="card mt-8 grid gap-6 p-7 md:grid-cols-12 md:items-start md:p-8"
            style={{
              borderColor: "color-mix(in oklab, var(--accent) 45%, var(--border))",
              background: "color-mix(in oklab, var(--accent) 6%, var(--surface))",
            }}
          >
            <p className="display-md md:col-span-4 !text-[1.3rem]">{packages.note.headline}</p>
            <div className="md:col-span-8">
              <p className="max-w-[62ch] text-[0.97rem] leading-[1.7] text-[var(--muted-foreground)]">
                {packages.note.detail}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Ext href={profile.bookingUrl} printUrl className="btn btn-primary">
                  {profile.bookingLabel} <Arrow />
                </Ext>
                <Ext href={`mailto:${profile.email}`} className="btn btn-ghost">
                  {profile.email}
                </Ext>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
