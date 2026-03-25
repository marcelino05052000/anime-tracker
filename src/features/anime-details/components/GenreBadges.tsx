import { Badge } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import { translateGenreName } from '@/i18n/animeFieldTranslations';
import type { AnimeGenre } from '@/types';

interface GenreBadgesProps {
  genres: AnimeGenre[];
  themes?: AnimeGenre[];
}

export default function GenreBadges({ genres, themes = [] }: GenreBadgesProps) {
  const { language } = useI18n();
  const all = [...genres, ...themes];
  if (all.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {all.map((item) => (
        <Badge key={item.mal_id} variant="default">
          {translateGenreName(item.name, language)}
        </Badge>
      ))}
    </div>
  );
}
