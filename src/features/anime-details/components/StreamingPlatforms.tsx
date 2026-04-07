import { ExternalLink } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import type { StreamingPlatform } from '@/types';

const PLATFORM_COLORS: Record<string, string> = {
  Crunchyroll: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20',
  Netflix: 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20',
  'Amazon Prime Video': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20',
  'Disney Plus': 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20',
  'Hulu': 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20',
};

const DEFAULT_COLOR = 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-500/20';

interface StreamingPlatformsProps {
  platforms: StreamingPlatform[];
}

export default function StreamingPlatforms({ platforms }: StreamingPlatformsProps) {
  const { t } = useI18n();

  if (platforms.length === 0) return null;

  return (
    <section>
      <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-3">
        {t.animeInfo.streaming}
      </h2>
      <div className="flex flex-col gap-2">
        {platforms.map((platform) => (
          <a
            key={platform.name}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${PLATFORM_COLORS[platform.name] ?? DEFAULT_COLOR}`}
          >
            <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            {platform.name}
          </a>
        ))}
      </div>
    </section>
  );
}
