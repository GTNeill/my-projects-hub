FROM oven/bun:1.4.2-slim

WORKDIR /app

# Install dependencies first so the layer caches across code-only deploys.
COPY package.json bun.lock ./
COPY packages/web/package.json ./packages/web/
COPY packages/mobile/package.json ./packages/mobile/
COPY packages/desktop/package.json ./packages/desktop/
RUN bun install --frozen-lockfile

COPY . .

# Vite needs the VITE_* values at build time, so they arrive as build args.
ARG VITE_REFERRAL_CODE=gtn
ARG VITE_SUPPORT_URL=https://ko-fi.com/georgeneill
ARG VITE_RUNABLE_AUTH_ISSUER
ARG VITE_APPLICATION_ID
ENV VITE_REFERRAL_CODE=$VITE_REFERRAL_CODE \
    VITE_SUPPORT_URL=$VITE_SUPPORT_URL \
    VITE_RUNABLE_AUTH_ISSUER=$VITE_RUNABLE_AUTH_ISSUER \
    VITE_APPLICATION_ID=$VITE_APPLICATION_ID

RUN cd packages/web && bunx vite build

ENV NODE_ENV=production \
    PORT=3000 \
    SHOTS_DIR=/data/shots

EXPOSE 3000

CMD ["bun", "packages/web/src/__server.ts"]
