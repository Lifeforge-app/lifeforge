# syntax=docker/dockerfile:1

# ============================================
# Builder – install deps, build workspace packages, bundle API
# ============================================
FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@11.21.0 --activate

WORKDIR /lifeforge

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
COPY locales/lang-en/package.json                   locales/lang-en/package.json

# Install deps only (skip postinstall build – source not copied yet)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Copy source
COPY . .

# Build the API and module bundles used by the production image
RUN pnpm turbo build --filter=@lifeforge/server... && \
    pnpm --filter './modules/*' run build

# ── Collect production node_modules for the API ──────────────────────
# Create a clean package.json with only production dependencies,
# including transitive deps from bundled workspace packages
RUN node -e "const fs=require('fs'),pkg=JSON.parse(fs.readFileSync('./apps/api/package.json','utf8')),ws=new Set(['@lifeforge/configs','@lifeforge/log','@lifeforge/pocketbase','@lifeforge/server-utils']);for(const d of Object.keys(pkg.dependencies||{}))if(ws.has(d))delete pkg.dependencies[d];delete pkg.devDependencies;for(const w of['./packages/pocketbase/package.json','./packages/log/package.json','./packages/server-utils/package.json']){try{const wp=JSON.parse(fs.readFileSync(w,'utf8'));for(const[k,v]of Object.entries(wp.dependencies||{})){if(!ws.has(k))pkg.dependencies[k]=v}}catch{}}pkg.dependencies.zod='^4.0.0';pkg.dependencies.lodash='^4.17.21';pkg.dependencies.dayjs='^1.11.19';fs.writeFileSync('./apps/api/package.docker.json',JSON.stringify(pkg,null,2));"

# ============================================
# Production stage – runtime only
# ============================================
FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@11.21.0 --activate
RUN apk add --no-cache curl

WORKDIR /lifeforge

# Copy built API bundle
COPY --from=builder /lifeforge/apps/api/dist           ./apps/api/dist
COPY --from=builder /lifeforge/apps/api/package.docker.json ./apps/api/package.json
# Root package.json needed by pnpm install --prod
COPY --from=builder /lifeforge/apps/api/package.docker.json ./package.json

# Copy built workspace packages (needed at runtime for module resolution)
COPY --from=builder /lifeforge/packages/configs/dist    ./packages/configs/dist
COPY --from=builder /lifeforge/packages/configs/package.json ./packages/configs/package.json
COPY --from=builder /lifeforge/packages/log/dist        ./packages/log/dist
COPY --from=builder /lifeforge/packages/log/package.json ./packages/log/package.json
COPY --from=builder /lifeforge/packages/pocketbase/dist ./packages/pocketbase/dist
COPY --from=builder /lifeforge/packages/pocketbase/package.json ./packages/pocketbase/package.json
COPY --from=builder /lifeforge/packages/server-utils/dist ./packages/server-utils/dist
COPY --from=builder /lifeforge/packages/server-utils/package.json ./packages/server-utils/package.json

# Copy .npmrc and pnpm-workspace.yaml (needed by pnpm for linker config and allowBuilds)
COPY .npmrc pnpm-workspace.yaml ./

# Install production dependencies only
RUN pnpm install --prod

# Copy bundled module server routes and metadata
COPY --from=builder /lifeforge/modules ./modules

COPY docker/server/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3636

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:3636/ || exit 1

ENTRYPOINT ["/entrypoint.sh"]
