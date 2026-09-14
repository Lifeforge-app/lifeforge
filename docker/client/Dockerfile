# syntax=docker/dockerfile:1

# ============================================
# Builder – install deps, build workspace packages, bundle web app
# ============================================
FROM node:22-alpine AS builder

ARG VITE_API_HOST=/api
ENV VITE_API_HOST=$VITE_API_HOST

RUN corepack enable && corepack prepare pnpm@11.21.0 --activate

WORKDIR /app

# Copy only files needed for dependency resolution first (layer cache)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc .pnpmfile.cjs ./
COPY apps/api/package.json              apps/api/package.json
COPY apps/web/package.json              apps/web/package.json
COPY packages/configs/package.json      packages/configs/package.json
COPY packages/log/package.json          packages/log/package.json
COPY packages/pocketbase/package.json   packages/pocketbase/package.json
COPY packages/server-utils/package.json packages/server-utils/package.json
COPY packages/api/package.json          packages/api/package.json
COPY packages/federation/package.json   packages/federation/package.json
COPY packages/localization/package.json packages/localization/package.json
COPY packages/ui/package.json           packages/ui/package.json
COPY tools/package.json                 tools/package.json
COPY docs/package.json                  docs/package.json
COPY modules/package.json               modules/package.json
COPY modules/lifeforge--notes/package.json           modules/lifeforge--notes/package.json
COPY modules/lifeforge--squad-backlog/package.json modules/lifeforge--squad-backlog/package.json
COPY modules/lifeforge--todo-list/package.json      modules/lifeforge--todo-list/package.json
COPY modules/lifeforge--books-library/package.json  modules/lifeforge--books-library/package.json
COPY modules/lifeforge--code-time/package.json      modules/lifeforge--code-time/package.json
COPY modules/lifeforge--moment-vault/package.json   modules/lifeforge--moment-vault/package.json
COPY modules/lifeforge--movies/package.json         modules/lifeforge--movies/package.json
COPY modules/lifeforge--music/package.json          modules/lifeforge--music/package.json
COPY modules/lifeforge--youtube-summarizer/package.json modules/lifeforge--youtube-summarizer/package.json
COPY modules/lifeforge--unified-kanban/package.json modules/lifeforge--unified-kanban/package.json
COPY modules/lifeforge--api-endpoint-explorer/package.json modules/lifeforge--api-endpoint-explorer/package.json
COPY modules/lifeforge--calendar/package.json       modules/lifeforge--calendar/package.json
COPY modules/lifeforge--passwords/package.json      modules/lifeforge--passwords/package.json
COPY modules/lifeforge--pomodoro-timer/package.json modules/lifeforge--pomodoro-timer/package.json
COPY modules/lifeforge--wallet/package.json         modules/lifeforge--wallet/package.json
COPY locales/lang-en/package.json                   locales/lang-en/package.json

# Install deps only (skip postinstall build – source not copied yet)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source
COPY . .

# Turbo-filtered build: only @lifeforge/client and its transitive workspace deps
RUN pnpm turbo build --filter=@lifeforge/client...

# ============================================
# Production stage – nginx serving built SPA
# ============================================
FROM nginx:1.27-alpine

RUN apk add --no-cache curl

COPY docker/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
