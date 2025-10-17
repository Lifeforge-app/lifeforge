#!/bin/bash

# Script to loop through all modules in apps directory and commit changes
# Usage: ./scripts/commit-all-modules.sh "Your commit message here"

set -e  # Exit on any error

# Check if commit message is provided
if [ $# -eq 0 ]; then
    echo "Error: Commit message is required"
    echo "Usage: $0 \"Your commit message here\""
    exit 1
fi

COMMIT_MESSAGE="$1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting git operations for all modules in apps directory...${NC}"
echo -e "${YELLOW}Commit message: \"$COMMIT_MESSAGE\"${NC}"

# Get the script directory and navigate to project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

# Counter for tracking progress
total_modules=0
successful_modules=0
failed_modules=()

# First, count total modules (excluding non-directories)
for module_dir in apps/*/; do
    if [ -d "$module_dir" ]; then
        ((total_modules++))
    fi
done

echo -e "${YELLOW}Found $total_modules modules to process${NC}"
echo ""

# Loop through each directory in apps/
for module_dir in apps/*/; do
    if [ -d "$module_dir" ]; then
        module_name=$(basename "$module_dir")
        
        # Skip .DS_Store and other hidden files/directories
        if [[ "$module_name" == .* ]]; then
            continue
        fi
        
        echo -e "${YELLOW}Processing module: $module_name${NC}"
        
        # Navigate to the module directory
        cd "$module_dir"
        
        # Check if there are any changes to commit
        if git diff --quiet && git diff --cached --quiet; then
            echo -e "  ${GREEN}✓${NC} No changes to commit in $module_name"
        else
            # Execute git commands
            if git add . && \
               git commit -m "$COMMIT_MESSAGE" && \
               git push origin main; then
                echo -e "  ${GREEN}✓${NC} Successfully committed and pushed changes for $module_name"
                ((successful_modules++))
            else
                echo -e "  ${RED}✗${NC} Failed to process $module_name"
                failed_modules+=("$module_name")
            fi
        fi
        
        # Navigate back to project root
        cd "$PROJECT_ROOT"
        echo ""
    fi
done

# Summary
echo -e "${YELLOW}=== Summary ===${NC}"
echo -e "Total modules processed: $total_modules"
echo -e "${GREEN}Successful: $successful_modules${NC}"

if [ ${#failed_modules[@]} -gt 0 ]; then
    echo -e "${RED}Failed: ${#failed_modules[@]}${NC}"
    echo -e "${RED}Failed modules:${NC}"
    for failed_module in "${failed_modules[@]}"; do
        echo -e "  - $failed_module"
    done
    exit 1
else
    echo -e "${GREEN}All modules processed successfully!${NC}"
fi