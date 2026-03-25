import { api } from '../api';
import type {
  JikanPaginatedResponse,
  JikanSingleResponse,
  Anime,
  AnimeSearchParams,
} from '@/types';

export const animeService = {
  getSeasonal: () =>
    api
      .get<JikanPaginatedResponse<Anime>>('/seasons/now', {
        params: { limit: 24 },
      })
      .then((r) => r.data),

  getTop: (page = 1) =>
    api
      .get<JikanPaginatedResponse<Anime>>('/top/anime', {
        params: { page, limit: 24 },
      })
      .then((r) => r.data),

  getById: (id: number) =>
    api
      .get<JikanSingleResponse<Anime>>(`/anime/${id}/full`)
      .then((r) => r.data.data),

  search: (params: AnimeSearchParams) =>
    api
      .get<JikanPaginatedResponse<Anime>>('/anime', { params })
      .then((r) => r.data),

  getGenres: () =>
    api.get<{ data: { mal_id: number; name: string }[] }>('/genres/anime').then((r) => r.data.data),
};
