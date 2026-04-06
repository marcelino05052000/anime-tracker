import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Spinner } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import { useAnimeDetails } from '@/features/anime-details/hooks/useAnimeDetails';
import AnimeBanner from '@/features/anime-details/components/AnimeBanner';
import AnimeInfo from '@/features/anime-details/components/AnimeInfo';
import CommentsSection from '@/features/comments/components/CommentsSection';

export default function AnimeDetailsPage() {
  const { t } = useI18n();
  const { data: anime, isLoading, isError } = useAnimeDetails();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size={40} />
      </div>
    );
  }

  if (isError || !anime) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-zinc-400">
        <p className="text-lg font-medium">{t.details.notFound}</p>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm text-violet-500 hover:text-violet-400 transition-colors"
        >
          <ArrowLeft size={16} /> {t.details.backToHome}
        </Link>
      </div>
    );
  }

  return (
    <div>
      <AnimeBanner anime={anime} />
      <AnimeInfo anime={anime} />
      <CommentsSection malId={anime.mal_id} />
    </div>
  );
}
