#!/bin/sh
set -e

echo "Waiting for PocketBase to be ready..."
until wget -q --spider http://db:8090/api/health 2>/dev/null; do
    echo "PocketBase not ready, waiting..."
    sleep 2
done
echo "PocketBase is ready!"

# Create symlinks for server path aliases so modules can resolve @functions/*, @lib/*, etc.
mkdir -p /lifeforge/node_modules
ln -sf /lifeforge/server/src/core/functions /lifeforge/node_modules/@functions
ln -sf /lifeforge/server/src/lib /lifeforge/node_modules/@lib
ln -sf /lifeforge/server/src/core /lifeforge/node_modules/@core
ln -sf /lifeforge/server/src/core/constants.ts /lifeforge/node_modules/@constants
ln -sf /lifeforge/server/src/core/schema /lifeforge/node_modules/@schema
ln -sf /lifeforge/shared /lifeforge/node_modules/shared

# Install module-specific dependencies (skip workspace deps that fail)
echo "Installing module dependencies..."
for dir in /lifeforge/apps/*/; do
    if [ -f "${dir}package.json" ]; then
        modname=$(basename "$dir")
        # Only install if node_modules doesn't exist or is empty
        if [ ! -d "${dir}node_modules" ] || [ -z "$(ls -A ${dir}node_modules 2>/dev/null)" ]; then
            echo "Installing deps for $modname..."
            # Create temp package.json without workspace deps, install, then restore
            cd "$dir"
            if [ -f package.json ]; then
                # Remove workspace deps before install
                bun -e "
                    const fs = require('fs');
                    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
                    const original = JSON.stringify(pkg, null, 2);
                    fs.writeFileSync('package.json.bak', original);
                    if (pkg.dependencies) {
                        for (const [k,v] of Object.entries(pkg.dependencies)) {
                            if (v.startsWith('workspace:')) delete pkg.dependencies[k];
                        }
                    }
                    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
                " 2>/dev/null || true
                bun install --production 2>/dev/null || true
                # Restore original package.json
                if [ -f package.json.bak ]; then
                    mv package.json.bak package.json
                fi
            fi
        fi
    fi
done
echo "Module dependencies installed."

echo "Starting server..."
cd /lifeforge/server
exec bun dist/server.js
