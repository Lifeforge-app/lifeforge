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

# Copy all server, apps and tools/forgeCLI
COPY apps apps
COPY server server
COPY tools/forgeCLI tools/forgeCLI
COPY tsconfig.json /app/tsconfig.json
COPY package.json /app/package.json

# Install dependencies
RUN cd server && bun install --linker isolated
RUN cd tools/forgeCLI && bun install --linker isolated

# Copy entrypoint script
COPY docker/db/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
