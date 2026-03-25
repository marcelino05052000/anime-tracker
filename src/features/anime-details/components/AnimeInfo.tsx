import type { Anime } from '@/types';
import GenreBadges from './GenreBadges';
import YouTubeEmbed from './YouTubeEmbed';

interface AnimeInfoProps {
  anime: Anime;
}

interface DetailRowProps {
  label: string;
  value: string | number | null | undefined;
}

function DetailRow({ label, value }: DetailRowProps) {
  if (value === null || value === undefined) return null;
  return (
    <div className="flex gap-2">
      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 w-28 shrink-0">
        {label}
      </span>
      <span className="text-sm text-zinc-900 dark:text-zinc-100">{value}</span>
    </div>
  );
}

export default function AnimeInfo({ anime }: AnimeInfoProps) {
  const studios = anime.studios.map((s) => s.name).join(', ') || null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-10">
      {/* Left: Synopsis + Trailer */}
      <div className="flex flex-col gap-8 flex-1 min-w-0">
        {anime.synopsis && (
          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">Synopsis</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
              {anime.synopsis}
            </p>
          </section>
        )}

        {anime.trailer.youtube_id !== null && (
          <section>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-3">Trailer</h2>
            <YouTubeEmbed youtubeId={anime.trailer.youtube_id} title={anime.title_english ?? anime.title} />
          </section>
        )}
      </div>

      {/* Right: Metadata sidebar */}
      <aside className="lg:w-64 shrink-0 flex flex-col gap-6">
        <section>
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">Details</h2>
          <div className="flex flex-col gap-3">
            <DetailRow label="Episodes" value={anime.episodes} />
            <DetailRow label="Status" value={anime.status} />
            <DetailRow label="Season" value={anime.season && anime.year ? `${anime.season} ${anime.year}` : null} />
            <DetailRow label="Studios" value={studios} />
            <DetailRow label="Source" value={anime.source} />
            <DetailRow label="Duration" value={anime.duration} />
            <DetailRow label="Rating" value={anime.rating} />
            <DetailRow label="Popularity" value={anime.popularity ? `#${anime.popularity}` : null} />
            <DetailRow label="Members" value={anime.members?.toLocaleString()} />
          </div>
        </section>

        {(anime.genres.length > 0 || anime.themes.length > 0) && (
          <section>
            <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">Genres & Themes</h2>
            <GenreBadges genres={anime.genres} themes={anime.themes} />
          </section>
        )}
      </aside>
    </div>
  );
}
