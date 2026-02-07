#!/bin/sh
set -e

echo "=== LifeForge DB Init ==="
echo "Generating database migrations..."

# Ensure the migrations directory exists
mkdir -p /pb_data/pb_migrations

# Generate and apply migrations using bundled forge CLI
cd /app && bun forge --log-level debug db push

echo "Migrations applied successfully!"
echo "=== DB Init Complete ==="
