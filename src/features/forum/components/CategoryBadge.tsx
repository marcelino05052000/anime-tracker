import { useI18n } from '@/hooks/useI18n';
import type { ForumCategory } from '@/types';

const CATEGORY_COLORS: Record<ForumCategory, string> = {
  discussion: 'bg-violet-500/15 text-violet-500',
  theories: 'bg-blue-500/15 text-blue-500',
  reviews: 'bg-green-500/15 text-green-500',
  spoilers: 'bg-red-500/15 text-red-500',
  news: 'bg-cyan-500/15 text-cyan-500',
  episode_discussion: 'bg-amber-500/15 text-amber-500',
};

interface CategoryBadgeProps {
  category: ForumCategory;
}

export default function CategoryBadge({ category }: CategoryBadgeProps) {
  const { t } = useI18n();

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${CATEGORY_COLORS[category]}`}
    >
      {t.forum.categories[category]}
    </span>
  );
}
