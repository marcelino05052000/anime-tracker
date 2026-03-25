import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import type { Anime } from '@/types';

interface AnimeCardProps {
  anime: Anime;
}

export default function AnimeCard({ anime }: AnimeCardProps) {
  const { t } = useI18n();
  const title = anime.title_english ?? anime.title;
  const imageUrl = anime.images.webp.image_url || anime.images.jpg.image_url;

  return (
    <Link
      to={`/anime/${anime.mal_id}`}
      className="group flex flex-col rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-violet-400 dark:hover:border-violet-500 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/10 hover:-translate-y-0.5"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {anime.score !== null && (
          <div className="absolute top-2 left-2 flex items-center gap-1 bg-black/70 text-white text-xs font-semibold px-2 py-1 rounded-full backdrop-blur-sm">
            <Star size={11} className="text-yellow-400 fill-yellow-400" />
            {anime.score.toFixed(2)}
          </div>
        )}
        {anime.airing && (
          <div className="absolute top-2 right-2 bg-violet-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {t.animeCard.airing}
          </div>
        )}
      </div>

      <div className="p-3 flex flex-col flex-1 justify-between gap-1">
        <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
          {title}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 text-right">
          {[anime.type, anime.episodes ? `${anime.episodes} ${t.animeCard.ep}` : null]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </div>
    </Link>
  );
}
