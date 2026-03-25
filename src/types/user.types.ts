import type { WatchStatus } from '@/utils/constants';
import type { Anime } from './anime.types';

export interface UserListEntry {
  mal_id: number;
  title: string;
  image_url: string;
  score: number | null;
  episodes: number | null;
  status: WatchStatus;
  user_score: number | null;
  current_episode: number | null;
  added_at: string;
  updated_at: string;
}

export function createListEntry(
  anime: Anime,
  status: WatchStatus,
  userScore?: number | null,
  currentEpisode?: number | null,
): UserListEntry {
  return {
    mal_id: anime.mal_id,
    title: anime.title_english ?? anime.title,
    image_url: anime.images.webp.image_url,
    score: anime.score,
    episodes: anime.episodes,
    status,
    user_score: userScore ?? null,
    current_episode: currentEpisode ?? null,
    added_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
