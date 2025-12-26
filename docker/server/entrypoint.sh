#!/bin/sh
set -e

echo "Waiting for PocketBase to be ready..."
until wget -q --spider http://db:8090/api/health 2>/dev/null; do
    echo "PocketBase not ready, waiting..."
    sleep 2
done
echo "PocketBase is ready!"

# Start the server
echo "Starting server..."
cd /app/server
exec bun run start
