### 📌 **dev 25w11 (3/9/2025 - 3/15/2025)**

- **Documentation**: Resolved an issue where section detection and highlighting in the right navigation bar were inconsistent when scrolling.
- **Railway Map**: Introduced this module.
- **Idea Box**: Fixed text overflow issues caused by unspaced long strings.
- **Documentation**: Updated the installation and configuration guide to align with the latest codebase structure.
- **Change Log**: All change log entries were moved from the local database to a public GitHub repository for better accessibility.
- **Code**: Refactored and modularized components into an independent package, `@lifeforge/ui`, to improve maintainability.
- **Railway Map**: Integrated d3.js for dynamic and scalable route visualization.
- **Railway Map**: Integrated Leaflet.js to render an interactive Earth map of MRT lines and stations.
- **Railway Map**: Developed a feature to calculate and display the shortest route between any two stations.
- **Railway Map**: Enhanced user interactions with smoother animations for route navigation.
- **Code**: Replaced multiple custom utility functions with optimized, pre-existing Node.js modules.
- **UI**: Abstracted and relocated reusable UI components to `@lifeforge/ui` for a more structured component architecture.
- **Code**: Consolidated core logic by moving all non-module-specific files from `modules` into the `core` directory.
- **Code**: We reorganized providers, interfaces, and constants into their respective module directories to better separate concerns.
- **Code**: Eliminated redundant constant files to reduce unnecessary complexity.
- **Code**: Standardized naming conventions by renaming `useXXXContext` to `useXXX` for clarity.
- **Code**: Centralized theme-related states by moving them from the `useThemeColors` hook into the `usePersonalization` context provider.
- **Code**: Renamed `useThemeColors` hook to `useComponentsBg` for better semantic alignment with its functionality.
- **Change Log**: Asked ChatGPT to help refine all the change log entries from 25w01 until now.

---

### 📌 dev 25w10 (3/2/2025 - 3/8/2025)

- **Idea Box**: Fixed bug where folder can be dragged and dropped into itself
- **Idea Box**: fixed bug where tag icon is not shown sometimes
- **Idea Box**: Content in nested folders will now be shown as well when filter by tags in folder
- **Moment Vault**: Fixed bug where audio is sometimes not being properly recorded
- **Idea Box**: Title is now optional in link type idea
- **Wallet**: Fixed bug where error will be thrown when switching from income/expenses to transfer and assets is selected
- **Code**: Rewritten `APIRequest` function and rename it to `fetchAPI`
- **Wallet**: User can now toggle types of transactions to be shown in the calendar heatmap
- **Wallet**: Only the category related to selected transaction type will be shown
- **Code Time**: Added time chart for projects and languages
- **API Keys**: Moved this module from Settings section to Confidentials
- **API Keys**: Added button for user to copy API keys
- **Code**: Clicking on the action button in text input will now trigger the input box to focus
- **Code**: Added QR Code Scanner component that can be enabled in Form Modal and also added manually
- **Movies**: Created this module
- **Movies**: Implemented modal to search and import movie data from TMDB
- **Movies**: Implemented CRUD function for movie entry
- **Movies**: User can now add ticket data to movie entry
- **Localization**: Completely revamped the locale manager to adhere to the newest locale folder structure

---

### 📌 **dev 25w10 (3/2/2025 - 3/8/2025)**

- **Idea Box**: Resolved an issue where folders could be dragged and dropped into themselves.
- **Idea Box**: Fixed an intermittent bug where the tag icon would sometimes not appear.
- **Idea Box**: Improved filtering functionality — nested folder contents are now displayed when filtering by tags in a folder.
- **Moment Vault**: Fixed an issue where audio recordings were occasionally captured incorrectly.
- **Idea Box**: Titles are now optional for link-type ideas, improving flexibility.
- **Wallet**: Addressed a bug where switching from income/expenses to transfers while an asset was selected would cause an error.
- **Code**: Refactored the `APIRequest` function, renaming it to `fetchAPI` for clarity and maintainability.
- **Wallet**: Users can now toggle which transaction types are displayed in the calendar heatmap.
- **Wallet**: Category selections are now dynamically filtered based on the selected transaction type.
- **Code Time**: Introduced time charts to track project and language usage trends.
- **API Keys**: Moved this module from the "Settings" section to the "Confidentials" section for better organization.
- **API Keys**: Added a copy button for API keys, enhancing usability.
- **Code**: Clicking on the action button inside a text input now triggers the input field to focus automatically.
- **Code**: Implemented a QR Code Scanner component, which can be enabled in Form Modal or manually added.
- **Movies**: Introduced a new "Movies" module to the system.
- **Movies**: Implemented a search and import modal for fetching movie data from TMDB.
- **Movies**: Added full CRUD functionality for managing movie entries.
- **Movies**: Users can now attach ticket data to their movie entries.
- **Localization**: Completely reworked the locale manager to align with the latest locale folder architecture.

