# syntax=docker/dockerfile:1

# ============================================
# PocketBase binary (pinned) for db-init
# ============================================
FROM alpine:3.20 AS pocketbase

ARG PB_VERSION=0.35.0
ARG TARGETARCH

RUN apk add --no-cache curl unzip \
    && case "$TARGETARCH" in \
         amd64) ARCH=amd64 ;; \
         arm64) ARCH=arm64 ;; \
         *) echo "Unsupported arch: $TARGETARCH" && exit 1 ;; \
       esac \
    && curl -fsSL \
       "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_${ARCH}.zip" \
       -o /tmp/pb.zip \
    && unzip /tmp/pb.zip -d /usr/local/bin \
    && rm /tmp/pb.zip \
    && chmod +x /usr/local/bin/pocketbase

# ============================================
# Builder – install all deps, build workspace packages
# ============================================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.21.0 --activate

WORKDIR /app

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

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

# Build workspace packages that forge CLI needs at runtime
RUN pnpm turbo build --filter=@lifeforge/configs && \
    pnpm turbo build --filter=@lifeforge/log --filter=@lifeforge/pocketbase --filter=@lifeforge/server-utils

# ============================================
# Runtime – Node with forge source, tsx, PocketBase binary
# ============================================
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@11.21.0 --activate

# PocketBase binary from pinned release
COPY --from=pocketbase /usr/local/bin/pocketbase /usr/local/bin/pocketbase

WORKDIR /app

# Copy forge CLI source
COPY --from=builder /app/tools/src ./tools/src
COPY --from=builder /app/tools/tsconfig.json ./tools/tsconfig.json

# Copy built workspace packages
COPY --from=builder /app/packages/configs/dist      ./packages/configs/dist
COPY --from=builder /app/packages/configs/package.json ./packages/configs/package.json
COPY --from=builder /app/packages/configs/tsconfig    ./packages/configs/tsconfig
COPY --from=builder /app/packages/log/dist          ./packages/log/dist
COPY --from=builder /app/packages/log/package.json  ./packages/log/package.json
COPY --from=builder /app/packages/pocketbase/dist   ./packages/pocketbase/dist
COPY --from=builder /app/packages/pocketbase/package.json ./packages/pocketbase/package.json
COPY --from=builder /app/packages/server-utils/dist ./packages/server-utils/dist
COPY --from=builder /app/packages/server-utils/package.json ./packages/server-utils/package.json

# Install forge CLI runtime dependencies fresh using npm (pnpm symlinks break across stages)
COPY docker/db-init/package-runtime.json ./package.json
RUN npm install --production 2>/dev/null || npm install

# Copy schema source files (imported dynamically by forge CLI)
COPY --from=builder /app/apps/api/src   ./apps/api/src
COPY --from=builder /app/modules/       ./modules/

# Create path for tsconfig extends resolution and workspace package symlinks
RUN mkdir -p node_modules/@lifeforge/configs/tsconfig && \
    cp packages/configs/tsconfig/base.json node_modules/@lifeforge/configs/tsconfig/base.json && \
    ln -sf /app/packages/log node_modules/@lifeforge/log && \
    ln -sf /app/packages/pocketbase node_modules/@lifeforge/pocketbase && \
    ln -sf /app/packages/server-utils node_modules/@lifeforge/server-utils && \
    ln -sf /app/packages/configs node_modules/@lifeforge/configs

ENV DOCKER_MODE=true
ENV PB_BINARY_PATH=/usr/local/bin/pocketbase
# PB_DIR is set in docker-compose.yaml to match the volume mount

COPY docker/db-init/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
