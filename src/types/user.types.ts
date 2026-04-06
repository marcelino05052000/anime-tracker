import type { WatchStatus } from '@/utils/constants';
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
