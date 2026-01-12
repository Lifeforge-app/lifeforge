# syntax=docker/dockerfile:1

# ============================================
# Builder stage - build client and tools
# ============================================
FROM oven/bun:alpine AS builder

# Accept build arg for API host
ARG VITE_API_HOST=/api
ENV VITE_API_HOST=$VITE_API_HOST

WORKDIR /app

# Copy source
COPY . .

# Install dependencies
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --linker isolated

# Build client
RUN cd /app/client && bun run build

# ============================================
# Production stage - Nginx static server
# ============================================
FROM nginx:alpine

# Install curl for health check
RUN apk add --no-cache curl

# Copy nginx config for SPA routing and API proxying
COPY docker/client/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built client from builder
COPY --from=builder /app/client/dist /usr/share/nginx/html

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
