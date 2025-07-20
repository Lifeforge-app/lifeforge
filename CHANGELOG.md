# Change Log

## 📌 **dev 25w30 (7/21/2025 - 7/28/2025)**

### 🎨 **UI & Components**

- **Enhancements**:
  - `LocationInput` will now display a loading state when fetching the API key availability

## 📌 **dev 25w29 (7/14/2025 - 7/20/2025)**

### 🎸 **Guitar Tabs**

- Migrated file uploading mechanism to use the task pool system for better performance
- Enhanced web scraping logic with improved edge case handling
- Added missing internationalization support

### 💡 **Idea Box**

- Fixed frontend synchronization issue where idea entries weren't properly updated after user actions

### 📚 **Books Library**

- Resolved book update functionality due to frontend and backend schema mismatches

### 📅 **Calendar**

- Added automatic location data retrieval from Google Places API when parsing event details from images

### 💰 **Wallet**

- Introduced new "Spending Heatmap" subpage for visualizing transaction patterns

### 🌐 **Localization Manager**

- Fixed malformed entry creation in the root layer

### 🎨 **UI & Components**

- **Migration**: Fully migrated to the new `lifeforge-ui` package under monorepo structure
  - Deprecated legacy codebase on GitHub
  - Removed `@lifeforge/ui` package from npm registry
- **Enhancement & Fixes**:
  - Corrected toast progress bar color application
  - Improved the callback logic for `DeleteConfirmationModal`
- **Type Safety**: Enhanced `FormModal` component with automatic field type determination based on field value types
- **New Components**:
  - Added `NumberInput` component
  - Added `FormNumberInput` component for form number input fields

### 🏗️ **Code Architecture**

- **Monorepo Migration**: Complete transition to monorepo structure using `bun` as package manager
- **Type Sharing**: Generated TypeScript interfaces now reside in `shared` package for frontend/backend consistency
- **Shared Resources**:
  - CSS styles centralized in `lifeforge-ui` package
  - Common providers (`PersonalizationProvider`, `APIOnlineStatusProvider`) moved to `shared/lib`
- **Code Quality**:
  - Major refactoring to improve modularity and maintainability
  - Cleaned up unused imports, variables, and legacy functions
  - Centralized ESLint and Prettier configurations at monorepo root
  - Enhanced ESLint rules for better code quality

### 🔧 **API**

- **Migration**: Moved API codebase to monorepo structure and deprecated legacy repository
- **Documentation**: Added comprehensive JSDoc documentation for `forgeController`
- **Type Safety**: Enhanced `existenceCheck` function with schema-based parameter validation
- **Architecture**: Implemented middleware state class requiring `route()` → `schema()` → methods chain order

## 📌 **dev 25w28 (7/7/2025 - 7/14/2025)**

### 🔧 **API**

- **File Organization**: Migrated all `<module>_interface.ts` files to `schema.ts` for better structure
- **Schema Generation**: Automated schema generation from database instead of hardcoded definitions
- **Package Scripts**: Added `schema:generate` command to `package.json`
- **Bug Fixes**: Resolved numerous hidden TypeScript issues throughout the codebase

## 📌 **dev 25w27 (6/30/2025 - 7/7/2025)**

### 📚 **Books Library**

- **Error Handling**: Fixed API logic where book addition failures weren't properly handled
- **Terminology**: Renamed `category` to `collection` for better clarity
- **UI Synchronization**: Resolved sidebar content updates when items are deleted
- **Task Pool Integration**: Migrated download process to task pool mechanism
- **Libgen Support**: Added support for downloading from multiple Libgen mirrors
- **Reading Status**: Users can now mark books as read or unread

### 🎸 **Guitar Tabs**

- **Task Pool Integration**: Migrated download process to task pool mechanism

### 💰 **Wallet**

- **Transaction Details**: Added detailed transaction view accessible by clicking entries
- **Location Features**:
  - Transaction coordinates now recorded and displayed in a heatmap
  - Location display in recent transaction dashboard widget
- **UI Improvements**:
  - Moved create transaction button to `ModuleHeader` for consistency
  - Replaced receipt thumbnails with modal-opening buttons

### 💾 **Backups**

- **New Module**: Complete backup management system within the application
- **Independence**: No longer requires PocketBase admin UI for backup operations

### 🔧 **API**

- **Task Pool**: Implemented SocketIO-based task pool for long-running operations (e.g., Libgen downloads)

### 🎨 **UI & Components**

- **Preloader**: Added inline styling for Tailwind-independent loading states
- **Modal System**: Complete `ModalStore` overhaul with direct component passing and enhanced type safety
- **Input Focus**: Fixed ComboBox input focus behavior
- **Google Places**: Migrated `locationInput` to new Google Places API
- **Code Cleanup**: Removed `useComponentsBg` hook, moved functionality to CSS files

## 📌 **dev 25w26 (6/23/2025 - 6/30/2025)**

### 🎬 **Movies**

- **Organization**: Added tab selector to separate watched and unwatched movies
- **Data Sync**: Fixed query data updates when adding movies to library
- **Sorting**: Enhanced movie sorting algorithms

### 💰 **Wallet**

- **Visualization**: Added assets balance chart modal for timeline analysis

### 🔧 **API**

- **Architecture**: Major refactoring to implement chained controller architecture

## 📌 **dev 25w25 (6/16/2025 - 6/23/2025)**

### 📅 **Calendar**

- **UI Enhancement**: Added missing calendar sidebar divider

### 🎬 **Movies**

- **Bug Fix**: Resolved date picker crashes in ticket entry modification

### 🎨 **UI & Components**

- **File Input**: Added file icons to input components and modals
- **Color Palette**: Fixed scrolling issues in TailwindCSS color palette
- **Improvements**: Minor enhancements to file input components

## 📌 **dev 25w24 (6/9/2025 - 6/16/2025)**

### 🛍️ **Wishlist**

- **Search**: Added search bar functionality

### 🎨 **Personalization**

- **Dynamic Favicon**: Favicon now generates based on theme color
- **Performance**: Added `derivedTheme` attribute to prevent recalculation overhead

### 🔐 **Authentication**

- **2FA Fix**: Resolved resend OTP button issue on page refresh

### 🏗️ **Code Architecture**

- **Route Control**: Added `forceDisable` attribute to `Route` interface
- **Stylesheet Organization**: Created centralized `style/index.css`
- **Performance**: Reduced `useDebounce` timeout from 500ms to 300ms

### 🎨 **UI & Components**

- **FormModal**: Fixed default API logic firing with custom `onSubmit`

### 🌐 **Localization**

- **Sync**: Theme and language config synchronized with main system
- **UI Migration**: Updated modals to use new `lifeforge-ui` package
- **Loading**: Removed authentication loading screen

### 🔍 **API Explorer**

- **Complete Rewrite**: New separate app with SSO access
- **Sync**: Theme and language synchronized with main system

## 📌 **dev 25w23 (6/2/2025 - 6/9/2025)**

### 📅 **Calendar**

- **Event Organization**: Added calendar grouping (Work, Personal, etc.) in sidebar
- **Mobile Support**: Introduced sidebar functionality for mobile view
- **Visual Polish**: Made calendar borders more subtle
- **UI Improvements**: Various minor enhancements

### 💡 **Idea Box**

- **Performance**: Container entry counts now calculated dynamically using PocketBase views

### ⏱️ **Codetime**

- **VS Code Integration**: Fixed time display issues in VS Code status bar

### 🎸 **Guitar Tabs**

- **UI Cleanup**: Removed non-functional "Download All" button post-S3 migration

### 🎵 **Music**

- **Feature Removal**: Temporarily removed NAS import feature (replacement planned)

### 🎬 **Movies**

- **UI Fix**: Corrected movie ticket modal layout

### ✅ **Todo List**

- **Feature Removal**: Removed subtask feature (better implementation planned)

### 📊 **Server Status**

- **Module Deprecation**: Removed due to system-specific nature (replacement planned)

### 🎨 **Personalization**

- **Font Support**: Fixed font family application for names containing numbers

### 🔧 **API**

- **Validation**: Major refactoring introducing Zod validation library
- **Middleware**: Replaced inconsistent middlewares with Zod validation
- **Endpoints**:
  - Removed `/quotes` endpoint
  - Added `/cors-anywhere` for cross-origin requests

### 📊 **Dashboard**

- **Quote Widget**: Now uses `/cors-anywhere` endpoint for external quote fetching

### 🏗️ **Code Quality**

- **Bug Fixes**: Various minor fixes throughout the codebase

## 📌 **dev 25w22 (5/26/2025 - 6/2/2025)**

### 💰 **Wallet**

- **Calculations**: Fixed percentage calculation rounding issues in statements
- **Performance**: Utilized PocketBase views with SQL aggregation for asset balance derivation

## 📌 **dev 25w21 (5/19/2025 - 5/26/2025)**

### ⚙️ **Account Settings**

- **Naming**: Renamed folder from `Account` to `Account Settings` for clarity
- **UI Fix**: Resolved input box overflow in modification modal

### ✅ **Todo List**

