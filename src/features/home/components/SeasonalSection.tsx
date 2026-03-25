import { Sparkles } from 'lucide-react';
import { useSeasonalAnime } from '../hooks/useSeasonalAnime';
import AnimeGrid from './AnimeGrid';

export default function SeasonalSection() {
  const { data, isLoading, isError } = useSeasonalAnime();

  if (isError) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <Sparkles size={20} className="text-violet-500" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">This Season</h2>
      </div>
      <AnimeGrid animes={data} isLoading={isLoading} />
    </section>
  );
}
