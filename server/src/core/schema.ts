import flattenSchemas from "@functions/utils/flattenSchema";

export const SCHEMAS = {
  journal: (await import("@lib/journal/schema")).default,
  music: (await import("@lib/music/schema")).default,
  calendar: (await import("@lib/calendar/schema")).default,
  achievements: (await import("@lib/achievements/schema")).default,
  passwords: (await import("@lib/passwords/schema")).default,
  moment_vault: (await import("@lib/momentVault/schema")).default,
  api_keys: (await import("@lib/apiKeys/schema")).default,
  users: (await import("@lib/user/schema")).default,
  blog: (await import("@lib/blog/schema")).default,
  todo_list: (await import("@lib/todoList/schema")).default,
  idea_box: (await import("@lib/ideaBox/schema")).default,
  railway_map: (await import("@lib/railwayMap/schema")).default,
  movies: (await import("@lib/movies/schema")).default,
  wallet: (await import("@lib/wallet/schema")).default,
  books_library: (await import("@lib/booksLibrary/schema")).default,
  scores_library: (await import("@lib/scoresLibrary/schema")).default,
  code_time: (await import("@lib/codeTime/schema")).default,
  wishlist: (await import("@lib/wishlist/schema")).default,
};

const COLLECTION_SCHEMAS = flattenSchemas(SCHEMAS);

export default COLLECTION_SCHEMAS;