- **Dashboard**: Fixed task tag display issues in dashboard widget

### 💡 **Idea Box**

- **UI Polish**:
  - Fixed sidebar blur when create idea FAB is clicked
  - Added entry type display with improved hamburger menu positioning
  - Fixed idea type selection menu width in mobile view
  - Enhanced overall UI consistency
- **Markdown Support**: Text entries now render markdown properly

### 💰 **Wallet**

- **UI Refinement**: Reduced border radius for mini calendar date items

### 📅 **Calendar**

- **Navigation**:
  - Moved display mode selector for better responsiveness
  - Added quick "current date" navigation button
- **Design**: Various visual improvements

### ⏱️ **Codetime**

- **Dashboard**: Removed chart type selector (bar chart is superior to line chart)

### 🏗️ **Code Architecture**

- **Dynamic Routing**:
  - Module route configs now stored in separate files per module
  - Implemented dynamic route loading mechanism
  - Renamed `layout` folder to `routes` for clarity
- **Documentation**: Updated `README.md` with latest screenshots and information

### 🎨 **UI & Components**

- **Loading States**: Added descriptive loading messages
- **Preloader**: Restored preloader for module preparation
- **Date Input**: Migrated to `react-datepicker` from `react-date-picker`
- **Stylesheet Organization**: Split main `index.css` into multiple files
- **ESLint**: Added props sorting to `lifeforge-ui` package
- **Color Input**: Fixed color picker passthrough bug
- **Design**: Various minor UI improvements

## 📌 **dev 25w20 (5/12/2025 - 5/19/2025)**

### 💰 **Wallet**

- **Transaction Management**:
  - Fixed transaction order updates when dates are modified
  - Resolved critical dashboard loading crash

### ✅ **Todo List**

- **Task Creation**: Fixed failure when priority is not selected
- **UI Improvements**:
  - Fixed modification drawer not closing after task deletion
  - Renamed `ModifyTaskWindow` to `ModifyTaskDrawer` for clarity

### 💡 **Idea Box**

- **Data Sync**: Fixed tag count updates when navigating between folders

### 📅 **Calendar**

- **Dashboard Integration**: Added event detail viewing in dashboard widget
- **UI Fixes**:
  - Resolved z-index issues with event tooltips covering sidebar
  - Fixed event item updates when details are changed

### 🏗️ **Code Architecture**

- **Navigation**: Replaced `window.location.href` with `useNavigate` to prevent page reloads

### 🎨 **UI & Components**

- **Input Focus**: Fixed search field focus triggering on side action button clicks
- **Code Cleanup**: Removed suspicious debug statements

## 📌 **dev 25w19 (5/5/2025 - 5/12/2025)**

### 🏗️ **Code Architecture**

- **Portal System**: Created universal portal component for modals and pop-ups outside main app tree
- **Migration**: Migrated all modals to new universal portal system

### 🔧 **API**

- **Bug Fixes**: Resolved various critical issues

### 🎨 **UI & Components**

- **Performance**:
  - Fixed critical `useCallback` related bugs
  - Massive `FormModal` optimization by eliminating unnecessary re-renders
- **Button Components**: Enhanced styling for different button states
- **Modal Management**: Moved global modal manager to `lifeforge-ui`
- **Text Selection**: Text now highlights in theme color when selected

### 👤 **Account**

- **Avatar Management**: Fixed remove button visibility when no avatar exists

### ✅ **Todo List**

- **Visual Feedback**: Completed tasks now struck through in mini calendar

## 📌 **dev 25w18 (4/28/2025 - 5/4/2025)**

### 🎨 **UI & Components**

- **Development Tools**: Reintroduced Storybook for debugging and testing
- **Bug Fixes**:
  - Fixed sidebar hamburger menu icon state restoration
  - Resolved critical TailwindCSS color palette issues
- **Modal System**: Moved modals to external portal at document body

### 📅 **Calendar**

- **Code Quality**: Major code refactoring
- **Recurring Events**: Added ability to exclude specific dates from recurring events

## 📌 **dev 25w17 (4/20/2025 - 4/27/2025)**

### ⏱️ **Codetime**

- **VS Code Extension**: Published custom extension for system integration and time tracking

## 📌 **dev 25w16 (4/13/2025 - 4/19/2025)**

### 📅 **Calendar**

- **Recurring Events**: Now properly displayed in calendar interface

### 📚 **Books Library**

- **Libgen Integration**: Added online/offline status indicator for host availability

### ⏱️ **Codetime**

- **GitHub Integration**: Added API endpoint for generating summary images for GitHub profiles

### 🔐 **Authentication**

- **Cookie Management**: Renamed `token` to `session` for better clarity

### 🏗️ **Code Architecture**

- **Performance**: Optimized by removing unnecessary re-renders

### 🔧 **API**

- **Configuration**: Moved Puppeteer executable path to `.env` for better configurability

### 💰 **Wallet**

- **Date Range**: Fixed sidebar date range selector functionality

## 📌 **dev 25w15 (4/6/2025 - 4/12/2025)**

### 🎨 **UI & Components**

- **FormModal**: Added support for additional custom fields and `CheckboxInput`

### 📊 **Server Status**

- **Dashboard**: Added empty state screen for storage status widget

### 📅 **Calendar**

- **UI Enhancements**:
  - Improved overall calendar component design
  - Added event detail popup on mini calendar date hover
  - Added quick access button to calendar sidebar
- **Recurring Events**: Created form component for recurring time selection

### ✅ **Todo List**

- **Calendar Integration**: Tasks with due dates automatically added to calendar

### 🎬 **Movies**

- **Calendar Integration**:
  - Removed manual "Add to Calendar" button
  - Movies with tickets automatically added to calendar

## 📌 **dev 25w14 (3/30/2025 - 4/5/2025)**

### 🎨 **Personalization**

- **API Integration**: Fixed Pixabay API tooltip display when key already exists

### 🗃️ **Moment Vault**

- **Mobile Fix**: Resolved photo display issue when pressing "Add" button on mobile

### 📅 **Calendar**

- **User Experience**:
  - Added event info tooltips on calendar clicks
  - Enhanced event creation with `Location`, `Reference Link`, and `Description` fields
  - Further improved calendar styling
- **AI Integration**: Added OpenAI GPT-4o image parsing for event details

### 🎸 **Guitar Tabs**

- **Performance**: Implemented on-demand audio file loading

### ✅ **Todo List**

- **Flexibility**:
  - Added time inclusion toggle for task due dates
  - Fixed database recording issues in task creation/modification

### 🎬 **Movies**

- **Calendar Integration**: Added ticket-to-calendar button

### 🎨 **UI & Components**

- **Text Input**: Fixed line break application in text area
- **ListBox**: Changed icon from chevron down to chevron up-down
- **FormModal**: Added `TextAreaInput` component

### 🔧 **API**

- **Database**: Utilized PocketBase's `View` collection for entry tracking via SQL

## 📌 **dev 25w13 (3/23/2025 - 3/29/2025)**

### 🎨 **UI & Components**

- **Image Generation**: Added AI text-to-image tab in image picker modal
- **Delete Confirmation**: Added text input confirmation for delete modals

### 🏗️ **Code Architecture**

- **Bug Fixes**: Resolved duration formatting issues

### 🗃️ **Moment Vault**

- **Entry Types**: Added support for image entries
- **Text Wrapping**: Fixed text entry display issues

### 🎬 **Movies**

- **API**: Fixed various endpoint bugs

### 📅 **Calendar**

- **Performance**: Improved rendering optimization
- **Event Management**:
  - Start/end time fields now include both date and time
  - Fixed event fetching when date/view mode changes

### 💰 **Wallet**

- **Mini Calendar**: Fixed date formatting in sidebar

### ✅ **Todo List**

- **Performance**: Resolved slow data loading issues

## 📌 **dev 25w12 (3/16/2025 - 3/22/2025)**

### 🔧 **API**

- **Architecture**:
  - Moved type interfaces to respective module directories
  - Continued Controller + Service refactoring
  - Improved error handling logic
  - Restructured `src` folder to `modules` and `core` only
- **Middleware**: Replaced `validationMiddleware` with `asyncWrapper` for comprehensive error handling
- **Error Management**: Moved all try-catch blocks to `asyncWrapper`
- **Organization**:
  - Moved locale files to respective module directories
  - Relocated `.env` files to `env` directory
- **Build System**: Migrated bundler from `pkgroll` to `bun`
- **Schema Management**: Added automatic `schema.json` scanning and database import script

### 🏗️ **Code Architecture**

- **State Management**: Replaced all `useReducer` with `useState`
- **Routing**: Reconstructed mechanism, combining configurations into single file
- **Dependencies**: Pruned unused dependencies and removed empty modules
- **Entry Point**: Renamed from `main.tsx` to `index.tsx`
- **Frontend**: Removed PocketBase dependency
- **Data Fetching**:
  - Continued `FormModal` migration
  - Completed `@tanstack/query` integration
  - Migrated from `APIFallbackComponent` to `QueryWrapper`
