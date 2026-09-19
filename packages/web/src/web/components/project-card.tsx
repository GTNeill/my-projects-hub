import { ArrowUpRight, Image as ImageIcon } from "lucide-react";
import { CopyButton } from "./copy-button";

export interface ProjectView {
  id: number;
  title: string;
  url: string;
  host: string;
  tagline: string;
  description: string;
  image: string | null;
  featured: boolean;
}

interface ProjectCardProps {
  project: ProjectView;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const { title, url, host, tagline, description, image, featured } = project;

  return (
    <article
      className={`rise group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-accent/50 ${
        featured ? "md:col-span-2" : ""
      }`}
      style={{ animationDelay: `${Math.min(index, 12) * 55}ms` }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-[16/10] overflow-hidden border-b border-border bg-surface-2"
        aria-label={`Open ${title}`}
      >
        {image ? (
          <img
            src={image}
            alt={`${title} screenshot`}
            loading="lazy"
            className="size-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <ImageIcon className="size-5" />
            <span className="label-mono">No screenshot yet</span>
          </span>
        )}
        <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface/90 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </a>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-xl leading-tight font-semibold">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-start gap-1.5 decoration-accent/60 decoration-2 underline-offset-4 hover:underline"
            >
              {title}
              <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-accent" />
            </a>
          </h2>
        </div>

        {tagline ? (
          <p className="label-mono text-[color:var(--accent)]">{tagline}</p>
        ) : null}

        {description ? (
          <p className="text-[15px] leading-relaxed text-muted-foreground">{description}</p>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-surface-2 px-3 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {host}
          </a>
          <CopyButton value={url} />
        </div>
      </div>
    </article>
  );
}
