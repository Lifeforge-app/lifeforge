import flattenSchemas from '@functions/utils/flattenSchema'
import { z } from 'zod/v4'

export const SCHEMAS = {
  music: {
    entries: z.object({
      name: z.string().describe('The name/title of the music track'),
      duration: z
        .string()
        .describe('The duration of the music track in seconds'),
      author: z.string().describe('The artist/composer of the music track'),
      file: z.string().describe('The filename or path to the audio file'),
      is_favourite: z
        .boolean()
        .describe('Whether this music track is marked as a favourite')
    })
  },
  calendar: {
    events: z.object({
      title: z.string().describe('The title or name of the calendar event'),
      category: z.string().describe('The category that this event belongs to'),
      calendar: z.string().describe('The calendar collection this event belongs to'),
      location: z.string().describe('The physical location where the event takes place'),
      location_coords: z
        .object({ lat: z.number(), lon: z.number() })
        .describe('Geographic coordinates (latitude/longitude) of the event location'),
      reference_link: z
        .string()
        .describe(
          'External reference URL or internal app link related to this event'
        ),
      description: z
        .string()
        .describe('Detailed description of the event (supports Markdown formatting)'),
      type: z
        .enum(['single', 'recurring'])
        .describe(
          'Event type: single occurrence or recurring pattern'
        ),
      created: z.string().describe('ISO timestamp when the event was created'),
      updated: z
        .string()
        .describe('ISO timestamp when the event was last modified')
    }),
    categories: z.object({
      name: z.string().describe('Display name of the event category'),
      color: z.string().describe('Hex color code for the category'),
      icon: z.string().describe('Icon identifier for the category')
    }),
    categories_aggregated: z.object({
      name: z.string().describe('Display name of the event category'),
      icon: z.string().describe('Icon identifier for the category'),
      color: z.string().describe('Hex color code for the category'),
      amount: z.number().describe('Total number of events in this category')
    }),
    calendars: z.object({
      name: z.string().describe('Display name of the calendar collection'),
      color: z.string().describe('Hex color code for the calendar')
    }),
    events_single: z.object({
      base_event: z.string().describe('Reference ID to the base event record'),
      start: z.string().describe('ISO timestamp when the event starts'),
      end: z.string().describe('ISO timestamp when the event ends')
    }),
    events_recurring: z.object({
      recurring_rule: z
        .string()
        .describe('RFC 5545 RRule specification for event recurrence'),
      duration_amount: z.number().describe('Numeric duration of each event occurrence'),
      duration_unit: z
        .enum(['hour', 'year', 'month', 'day', 'week'])
        .describe('Time unit for the duration amount'),
      exceptions: z.any().describe('List of dates to exclude from the recurring pattern'),
      base_event: z
        .string()
        .describe('Reference ID to the base event record')
    })
  },
  achievements: {
    entries: z.object({
      title: z.string().describe('The name or title of the achievement'),
      thoughts: z.string().describe('Personal reflections or notes about completing this achievement'),
      difficulty: z
        .enum(['easy', 'medium', 'hard', 'impossible'])
        .describe('Subjective difficulty rating for accomplishing this achievement'),
      created: z.string().describe('ISO timestamp when the achievement was created'),
      updated: z.string().describe('ISO timestamp when the achievement was last modified')
    })
  },
  passwords: {
    entries: z.object({
      name: z.string().describe('Display name or label for this password entry'),
      website: z.string().describe('Website URL or domain this password is for'),
      username: z.string().describe('Username or email for the account'),
      password: z.string().describe('Encrypted password for the account'),
      icon: z.string().describe('Icon identifier for visual recognition'),
      color: z.string().describe('Hex color code for visual theming'),
      pinned: z.boolean().describe('Whether this entry is pinned to the top of lists'),
      created: z.string().describe('ISO timestamp when the password entry was created'),
      updated: z
        .string()
        .describe('ISO timestamp when the password entry was last modified')
    })
  },
  moment_vault: {
    entries: z.object({
      type: z
        .enum(['text', 'audio', 'video', 'photos', ''])
        .describe('Content type of this moment entry'),
      file: z.array(
        z.string().describe('File paths to media files associated with this moment')
      ),
      content: z
        .string()
        .describe('Plain text content or description of the moment'),
      transcription: z
        .string()
        .describe('Auto-generated text transcription of audio content'),
      created: z.string().describe('ISO timestamp when the moment was captured'),
      updated: z.string().describe('ISO timestamp when the moment was last modified')
    })
  },
  blog: {
    entries: z.object({
      content: z.string().describe('Main content body of the blog post (Markdown supported)'),
      title: z.string().describe('The title or headline of the blog post'),
      media: z.array(z.string().describe('File paths to images or media embedded in the post')),
      excerpt: z.string().describe('Brief summary or preview text for the blog post'),
      visibility: z
        .enum(['private', 'public', 'unlisted', ''])
        .describe('Publication status: private (author only), public (visible to all), or unlisted (accessible via direct link)'),
      featured_image: z
        .string()
        .describe('File path to the main thumbnail/hero image for the post'),
      labels: z.any().describe('Array of tags or labels associated with the post'),
      category: z.string().describe('Reference ID to the blog category'),
      created: z.string().describe('ISO timestamp when the blog post was created'),
      updated: z.string().describe('ISO timestamp when the blog post was last modified')
    }),
    categories: z.object({
      name: z.string().describe('Display name of the blog category'),
      color: z.string().describe('Hex color code for the category'),
      icon: z.string().describe('Icon identifier for the category')
    })
  },
  todo_list: {
    lists: z.object({
      name: z.string().describe('Display name of the todo list'),
      icon: z.string().describe('Icon identifier for the list'),
      color: z.string().describe('Hex color code for the list theme')
    }),
    tags: z.object({
      name: z.string().describe('Display name of the tag for categorizing todos')
    }),
    entries: z.object({
      summary: z.string().describe('Brief title or description of the todo task'),
      notes: z.string().describe('Additional details or notes about the task'),
      due_date: z.string().describe('ISO date when the task should be completed'),
      due_date_has_time: z
        .boolean()
        .describe('Whether the due date includes a specific time or is date-only'),
      list: z.string().describe('Reference ID to the todo list this entry belongs to'),
      tags: z
        .array(z.string())
        .describe('Array of tag IDs associated with this todo'),
      priority: z.string().describe('Reference ID to the priority level'),
      done: z.boolean().describe('Whether the todo task has been completed'),
      completed_at: z
        .string()
        .describe('ISO timestamp when the task was marked as complete'),
      created: z.string().describe('ISO timestamp when the todo was created'),
      updated: z.string().describe('ISO timestamp when the todo was last modified')
    }),
    priorities: z.object({
      name: z.string().describe('Display name of the priority level (e.g., High, Medium, Low)'),
      color: z.string().describe('Hex color code for the priority level')
    }),
    lists_aggregated: z.object({
      name: z.string().describe('Display name of the todo list'),
      color: z.string().describe('Hex color code for the list theme'),
      icon: z.string().describe('Icon identifier for the list'),
      amount: z.number().describe('Total number of todo entries in this list')
    }),
    tags_aggregated: z.object({
      name: z.string().describe('Display name of the tag'),
      amount: z.number().describe('Total number of todos using this tag')
    }),
    priorities_aggregated: z.object({
      name: z.string().describe('Display name of the priority level'),
      color: z.string().describe('Hex color code for the priority level'),
      amount: z.number().describe('Total number of todos with this priority')
    })
  },
  idea_box: {
    containers: z.object({
      icon: z.string().describe('Icon identifier for the idea container'),
      color: z.string().describe('Hex color code for the container theme'),
      name: z.string().describe('Display name of the idea container'),
      cover: z.string().describe('File path to the cover image for the container')
    }),
    entries: z.object({
      type: z.enum(['text', 'image', 'link']).describe('Content type of the idea entry'),
      container: z.string().describe('Reference ID to the container this idea belongs to'),
      folder: z.string().describe('Reference ID to the folder within the container'),
      pinned: z.boolean().describe('Whether this idea is pinned to the top'),
      archived: z.boolean().describe('Whether this idea has been archived'),
      tags: z.any().describe('Array of tag IDs associated with this idea'),
      created: z.string().describe('ISO timestamp when the idea was created'),
      updated: z.string().describe('ISO timestamp when the idea was last modified')
    }),
    folders: z.object({
      container: z.string().describe('Reference ID to the container this folder belongs to'),
      name: z.string().describe('Display name of the folder'),
      color: z.string().describe('Hex color code for the folder'),
      icon: z.string().describe('Icon identifier for the folder'),
      parent: z.string().describe('Reference ID to the parent folder (for nested folders)')
    }),
    tags: z.object({
      name: z.string().describe('Display name of the tag'),
      icon: z.string().describe('Icon identifier for the tag'),
      color: z.string().describe('Hex color code for the tag'),
      container: z.string().describe('Reference ID to the container this tag belongs to')
    }),
    tags_aggregated: z.object({
      name: z.string().describe('Display name of the tag'),
      color: z.string().describe('Hex color code for the tag'),
      icon: z.string().describe('Icon identifier for the tag'),
      container: z.string().describe('Reference ID to the container this tag belongs to'),
      amount: z.number().describe('Total number of ideas using this tag')
    }),
    containers_aggregated: z.object({
      name: z.string().describe('Display name of the container'),
      color: z.string().describe('Hex color code for the container theme'),
      icon: z.string().describe('Icon identifier for the container'),
      cover: z.string().describe('File path to the cover image'),
      text_count: z
        .number()
        .describe('Number of text-based ideas in this container'),
      link_count: z
        .number()
        .describe('Number of link-based ideas in this container'),
      image_count: z
        .number()
        .describe('Number of image-based ideas in this container')
    }),
    entries_text: z.object({
      base_entry: z.string().describe('Reference ID to the base idea entry'),
      content: z.string().describe('Text content of the idea (Markdown supported)')
    }),
    entries_link: z.object({
      link: z.url().describe('URL of the linked resource'),
      base_entry: z.string().describe('Reference ID to the base idea entry')
    }),
    entries_image: z.object({
      image: z.string().describe('File path to the uploaded image'),
      base_entry: z.string().describe('Reference ID to the base idea entry')
    })
  },
  railway_map: {
    lines: z.object({
      country: z.string().describe('Country where the railway line is located'),
      type: z.string().describe('Type of railway line (e.g., metro, subway, light rail)'),
      code: z.string().describe('Official code or identifier for the line'),
      name: z.string().describe('Official name of the railway line'),
      color: z.string().describe('Brand color associated with the line'),
      ways: z.any().describe('Geometric path data for the railway route'),
      map_paths: z.any().describe('Visual map rendering data for the line')
    }),
    stations: z.object({
      name: z.string().describe('Official name of the railway station'),
      desc: z.string().describe('Additional description or details about the station'),
      lines: z.array(z.string()).describe('Array of line IDs that serve this station'),
      codes: z.any().describe('Station codes or identifiers across different systems'),
      coords: z.any().describe('Geographic coordinates of the station'),
      map_data: z.any().describe('Visual positioning data for map rendering'),
      type: z.string().describe('Type of station (e.g., interchange, terminal, regular)'),
      distances: z.any().describe('Distance measurements to other stations'),
      map_image: z.string().describe('File path to station map or layout image')
    })
  },
  movies: {
    entries: z.object({
      tmdb_id: z.number().describe('The Movie Database (TMDB) unique identifier'),
      title: z.string().describe('Display title of the movie'),
      original_title: z.string().describe('Original title in the native language'),
      poster: z.string().describe('File path or URL to the movie poster image'),
      genres: z.any().describe('Array of genre categories for the movie'),
      duration: z.number().describe('Runtime of the movie in minutes'),
      overview: z.string().describe('Plot synopsis or description of the movie'),
      countries: z.any().describe('Array of countries involved in production'),
      language: z.string().describe('Primary language of the movie'),
      release_date: z.string().describe('ISO date when the movie was released'),
      watch_date: z.string().describe('ISO date when you watched the movie'),
      ticket_number: z.string().describe('Theater ticket number or reference'),
      theatre_seat: z.string().describe('Seat number or location in the theater'),
      theatre_showtime: z
        .string()
        .describe('Showtime when you watched the movie'),
      theatre_location: z
        .string()
        .describe('Name or address of the theater'),
      theatre_location_coords: z
        .object({ lat: z.number(), lon: z.number() })
        .describe('Geographic coordinates of the theater'),
      theatre_number: z.string().describe('Theater or screen number'),
      is_watched: z.boolean().describe('Whether you have watched this movie')
    })
  },
  wallet: {
    assets: z.object({
      name: z.string().describe('Display name of the financial asset (e.g., bank account, cash, card)'),
      icon: z.string().describe('Icon identifier for the asset'),
      starting_balance: z.number().describe('Initial balance when the asset was added')
    }),
    ledgers: z.object({
      name: z.string().describe('Display name of the ledger for grouping transactions'),
      icon: z.string().describe('Icon identifier for the ledger'),
      color: z.string().describe('Hex color code for the ledger theme')
    }),
    categories: z.object({
      name: z.string().describe('Display name of the transaction category'),
      icon: z.string().describe('Icon identifier for the category'),
      color: z.string().describe('Hex color code for the category'),
      type: z.enum(['income', 'expenses']).describe('Whether this category represents income or expenses')
    }),
    transactions: z.object({
      type: z
        .enum(['transfer', 'income_expenses'])
        .describe('Transaction type: money transfer between assets or income/expense transaction'),
      amount: z.number().describe('Transaction amount (positive for income, negative for expenses)'),
      date: z.string().describe('ISO date when the transaction occurred'),
      receipt: z.string().describe('File path to receipt image or document'),
      created: z.string().describe('ISO timestamp when the transaction record was created'),
      updated: z.string().describe('ISO timestamp when the transaction was last modified')
    }),
    categories_aggregated: z.object({
      type: z.enum(['income', 'expenses']).describe('Category type: income or expenses'),
      name: z.string().describe('Display name of the category'),
      icon: z.string().describe('Icon identifier for the category'),
      color: z.string().describe('Hex color code for the category'),
      amount: z.number().describe('Total amount across all transactions in this category')
    }),
    assets_aggregated: z.object({
      name: z.string().describe('Display name of the asset'),
      icon: z.string().describe('Icon identifier for the asset'),
      starting_balance: z
        .number()
        .describe('Initial balance when the asset was created'),
      transaction_count: z
        .number()
        .describe('Total number of transactions involving this asset'),
      current_balance: z.any().describe('Current calculated balance of the asset')
    }),
    ledgers_aggregated: z.object({
      name: z.string().describe('Display name of the ledger'),
      color: z.string().describe('Hex color code for the ledger'),
      icon: z.string().describe('Icon identifier for the ledger'),
      amount: z.number().describe('Total amount across all transactions in this ledger')
    }),
    transaction_types_aggregated: z.object({
      name: z.any().describe('Display name of the transaction type'),
      transaction_count: z
        .number()
        .describe('Number of transactions of this type'),
      accumulated_amount: z
        .any()
        .describe('Total accumulated amount for this transaction type')
    }),
    transactions_income_expenses: z.object({
      base_transaction: z.string().describe('Reference ID to the base transaction record'),
      type: z
        .enum(['income', 'expenses'])
        .describe('Whether this is an income or expense transaction'),
      particulars: z.string().describe('Description or notes about the transaction'),
      asset: z.string().describe('Reference ID to the asset involved'),
      category: z.string().describe('Reference ID to the transaction category'),
      ledgers: z
        .array(z.string())
        .describe('Array of ledger IDs this transaction is associated with'),
      location_name: z
        .string()
        .describe('Name or description of where the transaction occurred'),
      location_coords: z
        .object({ lat: z.number(), lon: z.number() })
        .describe('Geographic coordinates where the transaction occurred')
    }),
    transactions_transfer: z.object({
      base_transaction: z.string().describe('Reference ID to the base transaction record'),
      from: z.string().describe('Reference ID to the source asset'),
      to: z.string().describe('Reference ID to the destination asset')
    }),
    transaction_templates: z.object({
      name: z.string().describe('Display name for this reusable transaction template'),
      type: z
        .enum(['income', 'expenses'])
        .describe('Transaction type for this template'),
      amount: z.number().describe('Default amount for transactions created from this template'),
      particulars: z
        .string()
        .describe('Default description for transactions created from this template'),
      asset: z
        .string()
        .describe('Default asset ID for transactions created from this template'),
      category: z.string().describe('Default category ID for transactions created from this template'),
      ledgers: z
        .array(z.string())
        .describe('Default ledger IDs for transactions created from this template'),
      location_name: z
        .string()
        .describe('Default location name for transactions created from this template'),
      location_coords: z
        .object({ lat: z.number(), lon: z.number() })
        .describe('Default location coordinates for transactions created from this template')
    })
  },
  books_library: {
    collections: z.object({
      name: z.string().describe('Display name of the book collection or series'),
      icon: z.string().describe('Icon identifier for the collection')
    }),
    languages: z.object({
      name: z.string().describe('Language name (e.g., English, Spanish, French)'),
      icon: z.string().describe('Icon identifier or flag for the language')
    }),
    entries: z.object({
      title: z.string().describe('Title of the book'),
      authors: z.string().describe('Author name(s) of the book'),
      md5: z.string().describe('MD5 hash of the book file for deduplication'),
      year_published: z.number().describe('Year the book was originally published'),
      publisher: z.string().describe('Publishing company or organization'),
      languages: z.array(z.string()).describe('Array of language IDs the book is available in'),
      collection: z.string().describe('Reference ID to the collection this book belongs to'),
      extension: z.string().describe('File format extension (e.g., pdf, epub, mobi)'),
      edition: z.string().describe('Edition information (e.g., "1st Edition", "Revised")'),
      size: z.number().describe('File size in bytes'),
      isbn: z.string().describe('International Standard Book Number'),
      file: z.string().describe('File path to the book document'),
      thumbnail: z.string().describe('File path to the book cover image'),
      is_favourite: z.boolean().describe('Whether this book is marked as a favourite'),
      is_read: z.boolean().describe('Whether this book has been completely read'),
      time_finished: z.string().describe('ISO timestamp when the book was finished reading'),
      created: z.string().describe('ISO timestamp when the book was added to library'),
      updated: z.string().describe('ISO timestamp when the book record was last modified')
    }),
    file_types: z.object({
      name: z.string().describe('File format name (e.g., PDF, EPUB, MOBI)')
    }),
    file_types_aggregated: z.object({
      name: z.string().describe('File format name'),
      amount: z.number().describe('Number of books in this file format')
    }),
    languages_aggregated: z.object({
      name: z.string().describe('Language name'),
      icon: z.string().describe('Icon identifier for the language'),
      amount: z.number().describe('Number of books available in this language')
    }),
    collections_aggregated: z.object({
      name: z.string().describe('Collection name'),
      icon: z.string().describe('Icon identifier for the collection'),
      amount: z.number().describe('Number of books in this collection')
    })
  },
  scores_library: {
    entries: z.object({
      name: z.string().describe('Title of the musical score or composition'),
      type: z.string().describe('Type of musical score (e.g., sheet music, tablature, chord chart)'),
      pageCount: z.string().describe('Number of pages in the score'),
      thumbnail: z.string().describe('File path to the score preview image'),
      author: z.string().describe('Composer or arranger of the musical piece'),
      pdf: z.string().describe('File path to the PDF score document'),
      audio: z.string().describe('File path to audio recording or playback'),
      musescore: z.string().describe('File path to MuseScore project file'),
      isFavourite: z.boolean().describe('Whether this score is marked as a favourite'),
      collection: z.string().describe('Reference ID to the collection this score belongs to'),
      guitar_world_id: z.number().describe('External identifier from Guitar World database'),
      created: z.string().describe('ISO timestamp when the score was added'),
      updated: z.string().describe('ISO timestamp when the score was last modified')
    }),
    authors_aggregated: z.object({
      name: z.string().describe('Composer or author name'),
      amount: z.number().describe('Number of scores by this author in the library')
    }),
    types: z.object({
      name: z.string().describe('Display name of the score type'),
      icon: z.string().describe('Icon identifier for the score type')
    }),
    types_aggregated: z.object({
      name: z.string().describe('Score type name'),
      icon: z.string().describe('Icon identifier for the score type'),
      amount: z.number().describe('Number of scores of this type')
    }),
    collections: z.object({
      name: z.string().describe('Display name of the score collection')
    }),
    collections_aggregated: z.object({
      name: z.string().describe('Collection name'),
      amount: z.number().describe('Number of scores in this collection')
    })
  },
  code_time: {
    projects: z.object({
      name: z.string().describe('Name of the coding project or repository'),
      duration: z.number().describe('Total time spent coding on this project (in minutes)')
    }),
    languages: z.object({
      name: z.string().describe('Programming language name (e.g., JavaScript, Python, TypeScript)'),
      icon: z.string().describe('Icon identifier for the programming language'),
      color: z.string().describe('Brand color associated with the programming language'),
      duration: z.number().describe('Total time spent coding in this language (in minutes)')
    }),
    daily_entries: z.object({
      date: z.string().describe('ISO date for this coding session'),
      relative_files: z.any().describe('Files worked on during this session with relative paths'),
      projects: z.any().describe('Projects worked on during this session'),
      total_minutes: z.number().describe('Total coding time for this day in minutes'),
      last_timestamp: z.number().describe('Unix timestamp of the last recorded activity'),
      languages: z.any().describe('Programming languages used during this session'),
      created: z.string().describe('ISO timestamp when this entry was created'),
      updated: z.string().describe('ISO timestamp when this entry was last updated')
    })
  },
  wishlist: {
    lists: z.object({
      name: z.string().describe('Display name of the wishlist'),
      description: z.string().describe('Optional description of what this wishlist is for'),
      color: z.string().describe('Hex color code for the wishlist theme'),
      icon: z.string().describe('Icon identifier for the wishlist')
    }),
    entries: z.object({
      name: z.string().describe('Name or title of the wished item'),
      url: z.string().describe('Product URL or link to where the item can be purchased'),
      price: z.number().describe('Current or estimated price of the item'),
      image: z.string().describe('File path or URL to product image'),
      list: z.string().describe('Reference ID to the wishlist this item belongs to'),
      bought: z.boolean().describe('Whether this item has been purchased'),
      bought_at: z.string().describe('ISO timestamp when the item was purchased'),
      created: z.string().describe('ISO timestamp when the item was added to wishlist'),
      updated: z.string().describe('ISO timestamp when the item was last modified')
    }),
    lists_aggregated: z.object({
      name: z.string().describe('Wishlist name'),
      description: z.string().describe('Wishlist description'),
      color: z.string().describe('Hex color code for the wishlist'),
      icon: z.string().describe('Icon identifier for the wishlist'),
      total_count: z
        .number()
        .describe('Total number of items in this wishlist'),
      total_amount: z.any().describe('Total monetary value of all items in this wishlist'),
      bought_count: z
        .number()
        .describe('Number of items that have been purchased'),
      bought_amount: z
        .any()
        .describe('Total monetary value of purchased items')
    })
  },
  api_keys: {
    entries: z.object({
      keyId: z.string().describe('Unique identifier for the API key entry'),
      name: z.string().describe('Display name or label for the API key'),
      description: z.string().describe('Notes about what this API key is used for'),
      icon: z.string().describe('Icon identifier for the service or API'),
      key: z.string().describe('The encrypted/secured API key value'),
      created: z.string().describe('ISO timestamp when the API key was stored'),
      updated: z.string().describe('ISO timestamp when the API key was last modified')
    })
  },
  users: {
    users: z.object({
      password: z.string().describe('Hashed password for user authentication'),
      tokenKey: z.string().describe('Authentication token key for session management'),
      email: z.email().describe('User email address for login and notifications'),
      emailVisibility: z.boolean().describe('Whether the email is visible to other users'),
      verified: z.boolean().describe('Whether the email address has been verified'),
      username: z.string().describe('Unique username for the user account'),
      name: z.string().describe('Display name or full name of the user'),
      avatar: z.string().describe('File path to user profile picture'),
      dateOfBirth: z.string().describe('ISO date of the user\'s birth date'),
      theme: z
        .enum(['system', 'light', 'dark'])
        .describe('UI theme preference: system default, light mode, or dark mode'),
      color: z.string().describe('User\'s preferred accent color for UI theming'),
      bgTemp: z.string().describe('Background temperature setting for UI ambience'),
      bgImage: z.string().describe('File path to custom background image'),
      backdropFilters: z.any().describe('Visual filter settings for background elements'),
      fontFamily: z.string().describe('Preferred font family for UI text'),
      language: z
        .enum(['zh-CN', 'en', 'ms', 'zh-TW', ''])
        .describe('User interface language preference'),
      moduleConfigs: z.any().describe('Configuration settings for individual app modules'),
      enabledModules: z.any().describe('Array of module names that are enabled for this user'),
      dashboardLayout: z.any().describe('Custom layout configuration for the dashboard'),
      spotifyAccessToken: z
        .string()
        .describe('OAuth access token for Spotify integration'),
      spotifyRefreshToken: z
        .string()
        .describe('OAuth refresh token for Spotify integration'),
      spotifyTokenExpires: z
        .string()
        .describe('ISO timestamp when the Spotify token expires'),
      masterPasswordHash: z
        .string()
        .describe('Hashed master password for password manager encryption'),
      journalMasterPasswordHash: z
        .string()
        .describe('Hashed master password for journal encryption'),
      APIKeysMasterPasswordHash: z
        .string()
        .describe('Hashed master password for API keys encryption'),
      twoFASecret: z.string().describe('Secret key for two-factor authentication'),
      fontScale: z.number().describe('Font size scaling factor for accessibility'),
      created: z.string().describe('ISO timestamp when the user account was created'),
      updated: z.string().describe('ISO timestamp when the user account was last updated')
    })
  }
}

const COLLECTION_SCHEMAS = flattenSchemas(SCHEMAS)

export default COLLECTION_SCHEMAS