---

### 📌 **dev 25w08 (2/16/2025 - 2/22/2025)**

- **Guitar Tabs**: Fixed an issue where the "Sort By" selector text did not reflect the actual selected option.
- **Personalization**: Resolved a conflict where the neutral variant of gray was being overwritten by DaisyUI.
- **Moment Vault**: Introduced a new module for recording life events.
- **Moment Vault**: Users can now record life events as audio and optionally transcribe them to text using OpenAI Whisper.
- **API**: Began migrating API routes to a `controller + service` architecture for improved maintainability.
- **API**: Scrapped the initial test codebase and started rewriting all tests.
- **Code**: Upgraded `react-router` to version 7 for better routing performance and features.

---

### 📌 **dev 25w07 (2/9/2025 - 2/15/2025)**

- **Code**: Refactored the OTP screen, fixing a dark mode color inconsistency.

---

### 📌 **dev 25w06 (2/2/2025 - 2/8/2025)**

- **Code**: Rewrote the TailwindCSS color palette in the color picker to correctly convert colors from `oklch` back to `RGB`.
- **Mail Inbox**: Implemented bulk selection and deletion of mail entries.

---

### 📌 **dev 25w05 (1/26/2025 - 2/1/2025)**

- **Code**: Upgraded TailwindCSS to version 4.0 for enhanced styling capabilities.
- **Code**: Memoized all values passed into context providers to optimize performance.
- **Mail Inbox**: Completely overhauled the UI for a better user experience.
- **Mail Inbox**: Integrated Gmail synchronization, storing all emails in a custom database.
- **Mail Inbox**: Added a sidebar, search bar, and pagination for better navigation.
- **Mail Inbox**: Enabled users to view mail content directly within the UI.
- **Mail Inbox**: Implemented real-time email synchronization, automatically importing incoming emails into the database.
- **Code**: Upgraded Headless UI to its beta version with full TailwindCSS 4.0 support.
- **Sidebar**: Fixed an issue where icons would flash when navigating between routes.
- **UI**: Improved light mode consistency across components.
- **Code**: Added `react-compiler` to optimize UI performance.
- **Code**: Created reusable wrapper components for modules containing sub-sidebars.
- **Virtual Wardrobe**: Introduced a session cart for temporarily storing clothing sets before checkout and history logging.
- **Localization**: Revamped the folder structure for locale data, segmenting translations into separate namespaces.
- **Code**: Rewrote the utility function for currency formatting using `Intl.NumberFormat`.
- **Code**: Fixed pagination component mechanism bugs.
- **Code**: Refactored redundant code snippets into reusable components.
- **Localization**: Completed translations for previously untranslated sections.
- **Code**: Performed a major codebase refactor for better maintainability.
- **Spotify**: Completely removed the Spotify module from the system.
- **Code**: Added an ESLint plugin to enforce alphabetical sorting of component props.

---

### 📌 **dev 25w04 (1/19/2025 - 1/25/2025)**

- **Music**: Added spacebar hotkey support for starting and pausing music playback.
- **Code**: Upgraded all project dependencies to their latest versions.
- **Code**: Migrated from an older ESLint version to the latest release for improved linting rules and performance.
- **Code**: Performed a large-scale folder structure refactoring, reorganizing components into a structured `components` directory.
- **Code**: Removed unused dependencies from `package.json` to optimize project size.
- **Code**: Significantly refactored the `Button` component for improved maintainability and performance.
- **Passwords**: Implemented context providers to streamline state management and reduce redundant code.
- **Server Status**: Conducted an extensive code refactor to enhance efficiency and maintainability.
- **Virtual Wardrobe**: Introduced the Virtual Wardrobe module for managing clothing items.
- **Virtual Wardrobe**: Completed CRUD functionalities for wardrobe entries.
- **Virtual Wardrobe**: Added a sidebar to enable filtering options.
- **Code**: Moved routing and entry point files into the `core` directory for a clearer architectural structure.

