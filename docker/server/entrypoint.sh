#!/bin/sh
set -e

echo "Waiting for PocketBase to be ready..."
until wget -q --spider http://db:8090/api/health 2>/dev/null; do
    echo "PocketBase not ready, waiting..."
    sleep 2
done
echo "PocketBase is ready!"

# Create symlinks for externalized dependencies
mkdir -p /lifeforge/node_modules/@lifeforge

# Symlink shared package
ln -sf /lifeforge/shared /lifeforge/node_modules/shared

# Symlink @lifeforge/log (required by server-utils)
ln -sf /lifeforge/packages/lifeforge-log /lifeforge/node_modules/@lifeforge/log

# Symlink @lifeforge/server-utils (required by module bundles)
ln -sf /lifeforge/packages/lifeforge-server-utils /lifeforge/node_modules/@lifeforge/server-utils

# Check if modules are mounted
if [ -d "/lifeforge/apps" ] && [ "$(ls -A /lifeforge/apps 2>/dev/null)" ]; then
    module_count=$(ls -d /lifeforge/apps/*/ 2>/dev/null | wc -l | tr -d ' ')
    echo "Found $module_count module(s) mounted at /lifeforge/apps"
else
    echo "No modules mounted. Mount modules to /lifeforge/apps to enable them."
fi

echo "Starting server..."
cd /lifeforge/server
exec bun dist/server.js
