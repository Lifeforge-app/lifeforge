# Refactor and Enhance Lifeforge UI Component Library

## Overview
Major refactoring of the Lifeforge UI component library to improve organization, developer experience, and documentation.

## Key Changes

### Component Restructuring
- Merged `buttons` and `inputs` folders into unified `controls` directory
- Reorganized component exports for cleaner import paths
- Updated all import paths across client, forgeCLI, and documentation

### Component Renames
- `MessageBox` → `Alert` (expanded with caution, tip, and important types)
- `ItemWrapper` → `Card`
- `HeaderFilter` → `TagsFilter`
- `ConfigColumn` → `OptionsColumn`

### Component Enhancements
- Refactored props structure for better consistency (Tabs, Pagination, ViewModeSelector, etc.)
- Added action button support to SidebarItemContent
- Improved color handling with migration to `culori` library
- Enhanced Tooltip with `iconClassName` prop
- Split MainSidebarItem from SubSidebarItem

### Storybook Documentation
Added comprehensive stories for:
- Screen components (EmptyState, Error, Loading, NotFound)
- Utilities (OptionsColumn, TagsFilter, ViewModeSelector, Pagination, Scrollbar)
- UI elements (TagChip, Tooltip, Tabs, Card)
- Sidebar components

### Technical Improvements
- Added JetBrains Mono and Onest fonts
- Updated daisyui to v5.5.5
- Added Prettier configuration with importOrder updates
- Improved TypeScript configurations
- Fixed dark mode color handling
- Added Storybook manager theme configuration

## Breaking Changes
Component renames require import path updates in consuming applications.

## Migration Required
Update imports in your codebase:
- `MessageBox` → `Alert`
- `ItemWrapper` → `Card`
- `HeaderFilter` → `TagsFilter`
- `ConfigColumn` → `OptionsColumn`
- Import paths: `buttons/*` and `inputs/*` → `controls/*`