---

### 📌 **dev 25w03 (1/12/2025 - 1/18/2025)**

- **UI**: Removed the header and relocated the profile button to the sidebar for a cleaner layout.
- **Wishlist**: Added a direct link button to visit product websites.
- **Code**: Refactored the "Go Back" button to use a reusable button component.
- **Code Time**: Fixed UI responsiveness issues.
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

### 📌 **dev 25w02 (1/5/2025 - 1/11/2025)**

- **Wallet**: Fixed an issue where financial reports displayed incorrect calculations across multiple years.
- **UI**: Reduced the header icon size for better adaptability on small screens.
- **Wishlist**: Improved responsiveness for a smoother mobile experience.
- **Code**: Updated `README.md` with the latest information and screenshots.
- **Module Tools**: Completely revamped the utility tool system.
- **Module Tools**: Added a help screen to guide users through features.
- **Module Tools**: Implemented multilingual support.
- **Module Tools**: Introduced the ability to list and delete modules dynamically.
- **Code**: Replaced the `tsx` runtime with `bun run` for improved build performance.
- **API**: Integrated OpenAI's GPT-4o-mini model and developed a `fetchOpenAI` utility function.
- **Code**: Modified build options to split Node modules into chunks during production builds for better performance.
- **OpenAI API Pricing**: Created a new module allowing users to view OpenAI API pricing directly within the system.
- **UI**: Reorganized module categories for a more intuitive user experience.
- **UI**: Fixed modal layering issues in the Pixabay search filter within the image picker modal.
- **UI**: Addressed minor light mode inconsistencies.

---

### 📌 **dev 25w01 (12/29/2024 - 1/4/2025)**

- **Code**: 🎉 Happy New Year! 🎉
- **Code**: Removed excessive and unused TailwindCSS classes to optimize stylesheets.
- **Code**: Enhanced type declarations for UI components for better TypeScript support.
- **Code**: Removed unused component props to streamline prop management.
- **Code**: Developed a reusable `Switch` component for toggling states.
- **Code**: Fixed pagination component bugs affecting navigation.
- **Code**: Renamed various component props to more intuitive names.
- **Code**: Renamed `APIComponentWithFallback` to `APIFallbackComponent` for better clarity.
- **Sidebar**: Refactored sidebar logic for improved maintainability.
- **Sidebar**: Enhanced type declarations for sidebar components.
- **UI**: Continued improvements to theme consistency across dark and light modes.
- **Dashboard**: Switched the previous quote API to AI-generated quotes for dynamic content.
- **Idea Box**: Resolved an issue with OG image aspect ratio inconsistencies.
- **UI**: Fixed multiple responsive UI issues.
- **Wallet**: Corrected text inconsistencies in sidebar buttons.
- **Code**: Upgraded TailwindCSS to its latest stable version.
- **UI**: Password input fields are now hidden by default and will only reveal content when users press and hold the eye button.
- **Code**: Fixed multiple bugs related to the image upload modal.
- **Code**: Added a file input option within the form modal component.
- **Code**: Upgraded PocketBase to its latest version for improved performance and stability.
- **Authentication**: Switched to using PocketBase’s built-in OTP feature, replacing the previous OTP implementation.
- **Idea Box**: Users can now add cover images to idea containers for better visual organization.
- **Idea Box**: Added a latest update timestamp display for image entries.
- **Idea Box**: Fixed an issue where moving ideas out of folders was not properly reflected in the UI.
- **Code**: Conducted a major code refactor to optimize performance and readability.
- **Sudoku**: Introduced a new module allowing users to generate and print Sudoku boards.
- **Idea Box**: Implemented a tagging system, enabling users to categorize ideas with custom tags.
- **Idea Box**: Added search functionality within idea containers and folders.
- **Idea Box**: Utilized context providers to streamline state management between components.
- **Journal**: Fixed image display and upload bugs.
- **Account**: Addressed UI responsiveness issues.
- **Wallet**: Increased the resolution of receipt images extracted from PDF files for better accuracy.

---

### 📌 dev 24w52 (12/22/2024 - 12/28/2024)

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

