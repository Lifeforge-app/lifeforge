#!/bin/bash

# Publish all modules in the modules/ directory
# Usage: bash scripts/publish-all-modules.sh [--official]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
MODULES_DIR="$ROOT_DIR/modules"

OFFICIAL_FLAG=""
if [[ "$1" == "--official" ]]; then
  OFFICIAL_FLAG="--official"
fi

echo "📦 Publishing all modules from modules/..."
echo ""

cd "$ROOT_DIR"

for module_dir in "$MODULES_DIR"/*/; do
  module_name=$(basename "$module_dir")
  
  # Skip hidden directories and non-module directories
  if [[ "$module_name" == .* ]] || [[ ! -f "$module_dir/package.json" ]]; then
    continue
  fi
  
  echo "🚀 Publishing: $module_name"
  pnpm forge modules publish "$module_name" $OFFICIAL_FLAG
  
  if [[ $? -eq 0 ]]; then
    echo "✅ $module_name published successfully"
  else
    echo "❌ Failed to publish $module_name"
  fi
  echo ""
done

echo "🎉 All modules processed!"
