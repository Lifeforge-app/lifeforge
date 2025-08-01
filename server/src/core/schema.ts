import flattenSchemas from '@functions/utils/flattenSchema'
import { z } from 'zod/v4'

export const SCHEMAS = {
  calendar: {
    events: z.object({
      title: z.string(),
      category: z.string(),
      calendar: z.string(),
      location: z.string(),
      location_coords: z.object({ lat: z.number(), lon: z.number() }),
      reference_link: z.string(),
      description: z.string(),
      type: z.enum(['single', 'recurring']),
      created: z.string(),
      updated: z.string()
    }),
    categories: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string()
    }),
    categories_aggregated: z.object({
      name: z.string(),
      icon: z.string(),
      color: z.string(),
      amount: z.number()
    }),
    calendars: z.object({
      name: z.string(),
      color: z.string()
    }),
    events_single: z.object({
      base_event: z.string(),
      start: z.string(),
      end: z.string()
    }),
    events_recurring: z.object({
      recurring_rule: z.string(),
      duration_amount: z.number(),
      duration_unit: z.enum(['hour', 'year', 'month', 'day', 'week']),
      exceptions: z.any(),
      base_event: z.string()
    })
  },
  achievements: {
    entries: z.object({
      title: z.string(),
      thoughts: z.string(),
      difficulty: z.enum(['easy', 'medium', 'hard', 'impossible']),
      created: z.string(),
      updated: z.string()
    })
  },
  passwords: {
    entries: z.object({
      name: z.string(),
      website: z.string(),
      username: z.string(),
      password: z.string(),
      icon: z.string(),
      color: z.string(),
      pinned: z.boolean(),
      created: z.string(),
      updated: z.string()
    })
  },
  moment_vault: {
    entries: z.object({
      type: z.enum(['text', 'audio', 'video', 'photos', '']),
      file: z.array(z.string()),
      content: z.string(),
      transcription: z.string(),
      created: z.string(),
      updated: z.string()
    })
  },
  blog: {
    entries: z.object({
      content: z.string(),
      title: z.string(),
      media: z.array(z.string()),
      excerpt: z.string(),
      visibility: z.enum(['private', 'public', 'unlisted', '']),
      featured_image: z.string(),
      labels: z.any(),
      category: z.string(),
      created: z.string(),
      updated: z.string()
    }),
    categories: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string()
    })
  },
  todo_list: {
    lists: z.object({
      name: z.string(),
      icon: z.string(),
      color: z.string()
    }),
    tags: z.object({
      name: z.string()
    }),
    entries: z.object({
      summary: z.string(),
      notes: z.string(),
      due_date: z.string(),
      due_date_has_time: z.boolean(),
      list: z.string(),
      tags: z.array(z.string()),
      priority: z.string(),
      done: z.boolean(),
      completed_at: z.string(),
      created: z.string(),
      updated: z.string()
    }),
    priorities: z.object({
      name: z.string(),
      color: z.string()
    }),
    lists_aggregated: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string(),
      amount: z.number()
    }),
    tags_aggregated: z.object({
      name: z.string(),
      amount: z.number()
    }),
    priorities_aggregated: z.object({
      name: z.string(),
      color: z.string(),
      amount: z.number()
    })
  },
  idea_box: {
    containers: z.object({
      icon: z.string(),
      color: z.string(),
      name: z.string(),
      cover: z.string()
    }),
    entries: z.object({
      type: z.enum(['text', 'image', 'link']),
      container: z.string(),
      folder: z.string(),
      pinned: z.boolean(),
      archived: z.boolean(),
      tags: z.any(),
      created: z.string(),
      updated: z.string()
    }),
    folders: z.object({
      container: z.string(),
      name: z.string(),
      color: z.string(),
      icon: z.string(),
      parent: z.string()
    }),
    tags: z.object({
      name: z.string(),
      icon: z.string(),
      color: z.string(),
      container: z.string()
    }),
    tags_aggregated: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string(),
      container: z.string(),
      amount: z.number()
    }),
    containers_aggregated: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string(),
      cover: z.string(),
      text_count: z.number(),
      link_count: z.number(),
      image_count: z.number()
    }),
    entries_text: z.object({
      base_entry: z.string(),
      content: z.string()
    }),
    entries_link: z.object({
      link: z.url(),
      base_entry: z.string()
    }),
    entries_image: z.object({
      image: z.string(),
      base_entry: z.string()
    })
  },
  railway_map: {
    lines: z.object({
      country: z.string(),
      type: z.string(),
      code: z.string(),
      name: z.string(),
      color: z.string(),
      ways: z.any(),
      map_paths: z.any()
    }),
    stations: z.object({
      name: z.string(),
      desc: z.string(),
      lines: z.array(z.string()),
      codes: z.any(),
      coords: z.any(),
      map_data: z.any(),
      type: z.string(),
      distances: z.any(),
      map_image: z.string()
    })
  },
  movies: {
    entries: z.object({
      tmdb_id: z.number(),
      title: z.string(),
      original_title: z.string(),
      poster: z.string(),
      genres: z.any(),
      duration: z.number(),
      overview: z.string(),
      countries: z.any(),
      language: z.string(),
      release_date: z.string(),
      watch_date: z.string(),
      ticket_number: z.string(),
      theatre_seat: z.string(),
      theatre_showtime: z.string(),
      theatre_location: z.string(),
      theatre_location_coords: z.object({ lat: z.number(), lon: z.number() }),
      theatre_number: z.string(),
      is_watched: z.boolean()
    })
  },
  wallet: {
    assets: z.object({
      name: z.string(),
      icon: z.string(),
      starting_balance: z.number()
    }),
    ledgers: z.object({
      name: z.string(),
      icon: z.string(),
      color: z.string()
    }),
    categories: z.object({
      name: z.string(),
      icon: z.string(),
      color: z.string(),
      type: z.enum(['income', 'expenses'])
    }),
    transactions: z.object({
      type: z.enum(['transfer', 'income_expenses']),
      amount: z.number(),
      date: z.string(),
      receipt: z.string(),
      created: z.string(),
      updated: z.string()
    }),
    categories_aggregated: z.object({
      type: z.enum(['income', 'expenses']),
      name: z.string(),
      icon: z.string(),
      color: z.string(),
      amount: z.number()
    }),
    assets_aggregated: z.object({
      name: z.string(),
      icon: z.string(),
      starting_balance: z.number(),
      transaction_count: z.number(),
      current_balance: z.any()
    }),
    ledgers_aggregated: z.object({
      name: z.string(),
      color: z.string(),
      icon: z.string(),
      amount: z.number()
    }),
    transaction_types_aggregated: z.object({
      name: z.any(),
      transaction_count: z.number(),
      accumulated_amount: z.any()
    }),
    transactions_income_expenses: z.object({
      base_transaction: z.string(),
      type: z.enum(['income', 'expenses']),
      particulars: z.string(),
      asset: z.string(),
      category: z.string(),
      ledgers: z.array(z.string()),
      location_name: z.string(),
      location_coords: z.object({ lat: z.number(), lon: z.number() })
    }),
    transactions_transfer: z.object({
      base_transaction: z.string(),
      from: z.string(),
      to: z.string()
    })
  },
  books_library: {
    collections: z.object({
      name: z.string(),
      icon: z.string()
    }),
    languages: z.object({
      name: z.string(),
      icon: z.string()
    }),
    entries: z.object({
      title: z.string(),
      authors: z.string(),
      md5: z.string(),
      year_published: z.number(),
      publisher: z.string(),
      languages: z.array(z.string()),
      collection: z.string(),
      extension: z.string(),
      edition: z.string(),
      size: z.number(),
      isbn: z.string(),
      file: z.string(),
      thumbnail: z.string(),
      is_favourite: z.boolean(),
      is_read: z.boolean(),
      time_finished: z.string(),
      created: z.string(),
      updated: z.string()
    }),
    file_types: z.object({
      name: z.string()
    }),
    file_types_aggregated: z.object({
      name: z.string(),
      amount: z.number()
    }),
    languages_aggregated: z.object({
      name: z.string(),
      icon: z.string(),
      amount: z.number()
    }),
    collections_aggregated: z.object({
      name: z.string(),
      icon: z.string(),
      amount: z.number()
    })
  },
  scores_library: {
    entries: z.object({
      name: z.string(),
      type: z.string(),
      pageCount: z.string(),
      thumbnail: z.string(),
      author: z.string(),
      pdf: z.string(),
      audio: z.string(),
      musescore: z.string(),
      isFavourite: z.boolean(),
      created: z.string(),
      updated: z.string()
    }),
    authors_aggregated: z.object({
      name: z.string(),
      amount: z.number()
    }),
    types: z.object({
      name: z.string(),
      icon: z.string()
    }),
    types_aggregated: z.object({
      name: z.string(),
      icon: z.string(),
      amount: z.number()
    })
  },
  code_time: {
    projects: z.object({
      name: z.string(),
      duration: z.number()
    }),
    languages: z.object({
      name: z.string(),
      icon: z.string(),
      color: z.string(),
      duration: z.number()
    }),
    daily_entries: z.object({
      date: z.string(),
      relative_files: z.any(),
      projects: z.any(),
      total_minutes: z.number(),
      last_timestamp: z.number(),
      languages: z.any(),
      created: z.string(),
      updated: z.string()
    })
  },
  wishlist: {
    lists: z.object({
      name: z.string(),
      description: z.string(),
      color: z.string(),
      icon: z.string()
    }),
    entries: z.object({
      name: z.string(),
      url: z.string(),
      price: z.number(),
      image: z.string(),
      list: z.string(),
      bought: z.boolean(),
      bought_at: z.string(),
      created: z.string(),
      updated: z.string()
    }),
    lists_aggregated: z.object({
      name: z.string(),
      description: z.string(),
      color: z.string(),
      icon: z.string(),
      total_count: z.number(),
      total_amount: z.any(),
      bought_count: z.number(),
      bought_amount: z.any()
    })
  },
  api_keys: {
    entries: z.object({
      keyId: z.string(),
      name: z.string(),
      description: z.string(),
      icon: z.string(),
      key: z.string(),
      created: z.string(),
      updated: z.string()
    })
  },
  users: {
    users: z.object({
      password: z.string(),
      tokenKey: z.string(),
      email: z.email(),
      emailVisibility: z.boolean(),
      verified: z.boolean(),
      username: z.string(),
      name: z.string(),
      avatar: z.string(),
      dateOfBirth: z.string(),
      theme: z.enum(['system', 'light', 'dark']),
      color: z.string(),
      bgTemp: z.string(),
      bgImage: z.string(),
      backdropFilters: z.any(),
      fontFamily: z.string(),
      language: z.enum(['zh-CN', 'en', 'ms', 'zh-TW', '']),
      moduleConfigs: z.any(),
      enabledModules: z.any(),
      dashboardLayout: z.any(),
      spotifyAccessToken: z.string(),
      spotifyRefreshToken: z.string(),
      spotifyTokenExpires: z.string(),
      masterPasswordHash: z.string(),
      journalMasterPasswordHash: z.string(),
      APIKeysMasterPasswordHash: z.string(),
      twoFASecret: z.string(),
      created: z.string(),
      updated: z.string()
    })
  }
}

const COLLECTION_SCHEMAS = flattenSchemas(SCHEMAS)

export default COLLECTION_SCHEMAS
