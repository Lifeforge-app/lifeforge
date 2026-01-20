#!/bin/bash
set -e

echo "=== LifeForge Docker Build ==="

# Build the deps image first (shared dependencies)
echo "Building deps image..."
docker compose --profile build build deps

# Build all other services
echo "Building all services..."
docker compose build

echo "=== Build Complete ==="
echo ""
echo "To start the application, run:"
echo "  docker compose up -d"
