# syntax=docker/dockerfile:1

# ============================================
# Client Builder - On-demand client rebuilds
# ============================================
FROM oven/bun:alpine

WORKDIR /app

# Copy source
COPY . .

# Install all dependencies
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --ignore-scripts --linker isolated

# Set environment
ENV DOCKER_MODE=true

# Copy entrypoint script
COPY docker/client-builder/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
