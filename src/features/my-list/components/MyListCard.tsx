import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import type { UserListEntry } from '@/types';
import EditStatusModal from './EditStatusModal';

interface MyListCardProps {
  entry: UserListEntry;
}

const STATUS_BADGE_VARIANT = {
  watching: 'blue',
  completed: 'green',
  plan_to_watch: 'gray',
  dropped: 'red',
} as const;

export default function MyListCard({ entry }: MyListCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      <div className="flex gap-4 p-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors">
        {/* Poster */}
        <Link to={`/anime/${entry.mal_id}`} className="shrink-0">
          <img
            src={entry.image_url}
            alt={entry.title}
            className="w-14 h-20 object-cover rounded-lg"
            loading="lazy"
          />
        </Link>

        {/* Info */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0 justify-center">
          <Link
            to={`/anime/${entry.mal_id}`}
            className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-2 leading-snug"
          >
            {entry.title}
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={STATUS_BADGE_VARIANT[entry.status]}>
              {t.watchStatus[entry.status]}
            </Badge>

            {entry.user_score !== null && (
              <span className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400">
                <Star size={11} className="text-yellow-400 fill-yellow-400" />
                {entry.user_score}/10
              </span>
            )}
          </div>

          {(entry.current_episode !== null || entry.episodes !== null) && (
            <p className="text-xs text-zinc-400">
              Ep{' '}
              {entry.current_episode !== null ? entry.current_episode : '?'}
              {entry.episodes !== null ? ` / ${entry.episodes}` : ''}
            </p>
          )}
        </div>

        {/* Edit button */}
        <div className="flex items-start pt-1 shrink-0">
          <button
            onClick={() => setModalOpen(true)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            aria-label="Edit entry"
          >
            <Pencil size={15} />
          </button>
        </div>
      </div>

      <EditStatusModal entry={entry} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
