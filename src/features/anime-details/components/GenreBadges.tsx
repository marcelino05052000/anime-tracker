import { Badge } from '@/components/ui';
import type { AnimeGenre } from '@/types';

interface GenreBadgesProps {
  genres: AnimeGenre[];
  themes?: AnimeGenre[];
}

export default function GenreBadges({ genres, themes = [] }: GenreBadgesProps) {
  const all = [...genres, ...themes];
  if (all.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {all.map((item) => (
        <Badge key={item.mal_id} variant="default">
          {item.name}
        </Badge>
      ))}
    </div>
  );
}
