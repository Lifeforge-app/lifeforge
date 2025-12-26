# syntax=docker/dockerfile:1
FROM oven/bun:alpine AS builder

# Set working directory
WORKDIR /app

# Copy all files
COPY bun.lock bun.lock
COPY server server
COPY shared shared
COPY packages packages
COPY tools/forgeCLI tools/forgeCLI
COPY apps apps
COPY locales locales
COPY tsconfig.json tsconfig.json

# Create a Docker-specific package.json with only needed workspaces
RUN echo '{"workspaces": ["./shared", "./packages/*", "./apps/*", "./server", "./tools/forgeCLI"]}' > package.json

# Install all dependencies for build
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --linker isolated

# Production stage
FROM oven/bun:alpine

WORKDIR /app

# Copy only what's needed for runtime
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/server server
COPY --from=builder /app/shared shared
COPY --from=builder /app/packages packages
COPY --from=builder /app/apps apps
COPY --from=builder /app/locales locales
COPY --from=builder /app/tools/forgeCLI tools/forgeCLI
COPY --from=builder /app/tsconfig.json tsconfig.json
COPY --from=builder /app/package.json package.json

# Copy entrypoint script
COPY docker/server/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the server port
EXPOSE 3636

ENTRYPOINT ["/entrypoint.sh"]