- **Core Structure**: Restructured `core` directory
- **Date Handling**: Migrated from `moment` to `dayjs`
- **Code Quality**: Fixed all ESLint errors (except TODOs)
- **Plugin Management**: Removed problematic `eslint-plugin-import`

### 💰 **Wallet**

- **Mini Calendar**: Fixed date range search parameter setting

### ✅ **Todo List**

- **Bug Fixes**: Resolved issues from recent code refactor

### 📅 **Calendar**

- **Date Parsing**: Fixed mini calendar date parsing issues

### 🎬 **New Modules**

- **YouTube Summarizer**: Created and completed full module
- **Currency Converter**: Created and completed full module

### 📚 **Books Library**

- **Barcode Scanning**: Added barcode scan button beside search bar

### 🎸 **Guitar Tabs**

- **Random Loading**: Added random tab loading button beside search bar
- **Metadata**: Fixed tab metadata update issues after editing

### 🎨 **Personalization**

- **Localization**: Added missing locales for background image adjustment modal

### 🗃️ **Moment Vault**

- **Entry Types**: Added support for text entries

### 🎨 **UI & Components**

- **Deployment**: Created GitHub workflow for automatic deployment and versioning
- **Mobile**: Fixed sidebar subsection collapse on mobile
- **ESLint**: Removed problematic `eslint-plugin-import` and fixed all errors
- **Development**: Added numerous `package.json` commands
- **Components**:
  - Created reusable `TextAreaInput` with fixes
  - Removed `APIFallbackComponent`
  - Added `formats` prop to `QRCodeScanner`
  - Migrated search bar side button to reusable `Button`
  - Added `sideButtonLoading` prop to `SearchBar`
- **Storybook**: Removed due to customization limitations

### 📖 **Documentation**

- **Installation**: Updated guide to align with latest codebase structure
- **User Guides**: Added brief system guides

---

## 📌 **dev 25w11 (3/9/2025 - 3/15/2025)**

### 📖 **Documentation**

- **Navigation**: Fixed section detection and highlighting inconsistencies in right navigation bar
- **Installation**: Updated guide to align with latest codebase structure

### 💡 **Idea Box**

- **Text Handling**: Fixed overflow issues with long words
- **Link Management**: Resolved link content and OG data update bugs

### 📝 **Change Log**

- **Migration**: Moved all entries from local database to public GitHub repository
- **AI Assistance**: Used ChatGPT to refine entries from 25w01 onwards

### 🚇 **Railway Map**

- **New Module**: Complete railway mapping system
- **Visualization**: Integrated d3.js for dynamic route visualization
- **Mapping**: Integrated Leaflet.js for interactive Earth map of MRT lines/stations
- **Pathfinding**: Developed shortest route calculation between stations
- **UX**: Enhanced interactions with smooth navigation animations

### 📅 **Calendar**

- **Performance**: Data now fetched based on selected date range instead of everything

### 🔐 **Authentication**

- **2FA**: Added external authenticator app support as toggleable security
- **Fallback**: Email OTP option for users without authenticator apps
- **Error Handling**: Improved logic throughout

### 🎨 **Personalization**

- **Font Selector**: Availability now depends on `gcloud` key presence in API vault

### 🌐 **Localization**

- **Conditional UI**: Sign-in button only shows if `VITE_LOCALIZATION_MANAGER_URL` exists

### 🏗️ **Code Architecture**

- **Utilities**: Replaced custom functions with optimized Node.js modules
- **Organization**:
  - Moved non-module files from `modules` to `core`
  - Reorganized providers/interfaces/constants to respective modules
  - Eliminated redundant constant files
- **Naming**: Standardized `useXXXContext` to `useXXX`
- **Theme Management**:
  - Centralized theme states in `usePersonalization`
  - Renamed `useThemeColors` to `useComponentsBg`
- **Configuration**: Migrated `VITE_GOOGLE_API_KEY` to API key vault
- **Cleanup**: Removed unused TypeScript declarations
- **Routing**: Moved routing logic to `core/routes`
- **Component Architecture**: Refactored components into independent `lifeforge-ui` package

### 🎨 **UI & Components**

- **Component Library**: Abstracted reusable components to `lifeforge-ui`
- **Button Variants**:
  - Renamed `no-bg` to `plain`
  - Added `tertiary` variant
  - Improved overall styling
- **Development Tools**: Started Storybook integration for design system
- **Component Cleanup**: Removed `CreateOrUpdateButton`
- **HamburgerMenu**: Restructured props and removed redundancy
- **Conditional Features**: Location selector disabled without `gcloud` key
- **Sidebar**: Main items with subsections open menus without navigation

### 🔧 **API**

- **File Management**: Renamed `uploads` to `medium`
- **Route Organization**: Split `/users` subroutes into multiple files
- **Architecture**: Continued Controller + Service refactoring

---

## 📌 **dev 25w10 (3/2/2025 - 3/8/2025)**

### 💡 **Idea Box**

- **Drag & Drop**: Prevented folders from being dropped into themselves
- **UI Fixes**:
  - Fixed intermittent tag icon display issues
  - Improved filtering to show nested folder contents when filtering by tags
  - Made titles optional for link-type ideas

### 🗃️ **Moment Vault**

- **Audio Recording**: Fixed occasional capture issues

### 💰 **Wallet**

- **Bug Fixes**: Resolved asset selection errors when switching transaction types
- **Heatmap**: Users can toggle displayed transaction types in calendar heatmap
- **Filtering**: Category selections now dynamically filter based on transaction type

### 🏗️ **Code Architecture**

- **API Functions**: Refactored `APIRequest` to `fetchAPI` for clarity
- **Input Focus**: Action buttons in text inputs now auto-focus the field
- **QR Scanner**: Implemented reusable QR Code Scanner component for Form Modal

### ⏱️ **Codetime**

- **Analytics**: Introduced time charts for project and language usage tracking

### 🔑 **API Keys**

- **Organization**: Moved module from "Settings" to "Confidential" section
- **Usability**: Added copy button for API keys

### 🎬 **Movies**

- **New Module**: Complete movie management system
- **TMDB Integration**: Search and import modal for movie data
- **CRUD Operations**: Full create, read, update, delete functionality
- **Ticket Management**: Ability to attach ticket data to movie entries

### 🌐 **Localization**

- **Architecture**: Complete restructure to align with latest locale folder system

---

## 📌 **dev 25w08 (2/16/2025 - 2/22/2025)**

### 🎸 **Guitar Tabs**

- **UI Fix**: Corrected "Sort By" selector text to reflect actual selection

### 🎨 **Personalization**

- **Theme Conflict**: Resolved DaisyUI overwriting neutral gray variant

### 🗃️ **Moment Vault**

- **New Module**: Life event recording system
- **Audio Features**: Record life events as audio with optional OpenAI Whisper transcription

### 🔧 **API**

- **Architecture**: Started migration to `controller + service` pattern
- **Testing**: Scrapped initial test codebase, began rewriting

### 🏗️ **Code Architecture**

- **React Router**: Upgraded to version 7 for improved performance

---

## 📌 **dev 25w07 (2/9/2025 - 2/15/2025)**

### 🏗️ **Code Architecture**

- **UI Fix**: Refactored OTP screen, fixed dark mode color inconsistency

---

## 📌 **dev 25w06 (2/2/2025 - 2/8/2025)**

### 🏗️ **Code Architecture**

- **Color System**: Rewrote TailwindCSS color palette to correctly convert `oklch` to `RGB`

### 📧 **Mail Inbox**

- **Bulk Operations**: Implemented bulk selection and deletion of mail entries

---

## 📌 **dev 25w05 (1/26/2025 - 2/1/2025)**

### 🏗️ **Code Architecture**

- **Framework Upgrade**: Upgraded TailwindCSS to version 4.0
- **Performance**: Memoized all context provider values
- **Component Optimization**: Added `react-compiler` for UI performance
- **Headless UI**: Upgraded to beta with full TailwindCSS 4.0 support
- **Component Structure**: Created reusable wrapper components for modules with sub-sidebars
- **Utilities**: Rewrote currency formatting using `Intl.NumberFormat`
- **Bug Fixes**: Fixed pagination component mechanism
- **Refactoring**: Major codebase refactor for maintainability
- **ESLint**: Added plugin for alphabetical component prop sorting

### 📧 **Mail Inbox**

- **Complete Overhaul**: Redesigned UI for better user experience
- **Gmail Integration**:
  - Synchronized with Gmail, storing emails in custom database
  - Real-time email synchronization with automatic importing
- **Navigation**: Added sidebar, search bar, and pagination
- **Viewing**: Users can view mail content directly in UI

### 🎨 **UI & Components**

- **Theme Consistency**: Improved light mode across components
- **Navigation**: Fixed icon flashing between routes

### 👗 **Virtual Wardrobe**

- **Session Cart**: Temporary storage for clothing sets before checkout

### 🌐 **Localization**

- **Structure**: Revamped folder structure, segmented translations into namespaces
- **Completion**: Finished translations for previously untranslated sections

### 📱 **Module Removal**

- **Spotify**: Completely removed from system

---

