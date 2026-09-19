import { writeShot } from "./shot-store";

/** Normalize whatever the user typed into an absolute https URL. */
export function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Empty URL");
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return new URL(withScheme).toString();
}

export function hostOf(raw: string): string {
  try {
    return new URL(normalizeUrl(raw)).host.replace(/^www\./, "");
  } catch {
    return raw;
  }
}

/** Screenshot providers, tried in order. All are keyless public endpoints. */
function providers(target: string): string[] {
  const encoded = encodeURIComponent(target);
  return [
    `https://api.microlink.io/?url=${encoded}&screenshot=true&meta=false&embed=screenshot.url&viewport.width=1280&viewport.height=800&waitUntil=networkidle2`,
    `https://image.thum.io/get/width/1280/crop/800/noanimate/${target}`,
  ];
}

async function fetchShot(url: string): Promise<{ bytes: Uint8Array; contentType: string } | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(50_000),
      headers: { "user-agent": "Mozilla/5.0 (compatible; ProjectsHubBot/1.0)" },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.startsWith("image/")) return null;
    const bytes = new Uint8Array(await res.arrayBuffer());
    // Anything under ~4KB is almost certainly an error placeholder.
    if (bytes.byteLength < 4096) return null;
    return { bytes, contentType };
  } catch {
    return null;
  }
}

/**
 * Capture `targetUrl`, store the image on the instance filesystem and return
 * its key. Throws when every provider fails.
 */
export async function captureScreenshot(projectId: number, targetUrl: string): Promise<string> {
  const target = normalizeUrl(targetUrl);
  for (const provider of providers(target)) {
    const shot = await fetchShot(provider);
    if (!shot) continue;
    const ext = shot.contentType.includes("jpeg") ? "jpg" : "png";
    const key = `${projectId}-auto-${Date.now()}.${ext}`;
    await writeShot(key, shot.bytes);
    return key;
  }
  throw new Error("Every screenshot provider failed for " + target);
}
