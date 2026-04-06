export const QUERY_KEYS = {
  SEASONAL: 'seasonal-anime',
  TOP_ANIME: 'top-anime',
  ANIME_SEARCH: 'anime-search',
  ANIME_DETAILS: 'anime-details',
  GENRES: 'genres',
  AUTH_USER: 'auth-user',
  MY_LIST: 'my-list',
  COMMENTS: 'comments',
  COMMENT_REPLIES: 'comment-replies',
} as const;

export const WATCH_STATUSES = [
  'watching',
  'completed',
  'plan_to_watch',
  'dropped',
] as const;

export type WatchStatus = (typeof WATCH_STATUSES)[number];

export const WATCH_STATUS_LABELS: Record<WatchStatus, string> = {
  watching: 'Watching',
  completed: 'Completed',
  plan_to_watch: 'Plan to Watch',
  dropped: 'Dropped',
};
