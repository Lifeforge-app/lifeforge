import flattenSchemas from '@functions/utils/flattenSchema'

export const SCHEMAS = {
  user: (await import('@lib/user/schema')).default,
  todo_list: (await import('@lib/todoList/server/schema')).default,
  code_time: (await import('@lib/codeTime/server/schema')).default,
  idea_box: (await import('@lib/ideaBox/server/schema')).default,
  passwords: (await import('@lib/passwords/server/schema')).default,
  calendar: (await import('@lib/calendar/server/schema')).default,
  music: (await import('@lib/music/server/schema')).default,
  achievements: (await import('@lib/achievements/server/schema')).default,
  wallet: (await import('@lib/wallet/server/schema')).default,
  scores_library: (await import('@lib/scoresLibrary/server/schema')).default,
  api_keys: (await import('@lib/apiKeys/schema')).default,
  books_library: (await import('@lib/booksLibrary/server/schema')).default,
  moment_vault: (await import('@lib/momentVault/server/schema')).default,
  movies: (await import('@lib/movies/server/schema')).default,
  railway_map: (await import('@lib/railwayMap/server/schema')).default
}

const COLLECTION_SCHEMAS = flattenSchemas(SCHEMAS)

export default COLLECTION_SCHEMAS
