# syntax=docker/dockerfile:1
FROM oven/bun:alpine AS builder

# Build args (Vite inlines env vars at build time)
ARG VITE_API_HOST

# Set working directory
WORKDIR /app

# Copy all source code
COPY . .

# Install all dependencies with cache mount for faster rebuilds
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --ignore-scripts --linker isolated

# Generate module registry
RUN bun forge modules gen-registry
RUN cd client && bun run build

# Production stage - serve static files
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY docker/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
