# syntax=docker/dockerfile:1
FROM oven/bun:alpine AS builder

RUN apk update && apk add git

# Set working directory
WORKDIR /lifeforge

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

WORKDIR /lifeforge

# Copy only what's needed for runtime
COPY --from=builder /lifeforge/node_modules node_modules
COPY --from=builder /lifeforge/server server
COPY --from=builder /lifeforge/shared shared
COPY --from=builder /lifeforge/packages packages
COPY --from=builder /lifeforge/apps apps
COPY --from=builder /lifeforge/locales locales
COPY --from=builder /lifeforge/tools/forgeCLI tools/forgeCLI
COPY --from=builder /lifeforge/tsconfig.json tsconfig.json
COPY --from=builder /lifeforge/package.json package.json

# Copy entrypoint script
COPY docker/server/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the server port
EXPOSE 3636

ENTRYPOINT ["/entrypoint.sh"]
