import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Trophy, Plus, Check, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui';
import { useMyListStore } from '@/store/myListStore';
import type { Anime } from '@/types';
import AddToListModal from './AddToListModal';

interface AnimeBannerProps {
  anime: Anime;
}

export default function AnimeBanner({ anime }: AnimeBannerProps) {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const isInList = useMyListStore((state) => state.isInList);
  const inList = isInList(anime.mal_id);

  const title = anime.title_english ?? anime.title;
  const poster = anime.images.webp.large_image_url || anime.images.jpg.large_image_url;
  const backdrop = anime.images.webp.large_image_url || anime.images.jpg.large_image_url;

  return (
    <>
      {/* Blurred backdrop */}
      <div className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-2xl opacity-30 dark:opacity-20"
          style={{ backgroundImage: `url(${backdrop})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-zinc-950/60 dark:to-zinc-950" />

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 pt-4 pb-10 flex flex-col gap-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 w-fit text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            Back
          </button>

        <div className="flex flex-col sm:flex-row gap-8">
          {/* Poster */}
          <div className="shrink-0 mx-auto sm:mx-0">
            <img
              src={poster}
              alt={title}
              className="w-44 sm:w-52 rounded-xl shadow-2xl"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 justify-end">
            <div className="flex flex-wrap gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              {anime.type && <span>{anime.type}</span>}
              {anime.year && <span>· {anime.year}</span>}
              {anime.status && <span>· {anime.status}</span>}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
              {title}
            </h1>

            {anime.title_english && anime.title !== anime.title_english && (
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{anime.title}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-5">
              {anime.score !== null && (
                <div className="flex items-center gap-1.5">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                    {anime.score.toFixed(2)}
                  </span>
                  {anime.scored_by && (
                    <span className="text-xs text-zinc-500">
                      ({anime.scored_by.toLocaleString()} votes)
                    </span>
                  )}
                </div>
              )}
              {anime.rank !== null && (
                <div className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-400">
                  <Trophy size={16} />
                  <span className="text-sm font-medium">#{anime.rank}</span>
                </div>
              )}
            </div>

            {/* CTA */}
            <div>
              <Button
                variant={inList ? 'secondary' : 'primary'}
                size="md"
                onClick={() => setModalOpen(true)}
              >
                {inList ? (
                  <>
                    <Check size={16} /> In My List
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Add to List
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
        </div>
      </div>

      <AddToListModal anime={anime} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
