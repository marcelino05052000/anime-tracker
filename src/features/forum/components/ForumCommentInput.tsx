import { useState } from 'react';
import { Send } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useAddForumComment } from '../hooks/useAddForumComment';

interface ForumCommentInputProps {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
}

export default function ForumCommentInput({ postId, parentId, onSuccess, placeholder }: ForumCommentInputProps) {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const addComment = useAddForumComment();

  function handleSubmit() {
    const trimmed = text.trim();
    if (!trimmed) return;

    addComment.mutate(
      { postId, text: trimmed, parentId },
      {
        onSuccess: () => {
          setText('');
          onSuccess?.();
        },
      },
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <div className="flex gap-3">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder ?? t.forum.comments.placeholder}
        maxLength={2000}
        rows={2}
        className="flex-1 resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
      />
      <button
        onClick={handleSubmit}
        disabled={!text.trim() || addComment.isPending}
        className="self-end p-2.5 rounded-lg bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        aria-label={t.forum.comments.send}
      >
        <Send size={16} />
      </button>
    </div>
  );
}