### 📌 dev 24w51 (12/15/2024 - 12/21/2024)

- **Code**: Fixed bugs on API status detection provider
- **Wallet**: Fixed minor bugs on route parameters

---

### 📌 dev 24w50 (12/8/2024 - 12/14/2024)

- **API Keys**: The time when each key is last updated will now be shown
- **Guitar Tabs**: Removed suspicious potential credentials left behind

---

### 📌 dev 24w49 (12/1/2024 - 12/7/2024)

- **Wishlist**: User can now paste a link of any shopee product and the system will automatically parse data using OCR
- **Code**: Changes made to components folder structure
- **Code**: Made image upload modal universal and reusable so that all modules can share the same
- **Dashboard**: Minor bug fixes to the display of Today's Event widget
- **Code**: Image upload modal can now also upload files
- **Journal**: Word count of each entry will now be shown in the entry list
- **UI**: Bug fixes on password input

---

### 📌 dev 24w48 (11/24/2024 - 11/30/2024)

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
- **Personalization**: User can now upload photo for their bg image, or enter URL that will then be downloaded by the system automatically, or find stock photos from Pixabay straightaway from inside the system
- **Airports**: Fixed bugs due to API route name changes
- **Idea Box**: Open-graph data for link entries will now be parsed and displayed instead of the bare URL
- **Server Status**: Added API env display showing whether it's in development or production environment
- **Guitar Tabs**: User can now star guitar tabs
- **UI**: Fixed minor user interface related bugs
- **Idea Box**: UI components in image upload modal is now styled in a more consistent way
- **Dashboard**: Fixed critical bugs related to colors in Code Time widget
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

### 📌 dev 24w47 (11/17/2024 - 11/23/2024)

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
- **Guitar Tabs**: Added module for user to download tabs straightaway from `https://www.guitarworld.com.cn/`

---

### 📌 dev 24w46 (11/10/2024 - 11/16/2024)

- **Journal**: Fixed bugs related to image displaying
- **Code**: Created reusable component for header filtering chips
- **Code**: Query parameters are now presented as URL hash to prevent page rerendering
- **UI**: Added a series of TailwindCSS color palette for user to choose from under the color picker
- **Books Library**: Ditched CalibreDB and migrated to using main database for storing book data
- **Books Library**: User can now explore library genesis in the system
- **Books Library**: User can now download books from libgen straightaway in the system
- **Books Library**: Basic CRUD function completed
- **Wallet**: Added calendar heatmap to the sidebar in transaction tab
- **Wallet**: User can now select date range in calendar heatmap in transaction tab
- **Code**: Minor code refactoring
- **Code**: Upgraded the model used by Groq to Llama 3.2

---

### 📌 dev 24w45 (11/3/2024 - 11/9/2024)

- **Code**: Moved all codebases from my own account into a specialized organization

---

### 📌 dev 24w44 (10/27/2024 - 11/2/2024)

- **API**: Removed useless typescript declarations

---

### 📌 dev 24w42 (10/13/2024 - 10/19/2024)

- **API**: Moved code from `app.ts` to `index.ts` to reduce redundancy
- **API**: Created `routes.ts` and moved all the module route declarations into it

---

### 📌 dev 24w41 (10/6/2024 - 10/12/2024)

- **Personalization**: Fixed UI responsiveness issue
- **UI**: Fixed minor light mode issue
- **API**: Implemented custom function to list all routes in the API
- **Dashboard**: Fixed date shifting error in Code Time chart widget
- **Wallet**: Money amounts are now hidden by default
- **API**: Started working on API integration test for each module
- **API**: Implemented mechanism to parse docs from JSDoc-like inline endpoint documentation inspired by Open API documentation standard
- **API**: Completely revamped the design API explorer, added a lot more information

---

### 📌 dev 24w39 (9/22/2024 - 9/28/2024)

- **Icon Selector**: Chip selector is now collapsed by default to prevent squeezing the height of the icon list
- **Icon Selector**: Some more code refactoring
- **Sidebar**: Some bug fixes on the subsection expand and collapse mechanism
- **Todo List**: User can now define their own set of priorities
- **Code**: Improved consistency of sidebar items inside individual module
- **Sidebar**: Refactored code for sidebar item
- **Code**: The `updateValue` props can now be passed in the set state action function straightaway
- **Code**: Migrated from using `yarn` to `bun` as package manager for the project

