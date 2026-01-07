# syntax=docker/dockerfile:1

# ============================================
# Client - Static file server (Nginx only)
# Build is handled by client-builder service
# ============================================
FROM nginx:alpine

# Install curl for health check
RUN apk add --no-cache curl

# Copy nginx config for SPA routing and API proxying
COPY docker/client/nginx.conf /etc/nginx/conf.d/default.conf

# Create directory for static files (will be mounted from volume)
RUN mkdir -p /usr/share/nginx/html

EXPOSE 80

# Health check - verify nginx is responding
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
