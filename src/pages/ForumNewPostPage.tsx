import { useI18n } from '@/hooks/useI18n';
import ForumNewPostForm from '@/features/forum/components/ForumNewPostForm';

export default function ForumNewPostPage() {
  const { t } = useI18n();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-6">
        {t.forum.newPost.title}
      </h1>
      <ForumNewPostForm />
    </div>
  );
}
