import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { WatchStatus } from '@/utils/constants';
import type { Anime, UserListEntry } from '@/types';
import { createListEntry } from '@/types';

interface MyListState {
  list: Record<number, UserListEntry>;
  addToList: (anime: Anime, status: WatchStatus, userScore?: number | null, currentEpisode?: number | null) => void;
  removeFromList: (mal_id: number) => void;
  updateStatus: (mal_id: number, status: WatchStatus) => void;
  updateScore: (mal_id: number, score: number | null) => void;
  updateEpisode: (mal_id: number, episode: number | null) => void;
  isInList: (mal_id: number) => boolean;
}

export const useMyListStore = create<MyListState>()(
  persist(
    (set, get) => ({
      list: {},
      addToList: (anime, status, userScore, currentEpisode) =>
        set((state) => ({
          list: {
            ...state.list,
            [anime.mal_id]: createListEntry(anime, status, userScore, currentEpisode),
          },
        })),
      removeFromList: (mal_id) =>
        set((state) => {
          const next = { ...state.list };
          delete next[mal_id];
          return { list: next };
        }),
      updateStatus: (mal_id, status) =>
        set((state) => {
          const entry = state.list[mal_id];
          if (!entry) return state;
          return {
            list: {
              ...state.list,
              [mal_id]: { ...entry, status, updated_at: new Date().toISOString() },
            },
          };
        }),
      updateScore: (mal_id, score) =>
        set((state) => {
          const entry = state.list[mal_id];
          if (!entry) return state;
          return {
            list: {
              ...state.list,
              [mal_id]: { ...entry, user_score: score, updated_at: new Date().toISOString() },
            },
          };
        }),
      updateEpisode: (mal_id, episode) =>
        set((state) => {
          const entry = state.list[mal_id];
          if (!entry) return state;
          return {
            list: {
              ...state.list,
              [mal_id]: { ...entry, current_episode: episode, updated_at: new Date().toISOString() },
            },
          };
        }),
      isInList: (mal_id) => mal_id in get().list,
    }),
    { name: 'anime-tracker-my-list' },
  ),
);
