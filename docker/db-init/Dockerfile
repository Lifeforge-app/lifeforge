# syntax=docker/dockerfile:1

# ============================================
# Get PocketBase binary from official image
# ============================================
FROM ghcr.io/muchobien/pocketbase:latest AS pocketbase

# ============================================
# DB Init Container - Generates and applies migrations
# ============================================
FROM oven/bun:alpine

# Copy PocketBase binary from official image
COPY --from=pocketbase /usr/local/bin/pocketbase /usr/local/bin/pocketbase

WORKDIR /app

# Copy source
COPY . .

# Install all dependencies
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --linker isolated

# Set environment for Docker mode
ENV DOCKER_MODE=true
ENV PB_DIR=/pb_data
ENV PB_BINARY_PATH=/usr/local/bin/pocketbase

# Copy entrypoint script
COPY docker/db-init/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
