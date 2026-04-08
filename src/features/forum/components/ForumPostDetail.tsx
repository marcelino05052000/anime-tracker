import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Pin, Lock, Pencil } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import { useEditPost } from '../hooks/useEditPost';
import CategoryBadge from './CategoryBadge';
import ForumModActions from './ForumModActions';
import type { ForumPost } from '@/types';

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

interface ForumPostDetailProps {
  post: ForumPost;
  onDelete: () => void;
}

export default function ForumPostDetail({ post, onDelete }: ForumPostDetailProps) {
  const { t, language } = useI18n();
  const { user } = useAuthContext();
  const editPost = useEditPost();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body);

  const isAuthor = user?.id === post.author._id;
  const isMod = user?.role === 'moderator' || user?.role === 'admin';

  function handleSaveEdit() {
    const trimmedTitle = editTitle.trim();
    const trimmedBody = editBody.trim();
    if (!trimmedTitle || !trimmedBody) return;

    editPost.mutate(
      { postId: post._id, title: trimmedTitle, body: trimmedBody },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  }

  return (
    <div>
      {/* Anime banner */}
      <div className="relative h-32 sm:h-40 rounded-lg overflow-hidden mb-4">
        <img
          src={post.anime_image_url}
          alt={post.anime_title}
          className="w-full h-full object-cover blur-sm opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 to-transparent" />
        <div className="absolute bottom-3 left-4">
          <Link
            to={`/anime/${post.mal_id}`}
            className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            {post.anime_title}
          </Link>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-4">
        <Link to="/forum" className="hover:text-violet-400 transition-colors">
          {t.forum.post.forum}
        </Link>
        <span>/</span>
        <Link to={`/forum/anime/${post.mal_id}`} className="hover:text-violet-400 transition-colors">
          {post.anime_title}
        </Link>
        <span>/</span>
        <span className="text-zinc-500 truncate">{post.title}</span>
      </div>

      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {post.pinned && <Pin size={14} className="text-amber-500" />}
            {post.locked && <Lock size={14} className="text-red-400" />}
            <CategoryBadge category={post.category} />
          </div>

          {isEditing ? (
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              maxLength={200}
              className="w-full text-xl font-bold bg-transparent border border-zinc-700 rounded-lg px-3 py-1 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 mb-2"
            />
          ) : (
            <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{post.title}</h1>
          )}

          <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
            <span>{t.forum.post.by} {post.author.username}</span>
            {post.author.role !== 'user' && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-violet-600/20 text-violet-400 uppercase">
                {post.author.role}
              </span>
            )}
            <span>·</span>
            <span>{timeAgo(post.createdAt, language)}</span>
            {post.edited && (
              <span className="italic">({t.forum.post.edited})</span>
            )}
            <span>·</span>
            <span className="flex items-center gap-1"><Eye size={12} /> {post.views} {t.forum.post.views}</span>
          </div>
        </div>
      </div>

      {/* Mod actions */}
      {isMod && (
        <div className="mb-4">
          <ForumModActions postId={post._id} pinned={post.pinned} locked={post.locked} onDelete={onDelete} />
        </div>
      )}

      {/* Author edit/delete */}
      {isAuthor && !isMod && !isEditing && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <Pencil size={12} />
            {t.forum.post.edit}
          </button>
        </div>
      )}

      {/* Body */}
      {isEditing ? (
        <div className="flex flex-col gap-2 mb-6">
          <textarea
            value={editBody}
            onChange={(e) => setEditBody(e.target.value)}
            maxLength={5000}
            rows={8}
            className="w-full resize-none rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-colors"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={editPost.isPending}
              className="px-4 py-1.5 text-xs font-medium rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              {t.forum.comments.save}
            </button>
            <button
              onClick={() => { setIsEditing(false); setEditTitle(post.title); setEditBody(post.body); }}
              className="px-4 py-1.5 text-xs font-medium rounded-md text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              {t.forum.comments.cancel}
            </button>
          </div>
        </div>
      ) : (
        <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
          <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-line break-words">
            {post.body}
          </p>
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mb-6">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
