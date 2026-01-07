# syntax=docker/dockerfile:1

# ============================================
# Client Builder - On-demand client rebuilds
# Uses pre-built deps from lifeforge-deps image
# ============================================
FROM lifeforge-deps:latest

# Set environment
ENV DOCKER_MODE=true

# Copy entrypoint script
COPY docker/client-builder/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