---

### 📌 dev 24w38 (9/15/2024 - 9/21/2024)

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

### 📌 dev 24w37 (9/8/2024 - 9/14/2024)

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

### 📌 dev 24w36 (9/1/2024 - 9/7/2024)

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

### 📌 dev 24w35 (8/25/2024 - 8/31/2024)

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
- **CFOP Algorithms**: Written the code required to render rubiks cube using ThreeJS
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

### 📌 dev 24w34 (8/18/2024 - 8/24/2024)

- **Code**: Started recovering after almost two months worth of data completely lost
- **Photos**: Fixed bugs where data failed to load properly when there is no photo entry records
- **UI**: Fixed some bottom margin issues
- **Airports**: Fixed runway scraping logics
- **Wallet**: User can now select between list view and table view in transaction page
- **Change Log**: Tried my best to recover almost two months' worth of change log entries by looking at each Git commits
- **Codetime**: Freed up a lot of space in database by revamping how the codetime entries are stored
- **Documentation**: Added steps for configuring `pdf-thumbnails` in backend config section

---

### 📌 dev 24w31 (7/28/2024 - 8/3/2024)

- **Code**: Updated HeadlessUI to the newest version
- **Code**: Migrated frontend hosting to Netlify cuz my Vercel quota exceeded
- **API**: Renamed all nouns to plural for better consistency
- **Wallet**: Integrated `react-virtualized` for virtualized list, leading to massive improvement in performance
- **API**: Migrated to Typescript!!!
- **API**: Created reusable functions for CRUD actions

---

### 📌 dev 24w30 (7/21/2024 - 7/27/2024)

- **Code**: Created custom hooks for getting hex code of current theme color
- **Guitar Tabs**: User can now choose between grid view and list view
- **Airports**: Massive code refactoring

---

### 📌 dev 24w29 (7/14/2024 - 7/20/2024)

- **Guitar Tabs**: User can now open guitar tab PDFs by clicking on the entry
- **Music List**: Integrated `react-virtualized` for virtualized list, leading to massive improvement in performance
- **Guitar Tabs**: Added empty state screen when there is no guitar tabs
- **Icon Selector**: Removed statically defined icon set categories and replaced it with dynamically generated one
- **Photos**: Changed how dimensions are acquired from images

---

### 📌 dev 24w27 (6/30/2024 - 7/6/2024)

- **Journal**: Completely revamped the way of writing journal, integrating AI to help summarize the journal
- **Journal**: Post-completion code refactoring done
- **Code**: Created reusable screen for creating password and lock screen
- **Wallet**: Created date range filter in transaction sidebar
- **Airports**: Added section to view radio frequencies of each airport
- **Books Library**: Refactored the code

---

### 📌 dev 24w26 (6/23/2024 - 6/29/2024)

- **Code**: A lot more code refactoring
- **Code**: No need to check if the data is actually the data instead of "loading" or "error" anymore every time when using `APIComponentWithFallback`
- **Projects (M)**: Started working on the Kanban board of each project
- **Projects (M)**: Used context provider to reduce code for transferring states among components
- **Airports**: Started working on this module for displaying airport data, just because I can
- **Changi Flight Status**: Created this module for displaying arrival and departure flights in Changi Airport, just because I can
- **Idea Box**: User can now straightaway paste image into the idea box
- **Journal**: Journals are now encrypted with password, just like the Password Vault
- **Photos**: Created archived gallery, but yet to implement password functionality

---

### 📌 dev 24w25 (6/16/2024 - 6/22/2024)

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

### 📌 dev 24w24 (6/9/2024 - 6/15/2024)

- **Code**: Upgraded Iconify to newest versio
- **Code**: Changed `w-x h-x` into `size-x` for better readability
- **UI**: Added icon for sidebar item indicating modules with AI integration
- **Todo List**: User can now add subtasks to individual tasks
- **Todo List**: User can now generate subtasks for each task using AI
- **Wallet**: Added utility class for converting number to money
- **Code**: Created import alias `@constants` for constant variables
- **Code**: Created reusable component `ListboxTransition`
- **Code**: Renamed all `@iconify/react/dist/iconify.js` imports to `@iconfiy/react`
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

