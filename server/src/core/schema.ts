import flattenSchemas from "@functions/utils/flattenSchema";

export const SCHEMAS = {
  user: (await import("@lib/user/schema")).default,
  todoList: (await import("@lib/todoList/schema")).default,
  codeTime: (await import("@lib/codeTime/schema")).default,
  ideaBox: (await import("@lib/ideaBox/schema")).default,
  passwords: (await import("@lib/passwords/schema")).default,
  journal: (await import("@lib/journal/schema")).default,
  calendar: (await import("@lib/calendar/schema")).default,
  music: (await import("@lib/music/schema")).default,
  achievements: (await import("@lib/achievements/schema")).default,
  wallet: (await import("@lib/wallet/schema")).default,
  scoresLibrary: (await import("@lib/scoresLibrary/schema")).default,
  apiKeys: (await import("@lib/apiKeys/schema")).default,
  booksLibrary: (await import("@lib/booksLibrary/schema")).default,
  wishlist: (await import("@lib/wishlist/schema")).default,
  momentVault: (await import("@lib/momentVault/schema")).default,
  movies: (await import("@lib/movies/schema")).default,
  railwayMap: (await import("@lib/railwayMap/schema")).default,
  blog: (await import("@lib/blog/schema")).default,
};

const COLLECTION_SCHEMAS = flattenSchemas(SCHEMAS);

export default COLLECTION_SCHEMAS;
