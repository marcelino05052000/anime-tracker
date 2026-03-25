import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal, Button } from '@/components/ui';
import { useMyListStore } from '@/store/myListStore';
import { useI18n } from '@/hooks/useI18n';
import { WATCH_STATUSES } from '@/utils/constants';
import type { WatchStatus } from '@/utils/constants';
import type { UserListEntry } from '@/types';

interface EditStatusModalProps {
  entry: UserListEntry;
  isOpen: boolean;
  onClose: () => void;
}

const selectClass =
  'w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer';

const inputClass =
  'w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-violet-500';

export default function EditStatusModal({ entry, isOpen, onClose }: EditStatusModalProps) {
  const { t } = useI18n();
  const { updateStatus, updateScore, updateEpisode, removeFromList } = useMyListStore();

  const [status, setStatus] = useState<WatchStatus>(entry.status);
  const [score, setScore] = useState<string>(entry.user_score ? String(entry.user_score) : '');
  const [episode, setEpisode] = useState<string>(
    entry.current_episode ? String(entry.current_episode) : '',
  );

  const scoreOptions = [
    { value: '', label: t.modal.noScore },
    ...Array.from({ length: 10 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) })),
  ];

  function handleStatusChange(newStatus: WatchStatus) {
    setStatus(newStatus);
    if (newStatus === 'completed' && entry.episodes !== null) {
      setEpisode(String(entry.episodes));
    }
  }

  function handleSave() {
    updateStatus(entry.mal_id, status);
    updateScore(entry.mal_id, score ? Number(score) : null);
    updateEpisode(entry.mal_id, episode ? Number(episode) : null);
    onClose();
  }

  function handleRemove() {
    removeFromList(entry.mal_id);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t.modal.editTitle}>
      <div className="flex flex-col gap-5">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{entry.title}</p>

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
            {entry.episodes !== null && (
              <span className="ml-1 font-normal text-zinc-400">/ {entry.episodes}</span>
            )}
          </label>
          <input
            type="number"
            min={0}
            max={entry.episodes ?? undefined}
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
            {t.modal.save}
          </Button>
          <Button
            variant="ghost"
            size="md"
            onClick={handleRemove}
            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
