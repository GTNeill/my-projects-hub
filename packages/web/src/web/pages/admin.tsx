import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Camera, LogOut, Plus } from "lucide-react";
import { authClient } from "../lib/auth";
import { useAllProjects, useCaptureMissing, useCreateProject, useMe } from "../queries/projects";
import { ProjectEditor } from "../components/project-editor";
import { ThemeToggle } from "../components/theme-toggle";

const field =
  "w-full rounded-md border border-border bg-surface-2 px-3 py-2 text-sm outline-none focus:border-accent/60";

function Admin() {
  const session = authClient.useSession();
  const me = useMe();
  const signedIn = Boolean(session.data);
  const isAdmin = me.data?.isAdmin ?? false;
  const projects = useAllProjects(signedIn && isAdmin);
  const create = useCreateProject();
  const captureMissing = useCaptureMissing();

  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState({ title: "", url: "", tagline: "", description: "" });

  const signIn = async () => {
    setError(null);
    // Top-level redirect to Google, returning to /admin signed in.
    const { error: signInError } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/admin",
    });
    if (signInError) setError(signInError.message ?? "Sign-in failed");
  };

  const submitDraft = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.url.trim()) return;
    await create.mutateAsync({ ...draft, hidden: false });
    setDraft({ title: "", url: "", tagline: "", description: "" });
    setAdding(false);
  };

  return (
    <div className="page-glow relative min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            back to site
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {signedIn ? (
              <button
                type="button"
                onClick={async () => {
                  await authClient.signOut();
                  await me.refetch();
                }}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            ) : null}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-10">
        <p className="label-mono">Admin</p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Project console
        </h1>

        {!signedIn ? (
          <div className="mt-8 rounded-xl border border-border bg-surface p-8">
            <p className="text-muted-foreground">
              Sign in with Google to edit descriptions, hide projects, and refresh screenshots.
            </p>
            <button
              type="button"
              onClick={signIn}
              className="mt-5 rounded-full bg-accent px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.12em] text-[color:var(--accent-foreground)]"
            >
              Sign in with Google
            </button>
            {error ? (
              <p className="mt-3 font-mono text-[11px] text-[color:var(--destructive)]">{error}</p>
            ) : null}
          </div>
        ) : !isAdmin ? (
          <div className="mt-8 rounded-xl border border-border bg-surface p-8">
            <p className="text-muted-foreground">
              {me.data?.email} isn&apos;t on the admin list. Sign out and use an allowlisted
              account.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setAdding((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--accent-foreground)]"
              >
                <Plus className="size-3.5" />
                Add project
              </button>
              <button
                type="button"
                onClick={() => captureMissing.mutate({})}
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-mono text-[11px] uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-accent/60 hover:text-foreground"
              >
                <Camera className="size-3.5" />
                {captureMissing.isPending ? "Capturing…" : "Capture missing screenshots"}
              </button>
              <span className="label-mono ml-auto">
                {projects.data?.length ?? 0} projects ·{" "}
                {projects.data?.filter((p) => p.hidden).length ?? 0} hidden
              </span>
            </div>

            {adding ? (
              <form
                onSubmit={submitDraft}
                className="mt-4 space-y-3 rounded-xl border border-accent/40 bg-surface p-4"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="space-y-1">
                    <span className="label-mono">Title</span>
                    <input
                      aria-label="New project title"
                      className={field}
                      value={draft.title}
                      onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="label-mono">URL</span>
                    <input
                      aria-label="New project URL"
                      className={field}
                      value={draft.url}
                      placeholder="example.com"
                      onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                    />
                  </label>
                </div>
                <label className="block space-y-1">
                  <span className="label-mono">Tagline</span>
                  <input
                    aria-label="New project tagline"
                    className={field}
                    value={draft.tagline}
                    onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="label-mono">Description</span>
                  <textarea
                    aria-label="New project description"
                    className={`${field} min-h-20`}
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  />
                </label>
                <button
                  type="submit"
                  disabled={create.isPending}
                  className="rounded-full bg-accent px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--accent-foreground)] disabled:opacity-40"
                >
                  {create.isPending ? "Adding" : "Add"}
                </button>
              </form>
            ) : null}

            <div className="mt-6 space-y-4">
              {projects.data?.map((project) => (
                <ProjectEditor key={project.id} project={project} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Admin;
