export interface AnimeImage {
  jpg: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
  webp: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
}

export interface AnimeTrailer {
  youtube_id: string | null;
  url: string | null;
  embed_url: string | null;
  images: {
    image_url: string | null;
    small_image_url: string | null;
    medium_image_url: string | null;
    large_image_url: string | null;
    maximum_image_url: string | null;
  };
}

export interface AnimeGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface AnimeStudio {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export type AnimeStatus =
  | 'Finished Airing'
  | 'Currently Airing'
  | 'Not yet aired';

export type AnimeRating = 'G' | 'PG' | 'PG-13' | 'R - 17+' | 'R+' | 'Rx';

export interface Anime {
  mal_id: number;
  url: string;
  images: AnimeImage;
  trailer: AnimeTrailer;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string | null;
  source: string | null;
  episodes: number | null;
  status: AnimeStatus;
  airing: boolean;
  duration: string | null;
  rating: AnimeRating | null;
  score: number | null;
  scored_by: number | null;
  rank: number | null;
  popularity: number | null;
  members: number | null;
  synopsis: string | null;
  season: string | null;
  year: number | null;
  studios: AnimeStudio[];
  genres: AnimeGenre[];
  themes: AnimeGenre[];
}

export interface AnimeSearchParams {
  q?: string;
  page?: number;
  limit?: number;
  genres?: string;
  status?: 'airing' | 'complete' | 'upcoming';
  order_by?: 'score' | 'popularity' | 'rank' | 'members';
  sort?: 'asc' | 'desc';
  sfw?: boolean;
}
