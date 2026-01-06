# syntax=docker/dockerfile:1
FROM oven/bun:alpine AS builder

RUN apk update && apk add git

# Set working directory
WORKDIR /lifeforge

# Copy all files
COPY . .

# Install all dependencies for build
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --linker isolated

RUN bun forge modules gen-registry

RUN cd /lifeforge/server && bun run types

# Copy entrypoint script
COPY docker/server/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the server port
EXPOSE 3636

ENTRYPOINT ["/entrypoint.sh"]