### 📌 dev 24w23 (6/2/2024 - 6/8/2024)

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

### 📌 dev 24w22 (5/26/2024 - 6/1/2024)

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

### 📌 dev 24w21 (5/19/2024 - 5/25/2024)

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
- **Idea Box**: Idea that is created inside a folder will now stay in the foldrr
- **Calendar**: Fixed mini calendar date display problem in Safari
- **Change Log**: Mobile UI now looks better
- **Todo List**: Mobile sidebar z-index issue fixed
- **UI**: Sidebar header height inconsistency in mobile view fixed
- **UI**: Removed "Loading Data" text in loading screen
- **Server Status**: Removed gauge component since it causes huge performance issue on mobile
- **UI**: Mobile responsive view done for a lot of modules
- **Code**: Created import alias `@utils` for utility functions

---

### 📌 dev 24w20 (5/12/2024 - 5/18/2024)

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
- **Calendar**: There is now a dialog box for user to create event
- **UI**: Error message is now centered
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
- **Photos**: Albums are now sharable through the Public Portal
- **Photos**: Added modal to toggle visibility/publicity of album
- **Books Library**: Renamed Reference Books module to Books Library
- **Books Library**: Finished setting up local Calibre DB and linked the data in UI to it
- **Music**: Created this module
- **Music**: User can straightaway download music from Youtube or import from NAS
- **Music**: User can mark their music as favourites
- **UI**: Fixed some light mode background color issues
- **Music**: User can play, pause, play last, play next, play repeatedly, shuffle musics, etc. just like any other music player can do

---

### 📌 dev 24w19 (5/5/2024 - 5/11/2024)

- **Photos**: Removed sorting stuff from API to increase loading speed
- **Todo List**: Added date picker when creating task so user won't have to manually input anymore
- **Todo List**: Increased gap between tags in task item
- **Todo List**: Fixed problem in list counter
- **Todo List**: Tags counter is now working
- **Todo List**: Due date is not mandatory anymore
- **UI**: Made the description font size in empty state screen smaller
- **Todo List**: Used context provider to reduce code for transferring states among components
- **Todo List**: Sidebar task status number is now real
- **Todo List**: Sidebar task status selection button is now working
- **Todo List**: Overdue task will now be shown in red color
- **Todo List**: Tags count will now update correctly when task is deleted
- **Todo List**: Filtered tag and list will now show in the header

---

### 📌 dev 24w18 (4/28/2024 - 5/4/2024)

- **Photos**: Fixed bugs where user cannot remove photos from album
- **Photos**: Fixed bugs where user cannot bulk download photos
- **Photos**: User can now add tags to albums
- **Photos**: Renaming album will only reload the item renamed instead of the entire page
- **Photos**: Album photo gallery header is now visible when scrolling down
- **Photos**: Photo dimensions data will now load as asynchronous task to prevent request from not responding for too long.
- **API**: Deployed API to vercel
- **API**: Changed development host from `api.lifeforge.thecodeblog.net` to `dev.lifeforge.thecodeblog.net`
- **Todo List**: Empty state screen will now show when there is no task availabke

---

### 📌 dev 24w16 (4/14/2024 - 4/20/2024)

- **Code**: Refactored a lot of import statements by using aliases
- **Code**: Extracted all the type declaration code into a separate folder
- **Code**: Used ESlint to sort the import statements
- **Photos**: Deleting photos will not cause the entire gallery to reload anymore
- **Code**: Created utils folder for miscellaneous functions
- **Personalization**: Added selector for user to choose language to be used in the system
- **Dashboard**: Data for storage status and code time module is now real
- **API**: Prevented credentials from being sent through the API
- **Repositories**: Decided to integrate Gitea into the system for repositories and projects management
- **Repositories **: Completed setup for Gitea in the server
- **API**: Slightly redesigned the explorer page and added description for each endpoint
- **Repositories**: All the repos are now listed in the UI

---

### 📌 dev 24w15 (4/7/2024 - 4/13/2024)

