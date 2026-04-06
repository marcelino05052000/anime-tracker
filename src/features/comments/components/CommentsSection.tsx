import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/hooks/useI18n';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import { useComments } from '../hooks/useComments';
import { Spinner } from '@/components/ui';
import CommentInput from './CommentInput';
import CommentCard from './CommentCard';
import type { CommentSort } from '@/types';

interface CommentsSectionProps {
  malId: number;
}

export default function CommentsSection({ malId }: CommentsSectionProps) {
  const { t } = useI18n();
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();
  const [sort, setSort] = useState<CommentSort>('recent');
  const { data: comments, isLoading } = useComments(malId, sort);

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
          <MessageCircle size={20} />
          {t.comments.title}
          {comments && comments.length > 0 && (
            <span className="text-sm font-normal text-zinc-400">({comments.length})</span>
          )}
        </h2>

        <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <button
            onClick={() => setSort('recent')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              sort === 'recent'
                ? 'bg-violet-600 text-white'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {t.comments.sortRecent}
          </button>
          <button
            onClick={() => setSort('top')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              sort === 'top'
                ? 'bg-violet-600 text-white'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {t.comments.sortTop}
          </button>
        </div>
      </div>

      {isAuthenticated ? (
        <div className="mb-6">
          <CommentInput malId={malId} />
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 text-center">
          <Link
            to="/login"
            state={{ returnTo: location.pathname }}
            className="text-sm text-violet-500 hover:text-violet-400 font-medium transition-colors"
          >
            {t.comments.loginToComment}
          </Link>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Spinner size={24} />
        </div>
      ) : comments && comments.length > 0 ? (
        <div className="flex flex-col gap-6">
          {comments.map((comment) => (
            <CommentCard key={comment._id} comment={comment} malId={malId} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-8">
          {t.comments.noComments}
        </p>
      )}
    </section>
  );
}
