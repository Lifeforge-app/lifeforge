# syntax=docker/dockerfile:1

# ============================================
# Builder stage - contains build dependencies
# ============================================
FROM oven/bun:alpine AS builder

RUN apk update && apk add git

WORKDIR /lifeforge

# Copy all files
COPY . .

# Install all dependencies for build
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --linker isolated

# Build types (gen-registry runs at runtime now via bun start)
RUN cd /lifeforge/server && bun run types

# ============================================
# Production stage - minimal runtime image
# ============================================
FROM oven/bun:alpine AS production

# Install curl for health check
RUN apk add --no-cache curl

WORKDIR /lifeforge

# Copy only necessary files from builder
# Note: apps/ and locales/ are mounted as volumes, not copied
COPY --from=builder /lifeforge/node_modules ./node_modules
COPY --from=builder /lifeforge/server ./server
COPY --from=builder /lifeforge/shared ./shared
COPY --from=builder /lifeforge/packages ./packages
COPY --from=builder /lifeforge/tools ./tools
COPY --from=builder /lifeforge/package.json ./package.json
COPY --from=builder /lifeforge/bun.lock ./bun.lock
COPY --from=builder /lifeforge/tsconfig.json ./tsconfig.json

# Copy entrypoint script
COPY docker/server/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3636

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3636/ || exit 1

ENTRYPOINT ["/entrypoint.sh"]
