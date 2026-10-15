import { useState } from "react";
import { background, profile, systems } from "../../data/kit";
import { Arrow, Ext, Kicker, Reveal } from "./primitives";

/**
 * Drop a photo at packages/web/public/images/george.jpg and it appears here.
 * If the file isn't there, the block removes itself — no broken image, no placeholder.
 */
function Headshot() {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <div className="card mb-6 flex items-center gap-5 p-5">
      <img
        src="/images/george.jpg"
        alt={profile.name}
        width={88}
        height={88}
        onError={() => setOk(false)}
        className="h-[88px] w-[88px] shrink-0 rounded-[3px] object-cover"
      />
      <div>
        <p className="display-md !text-[1.05rem]">{profile.name}</p>
        <p className="label mt-2 !text-[10px] !tracking-[0.1em]">{profile.location}</p>
      </div>
    </div>
  );
}

const askHref = `mailto:${profile.email}?subject=${encodeURIComponent(
  "A question about my group",
)}&body=${encodeURIComponent(
  [
    "Hi George,",
    "",
    "I came across your media kit and I'd like to talk about something.",
    "",
    "Here's what my group is dealing with: [one line about it]",
    "",
    "Thanks,",
    "[your name]",
  ].join("\n"),
)}`;

export function Background() {
  return (
    <section id="background" className="hairline py-20 md:py-28">
      <div className="mx-auto max-w-[1240px] px-6 md:px-10">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Kicker>{background.kicker}</Kicker>
            <h2 className="display-lg mt-5 max-w-[20ch]">{background.title}</h2>
            <p className="lede mt-6 max-w-[52ch]">{background.standfirst}</p>

            <ul className="mt-12 flex flex-col">
              {background.capabilities.map((c, i) => (
                <Reveal
                  key={c.label}
                  delay={i * 45}
                  as="li"
                  className="hairline grid gap-2 py-6 last:pb-0 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-8"
                >
                  <h3 className="label !text-[var(--accent)]">{c.label}</h3>
                  <p className="text-[0.97rem] leading-[1.7] text-[var(--muted-foreground)]">
                    {c.body}
                  </p>
                </Reveal>
              ))}
            </ul>
          </Reveal>

          <div className="lg:col-span-5">
            <Reveal delay={60}>
              <Headshot />
            </Reveal>

            <Reveal delay={90}>
              <dl className="card divide-y divide-[var(--border)]">
                {background.facts.map((f) => (
                  <div key={f.k} className="flex items-baseline gap-6 px-6 py-5">
                    <dt className="label w-[68px] shrink-0">{f.k}</dt>
                    <dd className="text-[0.96rem] leading-[1.6]">{f.v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={130}>
              <div className="mt-6 grid grid-cols-3 gap-px border border-[var(--border)] bg-[var(--border)]">
                {background.photos.map((p) => (
                  <img
                    key={p.src}
                    src={p.src}
                    alt={p.alt}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                ))}
              </div>
              <p className="label mt-3 !text-[10px] !tracking-[0.1em]">
                Photographs by George Neill —{" "}
                <Ext href={profile.photosUrl} className="link-underline !text-[var(--muted-foreground)]">
                  gneill.net
                </Ext>
              </p>
            </Reveal>

            <Reveal delay={170}>
              <div
                className="card mt-10 p-7"
                style={{
                  borderColor: "color-mix(in oklab, var(--accent) 45%, var(--border))",
                  background: "color-mix(in oklab, var(--accent) 6%, var(--surface))",
                }}
              >
                <p className="label !text-[var(--accent)]">No pitch, no pressure</p>
                <h3 className="display-md mt-4 !text-[1.2rem]">{background.offer.title}</h3>
                <p className="mt-4 text-[0.97rem] leading-[1.7] text-[var(--muted-foreground)]">
                  {background.offer.body}
                </p>
                <Ext href={askHref} className="btn btn-primary mt-6">
                  {background.offer.cta} <Arrow />
                </Ext>
              </div>
            </Reveal>
          </div>
        </div>

        <Reveal delay={60}>
          <div className="hairline mt-16 grid gap-8 pt-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Kicker>In my own words</Kicker>
              <Ext href={profile.portfolioUrl} printUrl className="btn btn-ghost mt-7">
                Everything I've built <Arrow />
              </Ext>
            </div>
            <div className="flex flex-col gap-6 lg:col-span-8">
              {background.paras.map((p, i) => (
                <p
                  key={p.slice(0, 24)}
                  className={
                    i === 0
                      ? "max-w-[64ch] text-[1.08rem] leading-[1.75]"
                      : "max-w-[64ch] text-[1rem] leading-[1.75] text-[var(--muted-foreground)]"
                  }
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Reference material, so it closes the section rather than breaking
            up the narrative above it. */}
        <Reveal delay={60}>
          <div className="hairline mt-16 pt-14">
            <Kicker>{systems.kicker}</Kicker>
            <p className="lede mt-5 max-w-[64ch]">{systems.standfirst}</p>

            <dl className="mt-12 grid gap-x-16 lg:grid-cols-2">
              {systems.groups.map((g) => (
                <div key={g.label} className="hairline grid gap-2 py-4 sm:grid-cols-[minmax(0,10rem)_1fr] sm:gap-8">
                  <dt className="label !text-[10px] !tracking-[0.12em] !text-[var(--foreground)]">
                    {g.label}
                  </dt>
                  {/* flex-wrap, not inline spans: two adjacent inline boxes with
                      no whitespace between them offer no wrap point, so the
                      whole row measured as its own min-content and pushed the
                      page 845px wide on a phone. */}
                  <dd className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 text-[0.93rem] leading-[1.65] text-[var(--muted-foreground)]">
                    {g.tools.map((tool, j) => (
                      <span key={tool} className="inline-flex items-baseline gap-2.5 whitespace-nowrap">
                        {j > 0 ? (
                          <span aria-hidden="true" className="opacity-40">
                            ·
                          </span>
                        ) : null}
                        {tool}
                      </span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
