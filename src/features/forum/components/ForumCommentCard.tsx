import { useState } from 'react';
import { ThumbsUp, ThumbsDown, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import { useEditForumComment } from '../hooks/useEditForumComment';
import { useDeleteForumComment } from '../hooks/useDeleteForumComment';
import { useVoteForumComment, useRemoveForumVote } from '../hooks/useVoteForumComment';
import ForumCommentInput from './ForumCommentInput';
import ForumCommentReplies from './ForumCommentReplies';
import type { ForumComment } from '@/types';

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

interface ForumCommentCardProps {
  comment: ForumComment;
  postId: string;
  isReply?: boolean;
}

export default function ForumCommentCard({ comment, postId, isReply = false }: ForumCommentCardProps) {
  const { t, language } = useI18n();
  const { user, isAuthenticated } = useAuthContext();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const editComment = useEditForumComment();
  const deleteComment = useDeleteForumComment();
  const voteComment = useVoteForumComment();
  const removeVote = useRemoveForumVote();

  const isAuthor = user?.id === comment.author._id;

  function handleVote(value: 1 | -1) {
    if (!isAuthenticated) return;
    if (comment.user_vote === value) {
      removeVote.mutate({ postId, commentId: comment._id, parentId: comment.parent_id });
    } else {
      voteComment.mutate({ postId, commentId: comment._id, value, parentId: comment.parent_id });
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
      { postId, commentId: comment._id, text: trimmed, parentId: comment.parent_id },
      { onSuccess: () => setIsEditing(false) },
    );
  }

  function handleDelete() {
    deleteComment.mutate(
      { postId, commentId: comment._id, parentId: comment.parent_id },
      { onSuccess: () => setShowDeleteConfirm(false) },
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${isReply ? 'pl-6 border-l-2 border-zinc-200 dark:border-zinc-700' : ''}`}>
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {comment.author.username.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {comment.author.username}
        </span>
        {comment.author.role !== 'user' && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-600/20 text-violet-400 uppercase">
            {comment.author.role}
          </span>
        )}
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          {timeAgo(comment.createdAt, language)}
        </span>
        {comment.edited && (
          <span className="text-xs text-zinc-400 dark:text-zinc-500 italic">
            ({t.forum.comments.edited})
          </span>
        )}
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-2">
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            maxLength={2000}
            rows={3}
            className="w-full resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={editComment.isPending}
              className="px-3 py-1 text-xs font-medium rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              {t.forum.comments.save}
            </button>
            <button
              onClick={() => { setIsEditing(false); setEditText(comment.text); }}
              className="px-3 py-1 text-xs font-medium rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {t.forum.comments.cancel}
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line break-words">
          {comment.text}
        </p>
      )}

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
              {t.forum.comments.reply}
            </button>
          )}

          {isAuthor && (
            <>
              <button
                onClick={() => { setIsEditing(true); setEditText(comment.text); }}
                className="flex items-center gap-1 p-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
              >
                <Pencil size={12} />
                {t.forum.comments.edit}
              </button>

              {showDeleteConfirm ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-red-400">{t.forum.comments.deleteConfirm}</span>
                  <button
                    onClick={handleDelete}
                    disabled={deleteComment.isPending}
                    className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors cursor-pointer"
                  >
                    {t.forum.comments.delete}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                  >
                    {t.forum.comments.cancel}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-1 p-1 text-xs text-zinc-400 dark:text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                >
                  <Trash2 size={12} />
                  {t.forum.comments.delete}
                </button>
              )}
            </>
          )}
        </div>
      )}

      {showReplyInput && (
        <div className="mt-1">
          <ForumCommentInput
            postId={postId}
            parentId={comment._id}
            placeholder={t.forum.comments.replyPlaceholder}
            onSuccess={() => setShowReplyInput(false)}
          />
        </div>
      )}

      {!isReply && (comment.reply_count ?? 0) > 0 && (
        <ForumCommentReplies postId={postId} commentId={comment._id} replyCount={comment.reply_count!} />
      )}
    </div>
  );
}
