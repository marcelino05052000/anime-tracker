import { Link } from 'react-router-dom';
import { MessageCircle, Eye, Pin, Lock } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import CategoryBadge from './CategoryBadge';
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

interface ForumPostCardProps {
  post: ForumPost;
}

export default function ForumPostCard({ post }: ForumPostCardProps) {
  const { t, language } = useI18n();

  return (
    <Link
      to={`/forum/post/${post._id}`}
      className="flex items-start gap-3 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-violet-500/40 transition-colors"
    >
      {/* Anime thumbnail */}
      <img
        src={post.anime_image_url}
        alt={post.anime_title}
        className="w-10 h-14 rounded object-cover shrink-0 hidden sm:block"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          {post.pinned && (
            <Pin size={12} className="text-amber-500 shrink-0" />
          )}
          {post.locked && (
            <Lock size={12} className="text-red-400 shrink-0" />
          )}
          <CategoryBadge category={post.category} />
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
            {post.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
          <span>{post.anime_title}</span>
          <span>·</span>
          <span>{t.forum.post.by} {post.author.username}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500 shrink-0">
        <span className="flex items-center gap-1">
          <MessageCircle size={12} />
          {post.comment_count}
        </span>
        <span className="flex items-center gap-1">
          <Eye size={12} />
          {post.views}
        </span>
        <span className="whitespace-nowrap">{timeAgo(post.last_activity, language)}</span>
      </div>
    </Link>
  );
}
