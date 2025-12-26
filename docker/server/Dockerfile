FROM oven/bun:alpine

# Set working directory
WORKDIR /app

# Copy source code
COPY apps apps
COPY server server
COPY locales locales
COPY tools/forgeCLI tools/forgeCLI
COPY tsconfig.json tsconfig.json
COPY package.json package.json

# Install dependencies
RUN cd server && bun install --frozen-lockfile
RUN cd tools/forgeCLI && bun install --frozen-lockfile

# Copy entrypoint script
COPY docker/server/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Expose the server port
EXPOSE 3636

ENTRYPOINT ["/entrypoint.sh"]
