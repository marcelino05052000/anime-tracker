import { Pin, Lock, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/hooks/useI18n';
import { useTogglePin, useToggleLock } from '../hooks/useModActions';
import { useDeletePost } from '../hooks/useDeletePost';

interface ForumModActionsProps {
  postId: string;
  pinned: boolean;
  locked: boolean;
  onDelete?: () => void;
}

export default function ForumModActions({ postId, pinned, locked, onDelete }: ForumModActionsProps) {
  const { t } = useI18n();
  const togglePin = useTogglePin();
  const toggleLock = useToggleLock();
  const deletePost = useDeletePost();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleDelete() {
    deletePost.mutate(postId, {
      onSuccess: () => onDelete?.(),
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => togglePin.mutate(postId)}
        disabled={togglePin.isPending}
        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
          pinned
            ? 'bg-amber-500/15 text-amber-500'
            : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <Pin size={12} />
        {pinned ? t.forum.mod.unpin : t.forum.mod.pin}
      </button>

      <button
        onClick={() => toggleLock.mutate(postId)}
        disabled={toggleLock.isPending}
        className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
          locked
            ? 'bg-red-500/15 text-red-400'
            : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
        }`}
      >
        <Lock size={12} />
        {locked ? t.forum.mod.unlock : t.forum.mod.lock}
      </button>

      {showDeleteConfirm ? (
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-red-400">{t.forum.post.deleteConfirm}</span>
          <button
            onClick={handleDelete}
            disabled={deletePost.isPending}
            className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            {t.forum.post.delete}
          </button>
          <button
            onClick={() => setShowDeleteConfirm(false)}
            className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
          >
            {t.forum.post.cancel}
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md text-zinc-400 hover:text-red-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <Trash2 size={12} />
          {t.forum.post.delete}
        </button>
      )}
    </div>
  );
}
