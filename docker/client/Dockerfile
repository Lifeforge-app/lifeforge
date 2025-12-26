FROM oven/bun:alpine AS builder

# Build args (Vite inlines env vars at build time)
ARG VITE_API_HOST

# Set working directory
WORKDIR /app

# Copy source code (including server for type checking)
COPY client client
COPY server server
COPY shared shared
COPY packages packages
COPY apps apps
COPY tsconfig.json tsconfig.json

# Create a minimal package.json with all needed workspaces
RUN echo '{"workspaces": ["./shared", "./packages/*", "./client", "./apps/*", "./server"]}' > package.json

# Install all dependencies from root (resolves workspace deps)
RUN bun install --ignore-scripts --linker isolated

# Build packages in order
RUN cd client && bun run build

# Production stage - serve static files
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/client/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY docker/client/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
