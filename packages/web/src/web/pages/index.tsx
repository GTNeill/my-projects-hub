import { useState } from "react";
import { Link } from "wouter";
import { Check, Lock, Share2 } from "lucide-react";
import { useProjects } from "../queries/projects";
import { ProjectCard } from "../components/project-card";
import { ThemeToggle } from "../components/theme-toggle";
import { CopyButton } from "../components/copy-button";
import { SupportButton } from "../components/support-button";

type ShareState = "idle" | "copied" | "empty" | "failed";

function Index() {
  const projects = useProjects();
  const items = projects.data ?? [];
  const [shareState, setShareState] = useState<ShareState>("idle");

  const shareAll = async () => {
    // Without this guard the button silently put an empty string on the
    // clipboard whenever the list had not loaded yet or the request failed,
    // so it looked like it worked and the paste came out blank.
    if (items.length === 0) {
      setShareState("empty");
      setTimeout(() => setShareState("idle"), 1800);
      return;
    }

    const text = items.map((p) => `${p.title} — ${p.url}`).join("\n");

    // Only hand off to the OS share sheet on a touch device. Desktop Chrome on
    // Windows, Edge, and Safari on macOS all expose navigator.share, so testing
    // for the API alone sent desktop clicks into a share dialog and returned
    // before anything reached the clipboard — the button did nothing you could
    // paste. A coarse pointer with no hover is the phone/tablet case, where the
    // share sheet is genuinely better than a clipboard write.
    const isTouchDevice =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(pointer: coarse)").matches &&
      !window.matchMedia("(hover: hover)").matches;

    if (isTouchDevice && navigator.share) {
      try {
        await navigator.share({
          title: "Things George built",
          text,
          url: window.location.origin,
        });
        return;
      } catch {
        /* share sheet dismissed or unavailable — fall through to clipboard */
      }
    }

    let copied = false;
    try {
      await navigator.clipboard.writeText(text);
      copied = true;
    } catch {
      // Same fallback the per-card copy button uses: the async clipboard API
      // refuses to write when the document is not focused, and is missing
      // entirely outside a secure context.
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        copied = document.execCommand("copy");
      } catch {
        copied = false;
      }
      area.remove();
    }

    // Reporting "Copied" after a failed write is worse than reporting nothing:
    // it sends you to paste something that was never put there.
    setShareState(copied ? "copied" : "failed");
    setTimeout(() => setShareState("idle"), 2400);
  };

  const shareLabel =
    shareState === "copied"
      ? "Copied"
      : shareState === "empty"
        ? "Nothing to share"
        : shareState === "failed"
          ? "Copy blocked"
          : "Share all";

  return (
    <div className="page-glow relative min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="font-mono text-sm tracking-tight">
            <span className="text-muted-foreground">tech.</span>
            <span className="font-medium">gneill</span>
            <span className="text-muted-foreground">.net</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={shareAll}
              title="Copy every project title and link as a list"
              className={`hidden items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors hover:border-accent/60 hover:text-foreground sm:inline-flex ${
                shareState === "copied"
                  ? "text-[color:var(--success)]"
                  : "text-muted-foreground"
              }`}
            >
              {shareState === "copied" ? (
                <Check className="size-3.5" />
              ) : (
                <Share2 className="size-3.5" />
              )}
              {shareLabel}
            </button>
            <ThemeToggle />
            <Link
              href="/admin"
              className="grid size-9 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground"
              aria-label="Admin"
            >
              <Lock className="size-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24">
        <section className="rise py-14 md:py-20">
          <p className="label-mono">Built by George Neill</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.05] font-bold tracking-tight md:text-6xl">
            Things I&apos;ve built, and where to find them.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Apps, tools, and sites — mostly for neighbors, community groups, and my own
            curiosity. Every card links straight to the live thing.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="label-mono">
              {projects.isLoading ? "Loading" : `${items.length} live projects`}
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
        </section>

        {projects.isError ? (
          <p className="rounded-xl border border-border bg-surface p-6 text-muted-foreground">
            Couldn&apos;t load projects. Reload the page.
          </p>
        ) : null}

        {!projects.isLoading && items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface p-10 text-center">
            <p className="text-muted-foreground">
              No projects yet.{" "}
              <Link href="/admin" className="text-[color:var(--accent)] hover:underline">
                Add the first one
              </Link>
              .
            </p>
          </div>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>

        <footer className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-8">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-mono text-[11px] text-muted-foreground">
              <a
                href="mailto:george@gneill.net"
                className="transition-colors hover:text-foreground hover:underline"
              >
                george neill
              </a>
              {" · chicago · "}
              {new Date().getFullYear()}
            </p>
            <SupportButton />
          </div>
          <CopyButton value={window.location.origin} label="Copy this page" />
        </footer>
      </main>
    </div>
  );
}

export default Index;