## 📌 **dev 25w04 (1/19/2025 - 1/25/2025)**

### 🎵 **Music**

- **Hotkeys**: Added spacebar support for play/pause functionality

### 🏗️ **Code Architecture**

- **Dependencies**: Upgraded all project dependencies to latest versions
- **ESLint**: Migrated to latest release for improved linting
- **Structure**: Large-scale folder refactoring, organized components into structured directory
- **Optimization**: Removed unused dependencies from `package.json`
- **Component Refactoring**: Significantly refactored `Button` component
- **Organization**: Moved routing and entry files into `core` directory

### 🔐 **Passwords**

- **State Management**: Implemented context providers to reduce redundant code

### 📊 **Server Status**

- **Code Quality**: Extensive refactor for efficiency and maintainability

### 👗 **Virtual Wardrobe**

- **New Module**: Complete clothing item management system
- **CRUD Operations**: Full functionality for wardrobe entries
- **Filtering**: Added sidebar with filtering options

---

## 📌 **dev 25w03 (1/12/2025 - 1/18/2025)**

- **UI**: Removed the header and relocated the profile button to the sidebar for a cleaner layout.
- **Wishlist**: Added a direct link button to visit product websites.
- **Code**: Refactored the "Go Back" button to use a reusable button component.
- **Codetime**: Fixed UI responsiveness issues.
- **Books Library**: Resolved a color inconsistency issue in the Libgen modal when using light mode.
- **UI**: Reduced module header icon and text size for better mobile optimization.
- **UI**: Fixed minor spacing inconsistencies across the interface.
- **Wallet**: Implemented data extraction from receipt images using Tesseract OCR and GPT-4o-mini.
- **Code**: Created reusable checkbox components for consistent UI interactions.
- **Code**: Implemented a reusable tabs selector component.
- **Wishlist**: Developed full CRUD functionality for wishlist management, including automated amount calculations.
- **Wishlist**: Redesigned the wishlist list and entry UI for a more intuitive experience.
- **UI**: Added a refresh button to the API offline screen for improved usability.
- **Wishlist**: Integrated Puzzle World as a new wishlist provider.

---

## 📌 **dev 25w02 (1/5/2025 - 1/11/2025)**

### 💰 **Wallet**

- Fixed issue where financial reports displayed incorrect calculations across multiple years

### 🎨 **UI & Components**

- Reduced header icon size for better adaptability on small screens
- Reorganized module categories for a more intuitive user experience
- Fixed modal layering issues in the Pixabay search filter within the image picker modal
- Addressed minor light mode inconsistencies

### 🛍️ **Wishlist**

- Improved responsiveness for a smoother mobile experience

### 🔧 **Module Tools**

- Completely revamped the utility tool system
- Added help screen to guide users through features
- Implemented multilingual support
- Introduced ability to list and delete modules dynamically

### 🏗️ **Code Architecture**

- Updated `README.md` with latest information and screenshots
- Replaced `tsx` runtime with `bun run` for improved build performance
- Modified build options to split Node modules into chunks during production builds for better performance

### 🔧 **API**

- Integrated OpenAI's GPT-4o-mini model and developed `fetchOpenAI` utility function

### 💲 **OpenAI API Pricing**

- **New Module**: Created module allowing users to view OpenAI API pricing directly within the system

---

Of course, here is the `dev 25w01` change log entry rewritten to match the style of the subsequent entries.

## 📌 **dev 25w01 (12/29/2024 - 1/4/2025)**

### 🏗️ **Code Architecture**

- 🎉 Happy New Year! 🎉
- Optimized stylesheets by removing excessive and unused TailwindCSS classes.
- Enhanced type declarations for UI components for better TypeScript support.
- Streamlined prop management by removing unused component props.
- Developed a reusable `Switch` component for toggling states.
- Fixed pagination component bugs affecting navigation.
- Renamed various component props to more intuitive names.
- Renamed `APIComponentWithFallback` to `APIFallbackComponent` for better clarity.
- Fixed multiple bugs related to the image upload modal.
- Added a file input option within the form modal component.
- Upgraded PocketBase to its latest version for improved performance and stability.
- Upgraded TailwindCSS to its latest stable version.
- Conducted a major code refactor to optimize performance and readability.
- Refactored sidebar logic and enhanced type declarations for improved maintainability.

### 📊 **Dashboard**

- Switched the previous quote API to AI-generated quotes for dynamic content.

### 💡 **Idea Box**

- Resolved an issue with OG image aspect ratio inconsistencies.
- Implemented a tagging system, enabling users to categorize ideas with custom tags.
- Added search functionality within idea containers and folders.
- Utilized context providers to streamline state management between components.
- Users can now add cover images to idea containers for better visual organization.
- Added a latest update timestamp display for image entries.
- Fixed an issue where moving ideas out of folders was not properly reflected in the UI.

### 🎨 **UI & Components**

- Continued improvements to theme consistency across dark and light modes.
- Fixed multiple responsive UI issues.
- Password input fields are now hidden by default and will only reveal content when users press and hold the eye button.

### 💰 **Wallet**

- Corrected text inconsistencies in sidebar buttons.
- Increased the resolution of receipt images extracted from PDF files for better accuracy.

### 🔐 **Authentication**

- Switched to using PocketBase’s built-in OTP feature, replacing the previous OTP implementation.

### 🧩 **Sudoku**

- **New Module**: Introduced a new module allowing users to generate and print Sudoku boards.

### 📓 **Journal**

- Fixed image display and upload bugs.

### 👤 **Account**

- Addressed UI responsiveness issues.

---

## 📌 dev 24w52 (12/22/2024 - 12/28/2024)

- **Idea Box**: User can now create folders inside folders (nested folder is now a thing)
- **UI**: Reduced background blur and opacity for modal component
- **UI**: Fixed overflow bugs related to the height of module wrapper
- **Sidebar**: Added Christmas event banner
- **Sidebar**: Code refactored
- **Modules**: Developer can now mark specific modules as deprecated
- **Journal**: Fixed minor UI elements spacing issue
- **Projects (M)**: Added partial functionality to add card button
- **Wishlist**: User can now add entry to wishlist
- **Wishlist**: Added url column to "import from other app" modal
- **Spotify**: Marked as deprecated for now
- **Projects (K)**: Marked as deprecated for now
- **Wishlist**: Marked as having AI integration
- **UI**: Major fixes
- **Code**: Created reusable component for dashboard Item
- **Wallet**: Dashboard widget is now using reusable wrapper
- **Dashboard**: Dashboard widget is now using reusable wrapper
- **Sidebar**: Expand and collapse animation now run smoothly
- **API**: Test cases fixed to suit current code logic
- **Books Library**: Added file type filter
- **Books Library**: Fixed bug where data in input boxes won't reset when addToLibrary modal is reopened
- **Books Library**: Minor style changes to addToLibrary button when book is already in library
- **Books Library**: Fixed bug related to thumbnail displaying in libgen modal
- **Books Library**: Improved data validation logic before data is submitted to the server
- **Books Library**: Improved UI responsiveness in mobile view
- **Workout**: Added this module
- **Code**: Removed random console.log() function scattered across the codebase
- **3D Models**: Added this module
- **Idea Box**: Date of last updating of idea entry is now shown
- **UI**: Fixed mobile responsive issue of TailwindCSS color palette
- **UI**: Fixed UI responsiveness issue for color picker modal
- **UI**: Fixed component height problem of pixabay search result list in image picker modal
- **UI**: Improved color of contents in empty state screen when user is in light mode
- **UI**: Fixed bug where background image filter is now showing properly
- **Calendar**: Improved display of year and month in mini calendar header when language is set to Mandarin
- **Dashboard**: Removed ask AI FAB for now
- **UI**: Color consistency fixed
- **Wallet**: Fixed issue related to component height

---

## 📌 dev 24w51 (12/15/2024 - 12/21/2024)

- **Code**: Fixed bugs on API status detection provider
- **Wallet**: Fixed minor bugs on route parameters

---

## 📌 dev 24w50 (12/8/2024 - 12/14/2024)

- **API Keys**: The time when each key is last updated will now be shown
- **Guitar Tabs**: Removed suspicious potential credentials left behind

---

## 📌 dev 24w49 (12/1/2024 - 12/7/2024)

- **Wishlist**: User can now paste a link of any Shopee product and the system will automatically parse data using OCR
- **Code**: Changes made to components folder structure
- **Code**: Made image upload modal universal and reusable so that all modules can share the same
- **Dashboard**: Minor bug fixes to the display of Today's Event widget
- **Code**: Image upload modal can now also upload files
- **Journal**: Word count of each entry will now be shown in the entry list
- **UI**: Bug fixes on password input

---

## 📌 dev 24w48 (11/24/2024 - 11/30/2024)

