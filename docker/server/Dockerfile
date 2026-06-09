# syntax=docker/dockerfile:1

# ============================================
# Builder stage - build core server bundle only
# ============================================
FROM oven/bun:alpine AS builder

RUN apk update && apk add git

WORKDIR /lifeforge

# Copy source
COPY . .

# Install dependencies
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --linker isolated

# Build shared package
RUN cd /lifeforge/shared && bun run build

# Build @lifeforge/log package
RUN cd /lifeforge/packages/log && bun run build

# Build lifeforge-server-utils package
RUN cd /lifeforge/packages/server-utils && bun run build

# Build server bundle
RUN cd /lifeforge/apps/api && bun run build

# Create cleaned package.json without workspace deps for production install
RUN bun -e "const pkg = require('./apps/api/package.json'); \
    delete pkg.dependencies.shared; \
    delete pkg.dependencies['@lifeforge/log']; \
    delete pkg.dependencies['@lifeforge/server-utils']; \
    delete pkg.devDependencies; \
    require('fs').writeFileSync('./apps/api/package.docker.json', JSON.stringify(pkg, null, 2))"

# ============================================
# Production stage - core server only (no modules)
# ============================================
FROM oven/bun:alpine AS production

# Install curl for health check
RUN apk add --no-cache curl

WORKDIR /lifeforge

# Copy bundled server
COPY --from=builder /lifeforge/apps/api/dist ./apps/api/dist

# Copy shared package
COPY --from=builder /lifeforge/shared/dist ./shared/dist
COPY --from=builder /lifeforge/shared/package.json ./shared/package.json

# Copy @lifeforge/log package
COPY --from=builder /lifeforge/packages/log/dist ./packages/log/dist
COPY --from=builder /lifeforge/packages/log/package.json ./packages/log/package.json

# Copy lifeforge-server-utils package (required by module bundles at runtime)
COPY --from=builder /lifeforge/packages/server-utils/dist ./packages/server-utils/dist
COPY --from=builder /lifeforge/packages/server-utils/package.json ./packages/server-utils/package.json

# Install server dependencies
COPY --from=builder /lifeforge/apps/api/package.docker.json ./package.json
RUN bun install --production

# Create apps directory for module mounting
RUN mkdir -p /lifeforge/modules

# Copy entrypoint
COPY docker/server/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh && \
    sed -i 's/\r$//' /entrypoint.sh

EXPOSE 3636

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3636/ || exit 1

# Modules should be mounted to /lifeforge/modules at runtime:
#   docker run -v /path/to/modules:/lifeforge/modules lifeforge-server
ENTRYPOINT ["/entrypoint.sh"]


