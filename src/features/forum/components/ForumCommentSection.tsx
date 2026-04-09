import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useI18n } from '@/hooks/useI18n';
import { useAuthContext } from '@/features/auth/context/AuthContext';
import { useForumComments } from '../hooks/useForumComments';
import { Spinner } from '@/components/ui';
import ForumCommentInput from './ForumCommentInput';
import ForumCommentCard from './ForumCommentCard';
import type { ForumCommentSort } from '@/types';

interface ForumCommentSectionProps {
  postId: string;
  locked: boolean;
}

export default function ForumCommentSection({ postId, locked }: ForumCommentSectionProps) {
  const { t } = useI18n();
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();
  const [sort, setSort] = useState<ForumCommentSort>('recent');
  const { data: comments, isLoading } = useForumComments(postId, sort);

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">
          <MessageCircle size={20} />
          {t.forum.comments.title}
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
            {t.forum.comments.sortRecent}
          </button>
          <button
            onClick={() => setSort('top')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
              sort === 'top'
                ? 'bg-violet-600 text-white'
                : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            {t.forum.comments.sortTop}
          </button>
        </div>
      </div>

      {locked ? (
        <div className="mb-6 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 text-center text-sm text-zinc-400">
          🔒 {t.forum.post.locked}
        </div>
      ) : isAuthenticated ? (
        <div className="mb-6">
          <ForumCommentInput postId={postId} />
        </div>
      ) : (
        <div className="mb-6 rounded-lg border border-zinc-200 dark:border-zinc-700 p-4 text-center">
          <Link
            to="/login"
            state={{ returnTo: location.pathname }}
            className="text-sm text-violet-500 hover:text-violet-400 font-medium transition-colors"
          >
            {t.forum.comments.loginToComment}
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
            <ForumCommentCard key={comment._id} comment={comment} postId={postId} />
          ))}
        </div>
      ) : (
        <p className="text-center text-sm text-zinc-400 dark:text-zinc-500 py-8">
          {t.forum.comments.noComments}
        </p>
      )}
    </section>
  );
}
