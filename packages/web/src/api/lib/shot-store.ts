import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

/**
 * Screenshots live on the service instance's own filesystem rather than in
 * object storage — they are small and there are only a handful of them.
 *
 * On Railway the container filesystem is wiped on every deploy, so SHOTS_DIR
 * must point inside an attached volume (mount path /data) in production.
 * Locally it defaults to ./.data/shots at the app root.
 */
export const shotsDir = resolve(process.env.SHOTS_DIR ?? ".data/shots");

/** File extensions we are willing to write and serve. */
const EXT_CONTENT_TYPE: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
};

export function contentTypeFor(key: string): string {
  const ext = key.split(".").pop()?.toLowerCase() ?? "png";
  return EXT_CONTENT_TYPE[ext] ?? "application/octet-stream";
}

export function extFor(contentType: string): string | null {
  const match = Object.entries(EXT_CONTENT_TYPE).find(([, type]) => type === contentType);
  return match ? (match[0] === "jpeg" ? "jpg" : match[0]) : null;
}

/**
 * Resolve a stored key to an absolute path, refusing anything that tries to
 * escape the shots directory.
 */
function pathFor(key: string): string {
  const full = resolve(join(shotsDir, key));
  if (full !== shotsDir && !full.startsWith(shotsDir + "/")) {
    throw new Error("Refusing to touch a path outside the shots directory");
  }
  return full;
}

export async function writeShot(key: string, bytes: Uint8Array): Promise<void> {
  const full = pathFor(key);
  await mkdir(dirname(full), { recursive: true });
  await writeFile(full, bytes);
}

export async function readShot(key: string): Promise<Uint8Array | null> {
  try {
    return new Uint8Array(await readFile(pathFor(key)));
  } catch {
    return null;
  }
}

export async function deleteShot(key: string): Promise<void> {
  try {
    await unlink(pathFor(key));
  } catch {
    /* already gone */
  }
}