- **Journal**: Fixed bugs related to image display and upload
- **Personalization**: User can now add background image to their system
- **Personalization**: User can now adjust their background image filters like brightness, contrast, saturation, etc.
- **Code**: More refactoring on reusable components
- **Code**: Merged reusable component code for listbox and combobox
- **Calendar**: Fixed bugs on mini calendar heatmap
- **Wallet**: Added input box with autocomplete functionality powered by Google Map for user to enter the location where transactions are made
- **Wallet**: User can now upload PDF for transaction receipt that will then be converted into image file by the system
- **Code**: Removed useless dependencies
- **UI**: Added bgColors into `useThemeColors` hook that further unified the system's appearance
- **Code**: Created reusable component for selecting view mode
- **Code**: Fixed critical bugs on theme color
- **Personalization**: User can now upload photo for their bg image, or enter URL that will then be downloaded by the system automatically, or find stock photos from Pixabay straight away from inside the system
- **Airports**: Fixed bugs due to API route name changes
- **Idea Box**: Open-graph data for link entries will now be parsed and displayed instead of the bare URL
- **Server Status**: Added API env display showing whether it's in development or production environment
- **Guitar Tabs**: User can now star guitar tabs
- **UI**: Fixed minor user interface related bugs
- **Idea Box**: UI components in image upload modal is now styled in a more consistent way
- **Dashboard**: Fixed critical bugs related to colors in Codetime widget
- **Wishlist**: Started working on this module
- **UI**: Fixed issue of content displaying when modal is in between the stage of opening and closing
- **Code**: Created a reusable component for selector in hamburger menu
- **Guitar Tabs**: Improvements made on UI responsiveness
- **Idea Box**: Fixed issue related to entry id validity checking
- **Journal**: Fixed issue related to image display
- **Journal**: Increased the max photo upload amount from 25 to 50
- **Code**: Corrected route config file path in the create module utility tool
- **Code**: Close button in the modal component now uses our own reusable button component
- **Wallet**: Transaction location will now only be shown in full when user hover over the tooltip (if applicable)
- **Wallet**: Changes made on transaction date for the purpose of UI responsiveness

---

## 📌 dev 24w47 (11/17/2024 - 11/23/2024)

- **Wallet**: Category and Asset is now required in adding income or expenses transactions
- **Code**: Minor code refactoring
- **Idea Box**: Fixed bugs due to API route changes
- **Journal**: Journal list item will now show the amount of photos if any
- **Wallet**: Added calendar heatmap to sidebar
- **Wallet**: Added transactions count widget to wallet dashboard
- **Wallet**: Minor fixes on money amount display
- **Wallet**: Changed statistics chart from line chart to stacked bar chart
- **Wallet**: Minor fixes on dashboard widget height
- **Wallet**: Minor improvements made to date range selection
- **Guitar Tabs**: Added select box for user to select sorting mode of their tab entries
- **Guitar Tabs**: Added module for user to download tabs straight away from `https://www.guitarworld.com.cn/`

---

## 📌 dev 24w46 (11/10/2024 - 11/16/2024)

- **Journal**: Fixed bugs related to image displaying
- **Code**: Created reusable component for header filtering chips
- **Code**: Query parameters are now presented as URL hash to prevent page rerendering
- **UI**: Added a series of TailwindCSS color palette for user to choose from under the color picker
- **Books Library**: Ditched CalibreDB and migrated to using main database for storing book data
- **Books Library**: User can now explore library genesis in the system
- **Books Library**: User can now download books from libgen straight away in the system
- **Books Library**: Basic CRUD function completed
- **Wallet**: Added calendar heatmap to the sidebar in transaction tab
- **Wallet**: User can now select date range in calendar heatmap in transaction tab
- **Code**: Minor code refactoring
- **Code**: Upgraded the model used by Groq to Llama 3.2

---

## 📌 dev 24w45 (11/3/2024 - 11/9/2024)

- **Code**: Moved all codebases from my own account into a specialized organization

---

## 📌 dev 24w44 (10/27/2024 - 11/2/2024)

- **API**: Removed useless typescript declarations

---

## 📌 dev 24w42 (10/13/2024 - 10/19/2024)

- **API**: Moved code from `app.ts` to `index.ts` to reduce redundancy
- **API**: Created `routes.ts` and moved all the module route declarations into it

---

## 📌 dev 24w41 (10/6/2024 - 10/12/2024)

- **Personalization**: Fixed UI responsiveness issue
- **UI**: Fixed minor light mode issue
- **API**: Implemented custom function to list all routes in the API
- **Dashboard**: Fixed date shifting error in Codetime chart widget
- **Wallet**: Money amounts are now hidden by default
- **API**: Started working on API integration test for each module
- **API**: Implemented mechanism to parse docs from JSDoc-like inline endpoint documentation inspired by Open API documentation standard
- **API**: Completely revamped the design API explorer, added a lot more information

---

## 📌 dev 24w39 (9/22/2024 - 9/28/2024)

- **Icon Selector**: Chip selector is now collapsed by default to prevent squeezing the height of the icon list
- **Icon Selector**: Some more code refactoring
- **Sidebar**: Some bug fixes on the subsection expand and collapse mechanism
- **Todo List**: User can now define their own set of priorities
- **Code**: Improved consistency of sidebar items inside individual module
- **Sidebar**: Refactored code for sidebar item
- **Code**: The `updateValue` props can now be passed in the set state action function straight away
- **Code**: Migrated from using `yarn` to `bun` as package manager for the project

---

## 📌 dev 24w38 (9/15/2024 - 9/21/2024)

- **Icon Selector**: UI fix for light theme
- **Icon Selector**: Code refactored
- **UI**: Modal overlay background color is now lighter in light mode
- **UI**: Input will now be focused when being clicked (it will not be focused when user click outside the input element itself back then)
- **Code**: Created reusable component `SidebarWrapper`
- **UI**: Minor bug fixes and improvements
- **Guitar Tabs**: Added sidebar that allows user to filter scores through various criteria
- **Guitar Tabs**: User can now delete scores through UI
- **Code**: Created reusable component `ConfigColumn`
- **Authentication**: Reverted back to using OAuth sign in instead of passkey
- **Authentication**: Implemented signing in with Google and Github
- **Localization**: Groq is now being used to generate translations in the locale admin
- **Authentication**: Implemented OTP functionality (through email)
- **Journal**: Added an additional layer of security through the integration of OTP
- **Passwords**: Added an additional layer of security through the integration of OTP
- **UI**: Headers and sidebar will now be present when module is loading
- **API Keys**: Created this module to store all the API keys required by other modules
- **API Keys**: Module completed, migrated all the API keys from env file to the database
- **Todo List**: Gemini is replaced by Groq to generate subtasks
- **Airports**: Gemini is replaced by Groq to generate summary of NOTAM data
- **API**: Created reusable utility function for fetching text generated by Groq
- **API Keys**: Modules that requires the use of API key will now check for the existence of the keys before loading up the module
- **Personalization**: User can now set custom accent color for their system
- **Localization**: Some more progress on system text translation
- **UI**: Renamed the Aviation section to Information
- **Notes**: Minor bug fixes
- **Personalization**: User can now set custom background temperature color
- **UI**: Added a series of morandi color palette for user to choose from under the color picker
- **Modules**: Modules in the list are now separated by their categories in the sidebar
- **Mail Inbox**: Some changes to the UI
- **API**: Integrated lazy loading routes for faster startup speed

---

## 📌 dev 24w37 (9/8/2024 - 9/14/2024)

- **Youtube Video Storage**: User can now download multiple videos asynchronously
- **Youtube Video Storage**: User can now view their download progresses through the UI
- **Youtube Video Storage**: Added option for user to watch the video on YouTube
- **Youtube Video Storage**: Renovated the UI for video list
- **Youtube Video Storage**: User can now download videos from playlist
- **Youtube Video Storage**: User can now search for videos available in the storage
- **API**: Added descriptions for newly added endpoints
- **Change Log**: Added button to refresh data
- **Guitar Tabs**: Added placeholder for score thumbnail when image is not loaded
- **Personalization**: User can now change the font of the system into one of thousands of fonts available on Google Fonts
- **UI**: Improved styling consistency and light mode colors
- **Personalization**: Added icon for each personalization section
- **Personalization**: Added tooltip in font selector stating that it is powered by Google Fonts
- **Youtube Video Storage**: Added placeholder for video thumbnail when image is not loaded
- **API**: Code will now be minified into a single file when starting production server
- **Pomodoro Timer**: Core functionality completed
- **Youtube Video Storage**: Mobile responsive done
- **Personalization**: Minor UI bug fixes
- **Icon Selector**: Integrated `react-virtualized` for virtualized icon list, leading to massive improvement in performance

---

## 📌 dev 24w36 (9/1/2024 - 9/7/2024)

- **Personalization**: Improvements on UI feedback
- **Localization Manager**: Users will now be redirected back to the page they were located before they click the sidebar button
- **Code**: Created a CLI tools with AI integration in module name and description translation to streamline module creation
- **Code**: Created a reusable component for `ListboxInput`
- **Personalization**: Fixed language switching bugs
- **UI**: Added icon beside module title in module header component
- **Youtube Video Storage**: Started working on this module
- **Youtube Video Storage**: User can now download individual video from YouTube with progress being shown in the UI
- **Youtube Video Storage**: Downloaded videos are now being listed in the UI
- **Youtube Video Storage**: User can now delete unwanted videos in their storage

