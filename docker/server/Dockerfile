# syntax=docker/dockerfile:1

# ============================================
# Builder stage - build server bundle
# ============================================
FROM oven/bun:alpine AS builder

RUN apk update && apk add git

WORKDIR /lifeforge

# Copy source
COPY . .

# Install dependencies
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --linker isolated

# Build server bundle
RUN cd /lifeforge/server && bun run build

# Create cleaned package.json without workspace deps for production install
RUN bun -e "const pkg = require('./server/package.json'); \
    delete pkg.dependencies.shared; \
    delete pkg.devDependencies; \
    require('fs').writeFileSync('./server/package.docker.json', JSON.stringify(pkg, null, 2))"

# ============================================
# Production stage - minimal runtime
# ============================================
FROM oven/bun:alpine AS production

# Install curl for health check
RUN apk add --no-cache curl

WORKDIR /lifeforge

# Copy ONLY bundled server (no node_modules!)
COPY --from=builder /lifeforge/server/dist ./server/dist

# Copy server source for @functions imports (modules import from @functions/*)
COPY --from=builder /lifeforge/server/src ./server/src

# Copy shared package for module imports
COPY --from=builder /lifeforge/shared/dist ./shared/dist
COPY --from=builder /lifeforge/shared/package.json ./shared/package.json

# Install server dependencies for module loading (using cleaned package.json without workspace deps)
COPY --from=builder /lifeforge/server/package.docker.json ./package.json
RUN bun install --production

# Copy entrypoint
COPY docker/server/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3636

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3636/ || exit 1

ENTRYPOINT ["/entrypoint.sh"]
