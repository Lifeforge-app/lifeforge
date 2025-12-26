# syntax=docker/dockerfile:1
FROM oven/bun:alpine AS bun

FROM ghcr.io/muchobien/pocketbase:latest

# Install dependencies required for bun
RUN apk add --no-cache libstdc++ libgcc

# Copy bun binary from bun image
COPY --from=bun /usr/local/bin/bun /usr/local/bin/bun
COPY --from=bun /usr/local/bin/bunx /usr/local/bin/bunx

# Add bun to PATH
ENV PATH="/usr/local/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy source
COPY bun.lock bun.lock
COPY server server
COPY shared shared
COPY packages packages
COPY apps apps
COPY tools/forgeCLI tools/forgeCLI
COPY tsconfig.json /app/tsconfig.json

# Create a Docker-specific package.json with only needed workspaces
RUN echo '{"workspaces": ["./shared", "./packages/*", "./apps/*", "./server", "./tools/forgeCLI"], "scripts": {"forge": "bun run tools/forgeCLI/src/index.ts"}}' > package.json

# Install all dependencies with cache mount for faster rebuilds
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --linker isolated

# Copy entrypoint script
COPY docker/db/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
