import fs from 'fs';
import path from 'path';

const files = [
  {
    path: 'e:/Personal/100-Engineering/130-Project/PlayProject/lifeforge/docker/db/entrypoint.sh',
    content: `#!/bin/sh
set -e

# Validate required environment variables
validate_env() {
    local missing=""
    
    if [ -z "$PB_EMAIL" ]; then
        missing="$missing PB_EMAIL"
    fi
    
    if [ -z "$PB_PASSWORD" ]; then
        missing="$missing PB_PASSWORD"
    fi
    
    if [ -z "$MASTER_KEY" ]; then
        missing="$missing MASTER_KEY"
    fi
    
    if [ -n "$missing" ]; then
        echo "ERROR: Missing required environment variables:$missing"
        exit 1
    fi
    
    # Validate email format
    if ! echo "$PB_EMAIL" | grep -qE '^[^@]+@[^@]+\\.[^@]+$'; then
        echo "ERROR: PB_EMAIL is not a valid email address"
        exit 1
    fi
    
    # Validate password length (minimum 8 characters)
    if [ \${#PB_PASSWORD} -lt 8 ]; then
        echo "ERROR: PB_PASSWORD must be at least 8 characters"
        exit 1
    fi
    
    # Validate master key length (minimum 16 characters)
    if [ \${#MASTER_KEY} -lt 16 ]; then
        echo "ERROR: MASTER_KEY must be at least 16 characters"
        exit 1
    fi
    
    echo "Environment variables validated successfully"
}

# Run validation
validate_env

# Generate migration schemas
echo "Generating database migrations..."
cd /app && bun run forge db push

# Apply migrations
echo "Applying database migrations..."
/usr/local/bin/pocketbase migrate up --dir=/pb_data --migrationsDir=/pb_data/pb_migrations

# Create or update superuser
echo "Setting up superuser..."
/usr/local/bin/pocketbase superuser upsert "$PB_EMAIL" "$PB_PASSWORD" --dir=/pb_data
echo "Superuser configured successfully"

# Start PocketBase
exec /usr/local/bin/pocketbase serve --http=0.0.0.0:8090 --dir=/pb_data --migrationsDir=/pb_data/pb_migrations
`
  },
  {
    path: 'e:/Personal/100-Engineering/130-Project/PlayProject/lifeforge/docker/server/entrypoint.sh',
    content: `#!/bin/sh
set -e

echo "Waiting for PocketBase to be ready..."
until wget -q --spider http://db:8090/api/health 2>/dev/null; do
    echo "PocketBase not ready, waiting..."
    sleep 2
done
echo "PocketBase is ready!"

# Start the server
echo "Starting server..."
cd /lifeforge/server
exec bun run start
`
  }
];

files.forEach(f => {
  fs.writeFileSync(f.path, f.content.replace(/\r\n/g, '\n'), { encoding: 'utf8' });
  console.log('Fixed ' + f.path);
});