---

## 📌 dev 24w35 (8/25/2024 - 8/31/2024)

- **Guitar Tabs**: User can now attach audio and musescore files to their tabs if the uploaded filenames are the same
- **API**: Reconfigured SAMBA server and renamed `uploads` folder to `medium`
- **Photos**: Changed the position of sidebar and header in main gallery
- **Photos**: Used normal modals for image preview instead of `react-medium-image-zoom` due to some unsolvable bugs
- **Codetime**: Fixed bugs on database manipulation
- **Photos**: User can now create, update and delete album tags
- **Music**: `yt-dlp` now stays in the source code, works right off the bat without additional installation steps
- **Music**: The total amount of musics in the library is now displayed in the header
- **Code**: `SidebarItem` can now display numbers as well
- **CFOP Algorithms**: Started working on this module
- **CFOP Algorithms**: Index page done
- **CFOP Algorithms**: Written the code required to render Rubik's cube using ThreeJS
- **UI**: Added a banner in sidebar that will show up during national day
- **Localization**: Changed localization manager's theme color from teal to lime
- **CFOP Algorithms**: Written the code required to generate cube according to moves notation given
- **CFOP Algorithms**: F2L page design done
- **CFOP Algorithms**: Refactored the 3D cube generation code slightly for cleaner data representation
- **CFOP Algorithms**: Started adding data into F2L page
- **CFOP Algorithms**: OLL page completed
- **CFOP Algorithms**: PLL page completed
- **Localization**: Transferred locale manager site from Vercel to Netlify
- **Localization**: Changed the URL to `locale-admin.lifeforge.thecodeblog.net`
- **DNS Records**: User can now sort records by their name, TTL, type, or data
- **DNS Records**: User can now delete individual records
- **DNS Records**: User can now bulk select records and delete
- **API**: System will now check if the API endpoint is working before loading everything

---

## 📌 dev 24w34 (8/18/2024 - 8/24/2024)

- **Code**: Started recovering after almost two months worth of data completely lost
- **Photos**: Fixed bugs where data failed to load properly when there is no photo entry records
- **UI**: Fixed some bottom margin issues
- **Airports**: Fixed runway scraping logics
- **Wallet**: User can now select between list view and table view in transaction page
- **Change Log**: Tried my best to recover almost two months' worth of change log entries by looking at each Git commits
- **Codetime**: Freed up a lot of space in database by revamping how the Codetime entries are stored
- **Documentation**: Added steps for configuring `pdf-thumbnails` in backend config section

---

## 📌 dev 24w31 (7/28/2024 - 8/3/2024)

- **Code**: Updated HeadlessUI to the newest version
- **Code**: Migrated frontend hosting to Netlify cuz my Vercel quota exceeded
- **API**: Renamed all nouns to plural for better consistency
- **Wallet**: Integrated `react-virtualized` for virtualized list, leading to massive improvement in performance
- **API**: Migrated to Typescript!!!
- **API**: Created reusable functions for CRUD actions

---

## 📌 dev 24w30 (7/21/2024 - 7/27/2024)

- **Code**: Created custom hooks for getting hex code of current theme color
- **Guitar Tabs**: User can now choose between grid view and list view
- **Airports**: Massive code refactoring

---

## 📌 dev 24w29 (7/14/2024 - 7/20/2024)

- **Guitar Tabs**: User can now open guitar tab PDFs by clicking on the entry
- **Music List**: Integrated `react-virtualized` for virtualized list, leading to massive improvement in performance
- **Guitar Tabs**: Added empty state screen when there is no guitar tabs
- **Icon Selector**: Removed statically defined icon set categories and replaced it with dynamically generated one
- **Photos**: Changed how dimensions are acquired from images

---

## 📌 dev 24w27 (6/30/2024 - 7/6/2024)

- **Journal**: Completely revamped the way of writing journal, integrating AI to help summarize the journal
- **Journal**: Post-completion code refactoring done
- **Code**: Created reusable screen for creating password and lock screen
- **Wallet**: Created date range filter in transaction sidebar
- **Airports**: Added section to view radio frequencies of each airport
- **Books Library**: Refactored the code

---

## 📌 dev 24w26 (6/23/2024 - 6/29/2024)

- **Code**: A lot more code refactoring
- **Code**: No need to check if the data is actually the data instead of "loading" or "error" any more every time when using `APIComponentWithFallback`
- **Projects (M)**: Started working on the Kanban board of each project
- **Projects (M)**: Used context provider to reduce code for transferring states among components
- **Airports**: Started working on this module for displaying airport data, just because I can
- **Changi Flight Status**: Created this module for displaying arrival and departure flights in Changi Airport, just because I can
- **Idea Box**: User can now straight away paste image into the idea box
- **Journal**: Journals are now encrypted with password, just like the Password Vault
- **Photos**: Created archived gallery, but yet to implement password functionality

---

## 📌 dev 24w25 (6/16/2024 - 6/22/2024)

- **Guitar Tabs**: Started working on this module
- **Dashboard**: Today's Event widget now displays real data from the calendar
- **Code**: Minor code refactoring here and there
- **Account**: User can now change their account settings like avatar, username, etc., and reset their password in the UI
- **API**: Removed redundant action statements in endpoint that can be indicated by HTTP methods
- **Code**: Refactored code for `Button` component
- **Guitar Tabs**: Implemented necessary CRUD functionality
- **Code**: Finally decided to change the name in `package.json`
- **Documentation**: Created documentation for the project
- **About**: Removed this useless stuff
- **UI**: A lot more improvements on UI consistency
- **UI**: Added custom scrollbar
- **Code**: Changed `type` props in Button component to `variant`
- **Project (M)**: Data in the module is now real
- **Projects (M)**: User can now create and modify Statuses, Categories, Technologies, and Projects in the UI
- **Projects (M)**: Refactored the code
- **Projects (M)**: Clicking on the project entry in the project list index will now direct user to page with actual data
- **UI**: Header will now retract when sidebar or modal is opened
- **UI**: Changed default theme color from teal to lime
- **Wallet**: Wallet balances are now dynamically derived from starting balances and transactions

---

## 📌 dev 24w24 (6/9/2024 - 6/15/2024)

- **Code**: Upgraded Iconify to newest version
- **Code**: Changed `w-x h-x` into `size-x` for better readability
- **UI**: Added icon for sidebar item indicating modules with AI integration
- **Todo List**: User can now add subtasks to individual tasks
- **Todo List**: User can now generate subtasks for each task using AI
- **Wallet**: Added utility class for converting number to money
- **Code**: Created import alias `@constants` for constant variables
- **Code**: Created reusable component `ListboxTransition`
- **Code**: Renamed all `@iconify/react/dist/iconify.js` imports to `@iconify/react`
- **Wallet**: Refactored the code for the dashboard page
- **Wallet**: User can now create and modify transaction categories
- **Wallet**: Refactored the code for modify transaction modal
- **Code**: Created reusable component for floating action button (FAB)
- **Code**: Created reusable component for `ListboxInputWrapper`
- **Authentication**: Slightly refactored the code for UI
- **UI**: Added option to add delete button to modal header
- **Code**: Added interface `BasePBCollection` that can be extended by other interfaces
- **Todo List**: Subtask item is now properly displayed in the task list
- **Localization**: Some more progress in UI translations
- **Localization**: Added language support for Traditional Chinese
- **Wallet**: Some more code refactoring
- **Code**: Changed `@typedec` alias to `@interfaces`
- **Wallet**: Used context provider to reduce code for transferring states among components
- **Wallet**: User can now click to view the receipt in transaction list view
- **Localization**: Added language support for Bahasa Malaysia
- **Code**: Changed LICENSE from `MIT` to `CC BY-NC-SA 4.0`
- **Wallet**: Data in the dashboard is now real
- **Wallet**: User can now filter transactions with all sorts of criteria
- **Dashboard**: User can now customize their dashboard content and layouts with all kinds of different widgets
- **Localization**: Moved translation data to the server
- **Dashboard**: Implemented widget for music player
- **Journal**: Temporary disabled `MDXEditor` due to catastrophic incompatibility
- **Localization**: Created a separate localization manager for the project that can be accessed through SSO in the system
- **Localization**: A lot more progress made in translation
- **Dashboard**: Implemented Clock, Date, and Quotes widget
- **API**: Added ESLint to API code for cleaner code
- **API**: Added `express-validator` for validating request body and stuff
- **API**: Fixed a lot of potential vulnerability
- **API**: Added rate-limiting logic to unauthenticated user
- **API**: CSS stylesheet for API explorer is now statically served

---

## 📌 dev 24w23 (6/2/2024 - 6/8/2024)

- **Dashboard**: Fixed theme color issue
- **Password**: UI mobile responsive done
- **Password**: Password returned from the server is now encrypted as well
- **Change Log**: Mobile responsive done for the new UI
- **Wallet**: Fixed transaction order problem
- **Wallet**: Fixed light mode color problem
- **API**: UI mobile responsive done
- **Wallet**: Add receipt column in the transaction table
- **UI**: Better color consistency
- **Wallet**: Added button for user to create transaction in wallet dashboard
- **Photos**: Migrated from using `react-photo-gallery` library to `react-photo-album` due to incompatibility with newest version of React

