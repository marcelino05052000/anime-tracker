import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { useMyListStore } from '@/store/myListStore';
import { WATCH_STATUSES, WATCH_STATUS_LABELS } from '@/utils/constants';
import type { WatchStatus } from '@/utils/constants';
import type { Anime } from '@/types';

interface AddToListModalProps {
  anime: Anime;
  isOpen: boolean;
  onClose: () => void;
}

const SCORE_OPTIONS = [
  { value: '', label: '— No score —' },
  ...Array.from({ length: 10 }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
  })),
];

const selectClass =
  'w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer';

export default function AddToListModal({ anime, isOpen, onClose }: AddToListModalProps) {
  const { list, addToList, updateStatus, updateScore, removeFromList } = useMyListStore();
  const entry = list[anime.mal_id];

  const [status, setStatus] = useState<WatchStatus>(entry?.status ?? 'plan_to_watch');
  const [score, setScore] = useState<string>(entry?.user_score ? String(entry.user_score) : '');

  function handleSave() {
    const parsedScore = score ? Number(score) : null;
    if (entry) {
      updateStatus(anime.mal_id, status);
      updateScore(anime.mal_id, parsedScore);
    } else {
      addToList(anime, status, parsedScore);
    }
    onClose();
  }

  function handleRemove() {
    removeFromList(anime.mal_id);
    onClose();
  }

  const title = anime.title_english ?? anime.title;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={entry ? 'Update in My List' : 'Add to My List'}
    >
      <div className="flex flex-col gap-5">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{title}</p>

        {/* Status */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as WatchStatus)}
            className={selectClass}
          >
            {WATCH_STATUSES.map((s) => (
              <option key={s} value={s}>
                {WATCH_STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        {/* Score */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Your Score
          </label>
          <select
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className={selectClass}
          >
            {SCORE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-1">
          <Button variant="primary" size="md" onClick={handleSave} className="flex-1">
            {entry ? 'Update' : 'Add'}
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
