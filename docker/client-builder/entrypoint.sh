#!/bin/sh
set -e

echo "=== LifeForge Client Builder ==="

# Generate module registry
echo "Generating module registry..."
cd /app && bun forge modules gen-registry

# Build client
echo "Building client..."
cd /app/client && bun run build

# Copy to output volume
echo "Copying build to output..."
cp -r /app/client/dist/* /output/

echo "=== Client Build Complete ==="