---

## 📌 dev 24w22 (5/26/2024 - 6/1/2024)

- **Code**: Added content for README.md and LICENSE
- **Code**: Finally renamed github repo to "Lifeforge".
- **Dashboard**: The graph in Codetime module now uses the theme color
- **Dashboard**: The graph in the Codetime module will now show point on hover
- **Photos**: User can now download the entire button with just a click of a button
- **Code**: Fixed color bugs on Icon and Color Input component
- **Wallet**: Started working on this module
- **Wallet**: Dashboard UI design completed
- **Wallet**: Created page for user to add, edit and delete their assets account
- **Wallet**: Created page for user to add, edit and delete their ledgers
- **Wallet**: Created page for user to view their transactions
- **UI**: Page title will now be updated according to the module the user is using
- **Code**: Updated React to version 19
- **Wallet**: User can now view, create, update, and delete transactions through the app

---

## 📌 dev 24w21 (5/19/2024 - 5/25/2024)

- **Music**: Refactored the code
- **Music**: Created global `MusicContext` so that music will play across all modules
- **Code**: Change all the `useContext(SomeContext)` into `useSomeContext()`
- **Code**: Removed all the dummy data in context providers
- **Code Snippets**: Removed this useless module a long time ago but forgot to write in change log
- **Code**: All the general components are now organized in a better way
- **Code**: Asked AI to help me organize all the states in the context providers
- **Authentication**: Fixed 404 issue when the user data hasn't been loaded yet
- **Music**: Request will not be sent when user is not logged in
- **Code**: Done some random refactoring
- **Codetime**: Used modern `useFetch` hook for fetching data for the activity calendar
- **Code**: Created a `APIRequest` utility function for sending data to the API
- **Command Palette**: UI for the command palette done
- **Passwords**: All the API requests are now protected by challenges from server
- **Journal**: User can now create journal entry through the UI
- **Journal**: User can now delete journal entry through UI
- **Photos**: User can now view and empty the recycle bin
- **Achievements**: Created this simply to see how fast I can build a brand new module using my ready-made components and logic functions
- **Idea Box**: User can now add image idea by simply pasting the link of the image
- **Dashboard**: Removed the dots in codetime statistics graph
- **API**: Redesigned the UI and it now looks better than ever
- **Idea Box**: User is now able to create folders in container to categorize the ideas
- **DNS Records**: Started working on this module
- **DNS Records**: Data is now properly fetched from the API and displayed in the UI
- **DNS Records**: Filter and search functionality completed
- **Idea Box**: User can now drag and drop their ideas into designated folders
- **Idea Box**: Idea that is created inside a folder will now stay in the folder
- **Calendar**: Fixed mini calendar date display problem in Safari
- **Change Log**: Mobile UI now looks better
- **Todo List**: Mobile sidebar z-index issue fixed
- **UI**: Sidebar header height inconsistency in mobile view fixed
- **UI**: Removed "Loading Data" text in loading screen
- **Server Status**: Removed gauge component since it causes huge performance issue on mobile
- **UI**: Mobile responsive view done for a lot of modules
- **Code**: Created import alias `@utils` for utility functions

---

## 📌 dev 24w20 (5/12/2024 - 5/18/2024)

- **Code**: Replaced `items-center justify-center` utility class with `flex-center`
- **Code**: Created reusable component `ModalHeader`
- **Code**: Created reusable component `Button`
- **Todo List**: Refactored the code.
- **Dashboard**: Data for todo list module is now real
- **About**: Created an entire landing page in the system for no reason at all
- **Passwords**: User can now delete password entry through UI
- **Code**: Removed useless dependencies
- **UI**: Added border to dropdown menu
- **Todo List**: User can now update and delete lists through UI
- **Todo List**: User can now update and delete tags through UI
- **Passwords**: Users can now update passwords through UI
- **Passwords**: User now has the ability to pin passwords
- **Todo List**: Task creation FAB will now be hidden when there is no task
- **Journal**: Created a module that allows user to write simple journal using markdown
- **API**: Replaced vanilla date utils function into momentJS function
- **API**: Created utils function for returning clientError
- **Calendar**: Started working on this module, integrating the library `react-big-calendar`
- **Calendar**: Added back small calendar in sidebar and fixed the generation logic
- **Calendar**: There is now a dialogue box for user to create event
- **UI**: Error message is now centred
- **Codetime**: Updated endpoint logic to match the latest version of vscode plugin
- **Calendar**: User can now create and modify categories in UI
- **Calendar**: User can now assign category to events
- **Calendar**: Event category will now be shown in mini calendar and the main calendar
- **Calendar**: Code refactored after mindlessly spamming code for the core logic
- **Calendar**: Month navigation button is now moved to the left in the calendar header
- **Photos**: Reduce gap between tags in album list
- **API**: Created https proxy server at `https://main--pms-api-proxy.netlify.app`
- **API**: All the media are now piped from database endpoint in the API
- **Public Portal**: Created a public portal for publicly available data
- **Photos**: Albums are now shareable through the Public Portal
- **Photos**: Added modal to toggle visibility/publicity of album
- **Books Library**: Renamed Reference Books module to Books Library
- **Books Library**: Finished setting up local Calibre DB and linked the data in UI to it
- **Music**: Created this module
- **Music**: User can straight away download music from Youtube or import from NAS
- **Music**: User can mark their music as favourites
- **UI**: Fixed some light mode background color issues
- **Music**: User can play, pause, play last, play next, play repeatedly, shuffle musics, etc. just like any other music player can do

---

## 📌 dev 24w19 (5/5/2024 - 5/11/2024)

- **Photos**: Removed sorting stuff from API to increase loading speed
- **Todo List**: Added date picker when creating task so user won't have to manually input any more
- **Todo List**: Increased gap between tags in task item
- **Todo List**: Fixed problem in list counter
- **Todo List**: Tags counter is now working
- **Todo List**: Due date is not mandatory any more
- **UI**: Made the description font size in empty state screen smaller
- **Todo List**: Used context provider to reduce code for transferring states among components
- **Todo List**: Sidebar task status number is now real
- **Todo List**: Sidebar task status selection button is now working
- **Todo List**: Overdue task will now be shown in red color
- **Todo List**: Tags count will now update correctly when task is deleted
- **Todo List**: Filtered tag and list will now show in the header

---

## 📌 dev 24w18 (4/28/2024 - 5/4/2024)

- **Photos**: Fixed bugs where user cannot remove photos from album
- **Photos**: Fixed bugs where user cannot bulk download photos
- **Photos**: User can now add tags to albums
- **Photos**: Renaming album will only reload the item renamed instead of the entire page
- **Photos**: Album photo gallery header is now visible when scrolling down
- **Photos**: Photo dimensions data will now load as asynchronous task to prevent request from not responding for too long.
- **API**: Deployed API to vercel
- **API**: Changed development host from `api.lifeforge.thecodeblog.net` to `dev.lifeforge.thecodeblog.net`
- **Todo List**: Empty state screen will now show when there is no task available

---

## 📌 dev 24w16 (4/14/2024 - 4/20/2024)

- **Code**: Refactored a lot of import statements by using aliases
- **Code**: Extracted all the type declaration code into a separate folder
- **Code**: Used ESlint to sort the import statements
- **Photos**: Deleting photos will not cause the entire gallery to reload any more
- **Code**: Created utils folder for miscellaneous functions
- **Personalization**: Added selector for user to choose language to be used in the system
- **Dashboard**: Data for storage status and Codetime module is now real
- **API**: Prevented credentials from being sent through the API
- **Repositories**: Decided to integrate Gitea into the system for repositories and projects management
- **Repositories **: Completed setup for Gitea in the server
- **API**: Slightly redesigned the explorer page and added description for each endpoint
- **Repositories**: All the repos are now listed in the UI

---

## 📌 dev 24w15 (4/7/2024 - 4/13/2024)

- **Notes**: User is now able to view PDF files in the app itself.
- **Code**: Added `manifest.json` to the codebase and now LifeForge can become its own standalone app.
- **UI**: Fixed password input font size
- **UI**: Dashboard responsive fixed albeit still not working
- **Passwords**: Started working on the module
- **Passwords**: User can now create a master password in the UI that will soon be used to encrypt and decrypt the passwords stored in the vault.
- **Passwords**: Master password is hashed using Bcrypt function that cannot be decrypted and can only be verified
- **Passwords**: User can now store passwords in the vault that will be encrypted using AES SHA256 with their master password
- **Passwords**: User can now view and copy their passwords through the UI
- **UI**: Changed font used in the UI to `Wix Madefor Font`
- **Authentication**: User can now login with biometric passkey.
- **API**: Changed codebase from being Common JS to ES Modules.
- **Authentication**: All the authentication logic is now done through the API. There is no direct connection between the front end and the database.
- **API**: Created asyncWrapper for handling errors and removed all the try catch blocks in each endpoint
- **Authentication**: Removed Github OAuth login for now