- **Notes**: User is now able to view PDF files in the app itself.
- **Code**: Added `manifest.json` to the codebase and now LifeForge can become its own standalone app.
- **UI**: Fixed password input font size
- **UI**: Dashboard responsive fixed albeit still not working
- **Passwords**: Started working on the module
- **Passwords**: User can now create a master password in the UI that will soon be used to encrypt and decrypt the passwords stored in the vault.
- **Passwords**: Master password is hashed using Bcrypt function that cannot be decryped and can only be verified
- **Passwords**: User can now store passwords in the vault that will be encrypted using AES SHA256 with their master password
- **Passwords**: User can now view and copy their passwords through the UI
- **UI**: Changed font used in the UI to `Wix Madefor Font`
- **Authentication**: User can now login with biometric passkey.
- **API**: Changed codebase from being Common JS to ES Modules.
- **Authentication**: All the authentication logic is now done through the API. There is no direct connection between the front end and the database.
- **API**: Created asyncWrapper for handling errors and removed all the try catch blocks in each endpoint
- **Authentication**: Removed Github OAuth login for now

---

### 📌 dev 24w14 (3/31/2024 - 4/6/2024)

- **Flashcards**: Users are now able to paste bulk entries into flash card decks
- **API**: Split me and my brother's instances
- **Photos**: User is now able to mark photos as favourite

---

### 📌 dev 24w13 (3/24/2024 - 3/30/2024)

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

### 📌 dev 24w12 (3/17/2024 - 3/23/2024)

- **Todo List**: User can now create and modify task through UI
- **Code**: Used lazy loading to split large code base into chunks when production code is built.
- **Photos**: Updated logic bug when deleting photos
- **Personalization**: Added side margin to theme selector in mobile view
- **Todo List**: Fixed task overflow issue
- **Todo List**: Separated pending and completed tasks

---

### 📌 dev 24w11 (3/10/2024 - 3/16/2024)

- **Photos**: User can now remove photos from album through UI
- **Photos**: User can now rename photo albums
- **Photos**: Fixed album name overflow issue
- **Code**: Added ESLint to API code for cleaner code
- **Photos**: EVEN LARGER PERFORMANCE IMPROVEMENT: Images will now be fetched as needed (grouped by date)
- **Photos**: Fixed date arrangement bugs

---

### 📌 dev 24w10 (3/3/2024 - 3/9/2024)

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

### 📌 dev 24w09 (2/25/2024 - 3/2/2024)

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

### 📌 dev 24w07 (2/11/2024 - 2/17/2024)

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

### 📌 dev 24w06 (2/4/2024 - 2/10/2024)

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

### 📌 dev 24w05 (1/28/2024 - 2/3/2024)

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
- **Todo List**: Added priorites to sidebar
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

### 📌 dev 24w04 (1/21/2024 - 1/27/2024)

- **Sidebar**: Subsection items for notes module is now bounded to database
- **Icon Picker**: Changed the code logic to adhere to the new API data structure
- **Notes**: Notes subjects are categorized by workspaces
- **Notes**: Added modal to create, modify and delete subjects
- **Notes**: Added different icons for each file format

---

### 📌 dev 24w03 (1/14/2024 - 1/20/2024)

- **Bug fix**: Module sidebar's behaviour is now separated from the main sidebar.
- **Change Log**: Change log entries are now stored inside database and are loaded dynamically into the UI
- **Change Log**: UI improvements.

---

### 📌 dev 24w02 (1/7/2024 - 1/13/2024)

- **Personalization**: UI to change the theme and accent color of the application from the personalization page.
- **Personalization**: Added option to change the accent color of the application.
- **Personalization**: Personalization linked with the user account in database, so that the settings are synced across devices.
- **Sidebar**: Sidebar icons are colored based on the theme.
- **Code Snippets**: Data synced to database, no more dummy data.
- **Code Snippets**: Create, update, and delete labels and languages from the UI.
- **Code Snippets**: View snippets by clicking on the list entry.

---

### 📌 dev 24w01 (12/31/2023 - 1/6/2024)

- **Idea Box**: Containers and ideas data synced to database, no more dummy data.
- **Idea Box**: Create, update, and delete containers and ideas from the UI.
- **Idea Box**: Search containers and ideas.
- **Idea Box**: Zoom image by clicking on it.
- **Idea Box**: Pin ideas to the top.
- **Change Log**: Added this change log with the naming convention of `Ver. [year]w[week number]`
- **API**: Added API explorer at the root of the API.
- **API**: Integrated Code Time API into the main API.
- **UI**: Added backdrop blur when modals are open.
- **Code**: Moved API host into `.env ` file.

---
