import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import { useIsInList } from '@/features/my-list/hooks/useIsInList';
import { useAddToList } from '@/features/my-list/hooks/useAddToList';
import { useUpdateEntry } from '@/features/my-list/hooks/useUpdateEntry';
import { useRemoveFromList } from '@/features/my-list/hooks/useRemoveFromList';
import { WATCH_STATUSES } from '@/utils/constants';
import type { WatchStatus } from '@/utils/constants';
import type { Anime } from '@/types';

interface AddToListModalProps {
  anime: Anime;
  isOpen: boolean;
  onClose: () => void;
}

const selectClass =
  'w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer';

const inputClass =
  'w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-violet-500';

export default function AddToListModal({ anime, isOpen, onClose }: AddToListModalProps) {
  const { t } = useI18n();
  const { entry } = useIsInList(anime.mal_id);
  const addToList = useAddToList();
  const updateEntry = useUpdateEntry();
  const removeFromList = useRemoveFromList();

  const [status, setStatus] = useState<WatchStatus>(entry?.status ?? 'plan_to_watch');
  const [score, setScore] = useState<string>(entry?.user_score ? String(entry.user_score) : '');
  const [episode, setEpisode] = useState<string>(
    entry?.current_episode ? String(entry.current_episode) : '',
  );

  const scoreOptions = [
    { value: '', label: t.modal.noScore },
    ...Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
  ];

  function handleStatusChange(newStatus: WatchStatus) {
    setStatus(newStatus);
    if (newStatus === 'completed' && anime.status === 'Finished Airing' && anime.episodes !== null) {
      setEpisode(String(anime.episodes));
    }
  }

  function handleSave() {
    const parsedScore = score ? Number(score) : null;
    const parsedEpisode = episode ? Number(episode) : null;
    if (entry) {
      updateEntry.mutate({
        mal_id: anime.mal_id,
        status,
        user_score: parsedScore,
        current_episode: parsedEpisode,
      });
    } else {
      addToList.mutate({
        anime,
        status,
        user_score: parsedScore,
        current_episode: parsedEpisode,
      });
    }
    onClose();
  }

  function handleRemove() {
    removeFromList.mutate(anime.mal_id);
    onClose();
  }

  const animeTitle = anime.title_english ?? anime.title;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={entry ? t.modal.updateTitle : t.modal.addTitle}
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{animeTitle}</p>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.modal.status}</label>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value as WatchStatus)}
            className={selectClass}
          >
            {WATCH_STATUSES.map((s) => (
              <option key={s} value={s}>
                {t.watchStatus[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Episode */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.modal.currentEpisode}
            {anime.episodes !== null && (
              <span className="ml-1 font-normal text-zinc-400">/ {anime.episodes}</span>
            )}
          </label>
          <input
            type="number"
            min={0}
            max={anime.episodes ?? undefined}
            value={episode}
            onChange={(e) => setEpisode(e.target.value)}
            placeholder="0"
            className={inputClass}
          />
        </div>

        {/* Score */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            {t.modal.yourScore}
          </label>
          <select
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className={selectClass}
          >
            {scoreOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <Button variant="primary" size="md" onClick={handleSave} className="flex-1">
            {entry ? t.modal.update : t.modal.add}
          </Button>
          {entry && (
            <Button
              variant="ghost"
              size="md"
              onClick={handleRemove}
              className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
