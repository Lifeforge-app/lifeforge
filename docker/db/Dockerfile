# syntax=docker/dockerfile:1

# ============================================
# PocketBase - Minimal database image
# ============================================
FROM ghcr.io/muchobien/pocketbase:latest

# Copy entrypoint script
COPY docker/db/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
