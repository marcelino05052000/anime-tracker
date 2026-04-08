import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { Spinner } from '@/components/ui';
import { useForumPost } from '@/features/forum/hooks/useForumPost';
import ForumPostDetail from '@/features/forum/components/ForumPostDetail';
import ForumCommentSection from '@/features/forum/components/ForumCommentSection';

export default function ForumPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const { t } = useI18n();
  const navigate = useNavigate();
  const { data: post, isLoading, isError } = useForumPost(postId!);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Spinner size={40} />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-zinc-400">
        <p className="text-lg font-medium">Post not found</p>
        <Link
          to="/forum"
          className="flex items-center gap-1.5 text-sm text-violet-500 hover:text-violet-400 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Forum
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <ForumPostDetail post={post} onDelete={() => navigate('/forum')} />
      <ForumCommentSection postId={post._id} locked={post.locked} />
    </div>
  );
}
