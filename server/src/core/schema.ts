import flattenSchemas from '@functions/utils/flattenSchema'

export const SCHEMAS = {
  users: (await import('@lib/user/schema')).default,
  todo_list: (await import('@lib/todoList/schema')).default,
  code_time: (await import('@lib/codeTime/schema')).default,
  idea_box: (await import('@lib/ideaBox/schema')).default,
  passwords: (await import('@lib/passwords/schema')).default,
  journal: (await import('@lib/journal/schema')).default,
  calendar: (await import('@lib/calendar/schema')).default,
  music: (await import('@lib/music/schema')).default,
  achievements: (await import('@lib/achievements/server/schema')).default,
  wallet: (await import('@lib/wallet/server/schema')).default,
  scores_library: (await import('@lib/scoresLibrary/schema')).default,
  api_keys: (await import('@lib/apiKeys/schema')).default,
  books_library: (await import('@lib/booksLibrary/schema')).default,
  wishlist: (await import('@lib/wishlist/schema')).default,
  moment_vault: (await import('@lib/momentVault/schema')).default,
  movies: (await import('@lib/movies/schema')).default,
  railway_map: (await import('@lib/railwayMap/schema')).default,
  blog: (await import('@lib/blog/schema')).default
}

const COLLECTION_SCHEMAS = flattenSchemas(SCHEMAS)

export default COLLECTION_SCHEMAS
