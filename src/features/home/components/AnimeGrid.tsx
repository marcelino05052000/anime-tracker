import type { Anime } from '@/types';
import AnimeCard from './AnimeCard';
import AnimeCardSkeleton from './AnimeCardSkeleton';

interface AnimeGridProps {
  animes?: Anime[];
  isLoading?: boolean;
  skeletonCount?: number;
}

export default function AnimeGrid({ animes, isLoading, skeletonCount = 24 }: AnimeGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {isLoading
        ? Array.from({ length: skeletonCount }, (_, i) => <AnimeCardSkeleton key={i} />)
        : animes?.map((anime) => <AnimeCard key={anime.mal_id} anime={anime} />)}
    </div>
  );
}
