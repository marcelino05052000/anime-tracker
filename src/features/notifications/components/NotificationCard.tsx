import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import type { NotificationItem } from '@/types';

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkAsRead: (id: string) => void;
}

function formatTimeAgo(dateString: string, t: { justNow: string; minutesAgo: string; hoursAgo: string; daysAgo: string }): string {
  const now = Date.now();
  const date = new Date(dateString).getTime();
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return t.justNow;
  if (diffMin < 60) return t.minutesAgo.replace('{count}', String(diffMin));
  if (diffHours < 24) return t.hoursAgo.replace('{count}', String(diffHours));
  return t.daysAgo.replace('{count}', String(diffDays));
}

export default function NotificationCard({ notification, onMarkAsRead }: NotificationCardProps) {
  const { t } = useI18n();

  const message = notification.episode_number
    ? t.notifications.episodeAvailable.replace('{number}', String(notification.episode_number))
    : t.notifications.newEpisode;

  return (
    <div
      className={`flex items-start gap-3 p-3 sm:p-4 rounded-xl border transition-colors ${
        notification.read
          ? 'opacity-60 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950'
          : 'border-violet-200 dark:border-violet-900/50 bg-violet-50/50 dark:bg-violet-950/20'
      }`}
    >
      <Link to={`/anime/${notification.mal_id}`} className="shrink-0">
        <img
          src={notification.image_url}
          alt={notification.title}
          className="w-12 h-16 sm:w-14 sm:h-[74px] rounded-lg object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/anime/${notification.mal_id}`}
          className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-1"
        >
          {notification.title}
        </Link>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
          {message}
        </p>
        <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
          {formatTimeAgo(notification.created_at, t.notifications.timeAgo)}
        </p>
      </div>

      {!notification.read && (
        <button
          onClick={() => onMarkAsRead(notification._id)}
          className="shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          aria-label={t.notifications.markAsRead}
          title={t.notifications.markAsRead}
        >
          <Check size={16} />
        </button>
      )}
    </div>
  );
}
