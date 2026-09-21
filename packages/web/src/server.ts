import app from "./api";

/**
 * Production server, and the path the platform's release pipeline bundles as
 * the production entry point. It used to be a one-line re-export of the
 * template's `__server.ts`; it now carries the static caching rules instead.
 *
 * `__server.ts` serves the built frontend with no Cache-Control header at all,
 * and a browser given no Cache-Control falls back to heuristic freshness,
 * reusing its copy of index.html for hours. Because index.html names the
 * content-hashed bundles, a stale copy pins a returning visitor to the
 * JavaScript of an older deploy: a bug fixed and shipped keeps reproducing for
 * them until they hard-reload, which is not something you can ask of visitors.
 *
 * `__server.ts` is template-managed and must stay untouched, so the caching
 * rules live here. Behaviour is otherwise identical: /api/* goes to the Hono
 * app, real files come off disk, and everything else falls through to
 * index.html for the client-side router. The Dockerfile and pm2 both run this.
 */

const port = Number(process.env.PORT ?? 3000);
const distDir = `${import.meta.dirname}/../dist`;
const indexPath = `${distDir}/index.html`;

/**
 * Vite writes everything under /assets/ with a content hash in the filename, so
 * those URLs are safe to cache forever — a new build produces different URLs.
 * Everything else in dist/ keeps a stable name across deploys (favicon, social
 * image, manifest), so it has to be revalidated or replacing one never reaches
 * anyone who has already visited.
 */
function cacheControlFor(pathname: string): string {
  return pathname.startsWith("/assets/")
    ? "public, max-age=31536000, immutable"
    : "no-cache, must-revalidate";
}

function getStaticFilePath(pathname: string) {
  const cleanPath = decodeURIComponent(pathname).replace(/^\/+/, "").replaceAll("..", "");

  return cleanPath ? `${distDir}/${cleanPath}` : indexPath;
}

const server = Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api")) {
      return app.fetch(request);
    }

    const filePath = getStaticFilePath(url.pathname);
    const file = Bun.file(filePath);

    if (await file.exists()) {
      return new Response(file, {
        headers: { "Cache-Control": cacheControlFor(url.pathname) },
      });
    }

    const index = Bun.file(indexPath);
    if (await index.exists()) {
      return new Response(index, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          // Always revalidate: this is the document that decides which bundle
          // the browser loads.
          "Cache-Control": "no-cache, must-revalidate",
        },
      });
    }

    return new Response("Build output not found. Run `bun run build` first.", {
      status: 500,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  },
});

console.log(`Web server listening on http://localhost:${server.port}`);
