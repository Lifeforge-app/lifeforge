# syntax=docker/dockerfile:1

# ============================================
# Get PocketBase binary from official image
# ============================================
FROM ghcr.io/muchobien/pocketbase:latest AS pocketbase

# ============================================
# Builder stage - build forge CLI
# ============================================
FROM oven/bun:alpine AS builder

WORKDIR /app

# Copy source
COPY . .

# Install dependencies
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --linker isolated

# Build forge CLI
RUN cd /app/tools && bun run build

# Collect only schema files to staging directory
RUN mkdir -p /schemas && \
    find /app/server/src/lib -name "schema.ts" -exec sh -c 'mkdir -p /schemas/$(dirname ${1#/app/}) && cp "$1" /schemas/$(dirname ${1#/app/})/' _ {} \;

# ============================================
# Production stage - minimal runtime
# ============================================
FROM oven/bun:alpine

# Copy PocketBase binary from official image
COPY --from=pocketbase /usr/local/bin/pocketbase /usr/local/bin/pocketbase

WORKDIR /app

# Copy ONLY bundled forge CLI (no node_modules!)
COPY --from=builder /app/tools/dist/forge.js ./forge.js

# Copy server schema files needed for migration generation
COPY --from=builder /schemas/server/src/lib ./server/src/lib

# Copy shared package (built) for schema imports
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/shared/package.json ./shared/package.json

# Install minimal dependencies for schema evaluation
RUN echo '{"dependencies":{"zod":"^4.0.0"}}' > package.json && bun install

# Set environment for Docker mode
ENV DOCKER_MODE=true
ENV PB_DIR=/pb_data
ENV PB_BINARY_PATH=/usr/local/bin/pocketbase

# Copy entrypoint
COPY docker/db-init/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
