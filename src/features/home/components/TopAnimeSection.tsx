import { TrendingUp } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useTopAnime } from '../hooks/useTopAnime';
import AnimeGrid from './AnimeGrid';

export default function TopAnimeSection() {
  const { t } = useI18n();
  const { data, isLoading, isError } = useTopAnime();

  if (isError) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={20} className="text-violet-500" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{t.home.topAnime}</h2>
      </div>
      <AnimeGrid animes={data} isLoading={isLoading} />
    </section>
  );
}
