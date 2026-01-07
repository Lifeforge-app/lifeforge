# syntax=docker/dockerfile:1

# ============================================
# Get PocketBase binary from official image
# ============================================
FROM ghcr.io/muchobien/pocketbase:latest AS pocketbase

# ============================================
# DB Init Container - Generates and applies migrations
# Uses pre-built deps from lifeforge-deps image
# ============================================
FROM lifeforge-deps:latest

# Copy PocketBase binary from official image
COPY --from=pocketbase /usr/local/bin/pocketbase /usr/local/bin/pocketbase

# Set environment for Docker mode
ENV DOCKER_MODE=true
ENV PB_DIR=/pb_data
ENV PB_BINARY_PATH=/usr/local/bin/pocketbase

# Copy entrypoint script
COPY docker/db-init/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
