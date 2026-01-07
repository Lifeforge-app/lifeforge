#!/bin/sh
set -e

echo "=== LifeForge DB Init ==="
echo "Generating database migrations..."

# Ensure the migrations directory exists
mkdir -p /pb_data/pb_migrations

# Generate migrations
cd /app && bun run forge db push

echo "Migrations generated successfully!"
echo "=== DB Init Complete ==="
