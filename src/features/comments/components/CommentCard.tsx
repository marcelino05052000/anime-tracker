import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import { useEditComment } from '../hooks/useEditComment';
import { useDeleteComment } from '../hooks/useDeleteComment';
import { useVoteComment, useRemoveVote } from '../hooks/useVoteComment';
import CommentInput from './CommentInput';
import CommentReplies from './CommentReplies';
import type { ApiComment } from '@/types';

interface CommentCardProps {
  comment: ApiComment;
  malId: number;
  isReply?: boolean;
}

function timeAgo(dateStr: string, language: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const isEn = language === 'en';

  if (seconds < 60) return isEn ? 'just now' : 'agora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}${isEn ? 'm ago' : 'min atrás'}`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ${isEn ? 'ago' : 'atrás'}`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}${isEn ? 'd ago' : 'd atrás'}`;
  const months = Math.floor(days / 30);
  return `${months}${isEn ? 'mo ago' : ' mês atrás'}`;
}

export default function CommentCard({ comment, malId, isReply = false }: CommentCardProps) {
  const { t, language } = useI18n();
  const { user, isAuthenticated } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const editComment = useEditComment();
  const deleteComment = useDeleteComment();
  const voteComment = useVoteComment();
  const removeVote = useRemoveVote();

  const isAuthor = user?.id === comment.user._id;

  function handleVote(value: 1 | -1) {
    if (!isAuthenticated) return;
    if (comment.user_vote === value) {
      removeVote.mutate({ commentId: comment._id, malId, parentId: comment.parent_id });
    } else {
      voteComment.mutate({ commentId: comment._id, value, malId, parentId: comment.parent_id });
    }
  }

  function handleSaveEdit() {
    const trimmed = editText.trim();
    if (!trimmed || trimmed === comment.text) {
      setIsEditing(false);
      setEditText(comment.text);
      return;
    }
    editComment.mutate(
      { commentId: comment._id, text: trimmed, malId, parentId: comment.parent_id },
      { onSuccess: () => setIsEditing(false) },
    );
  }

  function handleDelete() {
    deleteComment.mutate(
      { commentId: comment._id, malId, parentId: comment.parent_id },
      { onSuccess: () => setShowDeleteConfirm(false) },
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${isReply ? 'pl-6 border-l-2 border-zinc-200 dark:border-zinc-700' : ''}`}>
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {comment.user.username.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {comment.user.username}
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {timeAgo(comment.createdAt, language)}
        </span>
        {comment.edited && (
          <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">
            ({t.comments.edited})
          </span>
        )}
      </div>

      {/* Body */}
      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            maxLength={1000}
            rows={3}
            className="w-full resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={editComment.isPending}
              className="px-3 py-1 text-xs font-medium rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              {t.comments.save}
            </button>
            <button
              onClick={() => { setIsEditing(false); setEditText(comment.text); }}
              className="px-3 py-1 text-xs font-medium rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {t.comments.cancel}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line break-words">
          {comment.text}
        </p>
      )}

      {/* Actions */}
      {!isEditing && (
        <div className="flex items-center gap-3 -ml-1">
          <button
            onClick={() => handleVote(1)}
            disabled={!isAuthenticated}
            className={`p-1 rounded transition-colors cursor-pointer disabled:cursor-default ${
              comment.user_vote === 1
                ? 'text-violet-500'
                : 'text-zinc-400 dark:text-zinc-500 hover:text-violet-500'
            }`}
            aria-label="Upvote"
          >
            <ThumbsUp size={14} />
          </button>

          <span className={`text-xs font-medium min-w-[1rem] text-center ${
            comment.score > 0
              ? 'text-violet-500'
              : comment.score < 0
                ? 'text-red-400'
                : 'text-zinc-400 dark:text-zinc-500'
          }`}>
            {comment.score}
          </span>

          <button
            onClick={() => handleVote(-1)}
            disabled={!isAuthenticated}
            className={`p-1 rounded transition-colors cursor-pointer disabled:cursor-default ${
              comment.user_vote === -1
                ? 'text-red-400'
                : 'text-zinc-400 dark:text-zinc-500 hover:text-red-400'
            }`}
            aria-label="Downvote"
          >
            <ThumbsDown size={14} />
          </button>

          {!isReply && isAuthenticated && (
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="flex items-center gap-1 p-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-violet-500 transition-colors cursor-pointer"
            >
              <MessageSquare size={14} />
              {t.comments.reply}
            </button>
          )}

          {isAuthor && (
            <>
              <button
                onClick={() => { setIsEditing(true); setEditText(comment.text); }}
                className="flex items-center gap-1 p-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
              >
                <Pencil size={12} />
                {t.comments.edit}
              </button>

              {showDeleteConfirm ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-red-400">{t.comments.deleteConfirm}</span>
                  <button
                    onClick={handleDelete}
                    disabled={deleteComment.isPending}
                    className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    {t.comments.delete}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {t.comments.cancel}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1 p-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                  {t.comments.delete}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {showReplyInput && (
        <div className="mt-1">
          <CommentInput
            malId={malId}
            parentId={comment._id}
            placeholder={t.comments.replyPlaceholder}
            onSuccess={() => setShowReplyInput(false)}
          />
        </div>
      )}

      {!isReply && (comment.reply_count ?? 0) > 0 && (
        <CommentReplies commentId={comment._id} malId={malId} replyCount={comment.reply_count!} />
      )}
    </div>
  );
}