---

## 📌 dev 24w14 (3/31/2024 - 4/6/2024)

- **Flashcards**: Users are now able to paste bulk entries into flash card decks
- **API**: Split me and my brother's instances
- **Photos**: User is now able to mark photos as favourite

---

## 📌 dev 24w13 (3/24/2024 - 3/30/2024)

- **Photos**: Users are now able to download photos from gallery (single)
- **Change Log**: Change logs can now be viewed by different account
- **Todo List**: User can now delete task through UI
- **UI**: Hamburger menu button now has slightly thicker padding
- **Code**: Changed all `React.JSX.Element` to `React.ReactElement`
- **Photos**: User is now able to bulk download photos via NAS
- **Flashcards**: Added sidebar.
- **Flashcards**: Data are now synced with the database, no more dummy data
- **Flashcards**: Added button to randomly select flashcards
- **Flashcards**: Users are now able to modify and create cards in decks
- **Change Log**: Fixed bug of which the Regex will only replace one `code` tag in each entry

---

## 📌 dev 24w12 (3/17/2024 - 3/23/2024)

- **Todo List**: User can now create and modify task through UI
- **Code**: Used lazy loading to split large code base into chunks when production code is built.
- **Photos**: Updated logic bug when deleting photos
- **Personalization**: Added side margin to theme selector in mobile view
- **Todo List**: Fixed task overflow issue
- **Todo List**: Separated pending and completed tasks

---

## 📌 dev 24w11 (3/10/2024 - 3/16/2024)

- **Photos**: User can now remove photos from album through UI
- **Photos**: User can now rename photo albums
- **Photos**: Fixed album name overflow issue
- **Code**: Added ESLint to API code for cleaner code
- **Photos**: EVEN LARGER PERFORMANCE IMPROVEMENT: Images will now be fetched as needed (grouped by date)
- **Photos**: Fixed date arrangement bugs

---

## 📌 dev 24w10 (3/3/2024 - 3/9/2024)

- **Photos**: Made timeline date display being updated while scrolling more accurate
- **Change Log**: Added search feature
- **Change Log**: Display versions from latest to oldest
- **Idea Box**: Image display will now be in thumbnail size for faster loading unless being zoomed
- **Idea Box**: Allow user to see archived ideas
- **Photos**: Added sidebar to the gallery and reconstructed the UI layout
- **UI**: Make the modal forms with only one input being able to be submitted by hitting Enter key
- **API**: Updated HTTP request method of a few endpoints
- **Photos**: Changed the module header description.
- **Photos**: Used context provider to reduce code for transferring states among components
- **Photos**: Allowed user to add photos to album (one photo can only be added to one album)
- **Photos**: Make timeline height loading more consistent
- **Notes**: Invalid notes path will lead back to the root
- **Idea Box**: Invalid container ID in URL params will lead back to container list page
- **Project (K)**: Invalid project ID in URL params will lead back to project list page
- **Photos**: Refactored the code structure so that all routes can access `PhotosContext`
- **Photos**: User can now delete album through UI
- **Photos**: User can now view the content of album through UI
- **Idea Box**: Made the overlay of zoomed image transparent
- **Photos**: Zoom in images is now possible
- **Photos**: User can now delete photos through UI
- **Photos**: Bulk select consecutive photos by pressing `Shift` key
- **UI**: Better uniformed text color lightness across all modules
- **Project (K)**: Refactored code structures
- **Code**: Created a reusable component `SearchInput` for search input
- **Photos**: Users can now change cover of albums
- **Photos**: User now has the option to hide photos that have already been added to albums in main gallery
- **API**: Removed some unused data to increase the transfer speed
- **Photos**: HUGE PERFORMANCE IMPROVEMENT: Photos will now only be loaded when they are in the viewport.
- **Photos**: Fixed bug of which you cannot bulk select photos that were not shot on the same date

---

## 📌 dev 24w09 (2/25/2024 - 3/2/2024)

- **Code**: Fixed hot reload bug
- **Server**: Moved from RaspberryPi to my old PC for slightly better CPU performance
- **Server**: Created brand new instance for my brother
- **Photos**: Photo uploading mechanics completed (via Samba NAS)
- **Photos**: UI completed, looks and functions really identical to Google Photos
- **Server Status**: Added system uptime indicator
- **Photos**: Refactored messy code
- **Photos**: Added mechanics to select / select all photos
- **Authentication**: Fixed bugs that allows user to access main UI after failed login attempt
- **UI**: Made password input font size larger

---

## 📌 dev 24w07 (2/11/2024 - 2/17/2024)

- **Spotify**: Fixed authentication logic
- **Project (K)**: File uploading and downloading logic completed
- **UI**: Fixed opacity issue with custom theme colors
- **API**: Better error handling
- **Project (K)**: Project progress data synced with database and is able to be updated through UI
- **Project (K)**: Allow user to change project thumbnail through UI
- **Project (K)**: User is now able to create project through UI
- **Project (K)**: Removed ID suffix in filenames
- **Project (K)**: User is now able to filter projects using sidebar
- **Project (K)**: Project status can now be updated through UI
- **Server Status**: Added CPU and Memory usage meter and system information list

---

## 📌 dev 24w06 (2/4/2024 - 2/10/2024)

- **Spotify**: Added position slider
- **API**: changed all the PUT method to POST
- **Code**: Created reusable ModuleWrapper component
- **API**: created DDNS record at `https://api.lifeforge.thecodeblog.net`
- **Sidebar**: Completely rewritten sidebar and routes logic
- **Modules**: User is now able to toggle which modules are enabled
- **Projects (K)**: Started sketching out UI / UX
- **API**: Renovated authentication logic so that unauthorized personnel cannot access any API
- **Projects (K)**: Started working on file uploading logic

---

## 📌 dev 24w05 (1/28/2024 - 2/3/2024)

- **Notes**: Browse notes using a file explorer like interface
- **Notes**: Directory navigation mechanics completed
- **Notes**: Files and folder upload mechanics completed
- **Notes**: Added date column for files and folders in the explorer
- **Personalization**: Fixed dark mode related minor issue
- **Notes**: Fixed directory name overflow problem
- **UI**: Started working on responsive
- **Notes**: Access file by clicking on the entry
- **Code**: Massive codebase refactoring
- **Codetime**: Transferred missing data from official database to my database
- **Codetime**: Fixed dark mode UI
- **Codetime**: Frequency calendar theme color is now in sync with personalized theme color
- **Code**: Replace all data fetching code logics with custom useFetch hook
- **Todo List**: Added priorities to sidebar
- **Sidebar**: Moved Pomodoro Timer to Productivity category
- **Code**: Converted color input into reusable component
- **Hardware**: Bought a double-slot HDD docking station and utilized with Raspberry Pi
- **API**: Migrated database and API to Raspberry Pi
- **Change Log**: Sort entries alphabetically
- **Personalization**: Added option to change the background temperature of the application.
- **Server Status**: Added section to see disk usage status
- **API**: Added colored terminal logging
- **Todo List**: Data are now synced with database
- **Todo List**: Added modals to create tags and lists
- **Spotify**: Made a Spotify controller for some reason =)

---

## 📌 dev 24w04 (1/21/2024 - 1/27/2024)

- **Sidebar**: Subsection items for notes module is now bounded to database
- **Icon Picker**: Changed the code logic to adhere to the new API data structure
- **Notes**: Notes subjects are categorized by workspaces
- **Notes**: Added modal to create, modify and delete subjects
- **Notes**: Added different icons for each file format

---

## 📌 dev 24w03 (1/14/2024 - 1/20/2024)

- **Bug fix**: Module sidebar's behaviour is now separated from the main sidebar.
- **Change Log**: Change log entries are now stored inside database and are loaded dynamically into the UI
- **Change Log**: UI improvements.

---

## 📌 dev 24w02 (1/7/2024 - 1/13/2024)

- **Personalization**: UI to change the theme and accent color of the application from the personalization page.
- **Personalization**: Added option to change the accent color of the application.
- **Personalization**: Personalization linked with the user account in database, so that the settings are synced across devices.
- **Sidebar**: Sidebar icons are colored based on the theme.
- **Code Snippets**: Data synced to database, no more dummy data.
- **Code Snippets**: Create, update, and delete labels and languages from the UI.
- **Code Snippets**: View snippets by clicking on the list entry.

---

## 📌 dev 24w01 (12/31/2023 - 1/6/2024)

- **Idea Box**: Containers and ideas data synced to database, no more dummy data.
- **Idea Box**: Create, update, and delete containers and ideas from the UI.
- **Idea Box**: Search containers and ideas.
- **Idea Box**: Zoom image by clicking on it.
- **Idea Box**: Pin ideas to the top.
- **Change Log**: Added this change log with the naming convention of `Ver. [year]w[week number]`
- **API**: Added API explorer at the root of the API.
- **API**: Integrated Codetime API into the main API.
- **UI**: Added backdrop blur when modals are open.
- **Code**: Moved API host into `.env ` file.

---
