# my-projects-hub - hardened production image (web-only, minimal CVE surface).
#
# The build stage installs the full workspace to compile the client bundle; the runtime
# stage installs ONLY packages/web production dependencies, so mobile (expo/react-native),
# desktop (electron/app-builder-bin) and build tooling (vite/esbuild/tsx/sharp/turbo/
# oxlint/drizzle-kit) never ship. See GRO-LOT-SECURITY-NOTES.md for the rationale.

########################  builder  ########################
FROM oven/bun:1.4.2-slim AS builder
ENV ELECTRON_SKIP_BINARY_DOWNLOAD=1
WORKDIR /app

COPY package.json bun.lock ./
COPY packages/web/package.json packages/web/package.json
COPY packages/mobile/package.json packages/mobile/package.json
COPY packages/desktop/package.json packages/desktop/package.json
RUN bun install --frozen-lockfile

COPY . .

# Vite inlines VITE_* at build time. ARG defaults mirror the values the app was
# already building with; Railway can override by passing same-named build args.
ARG VITE_REFERRAL_CODE=gtn
ARG VITE_SUPPORT_URL=https://ko-fi.com/georgeneill
ENV VITE_REFERRAL_CODE=$VITE_REFERRAL_CODE VITE_SUPPORT_URL=$VITE_SUPPORT_URL

RUN cd packages/web && bunx vite build

########################  runtime  ########################
FROM oven/bun:1.4.2-slim AS runtime
ENV NODE_ENV=production
WORKDIR /app

RUN apt-get update \
 && apt-get upgrade -y \
 && apt-get install -y --no-install-recommends ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Web-only production deps: the web manifest is the image root, peer deps are omitted
# (better-auth -> drizzle-kit -> tsx -> esbuild, none of which the server imports), and
# bun's download cache is removed so no build tooling is baked in.
COPY packages/web/package.json ./package.json
RUN bun install --production --omit=peer \
 && rm -rf /root/.bun/install/cache

# Screenshots live on a mounted volume; make the (otherwise non-root) server's
# output dir writable.
ENV SHOTS_DIR=/data/shots
RUN mkdir -p /data/shots && chown -R bun:bun /data

COPY --from=builder /app/packages/web/src ./packages/web/src
COPY --from=builder /app/packages/web/dist ./packages/web/dist

USER bun
EXPOSE 3000
CMD ["bun", "packages/web/src/server.ts"]
