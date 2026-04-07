import { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Spinner } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { useUnreadCount } from '@/features/notifications/hooks/useUnreadCount';
import { useMarkAsRead } from '@/features/notifications/hooks/useMarkAsRead';
import { useMarkAllAsRead } from '@/features/notifications/hooks/useMarkAllAsRead';
import NotificationCard from '@/features/notifications/components/NotificationCard';

export default function NotificationsPage() {
  const { t } = useI18n();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useNotifications(page);
  const { data: unreadCount = 0 } = useUnreadCount();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size={32} />
      </div>
    );
  }

  const notifications = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {t.notifications.title}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={() => markAllAsRead.mutate()}
            disabled={markAllAsRead.isPending}
            className="flex items-center gap-1.5 text-sm font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors cursor-pointer disabled:opacity-50"
          >
            <CheckCheck size={16} />
            {t.notifications.markAllAsRead}
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-400">
          <Bell size={40} strokeWidth={1.5} />
          <p className="text-base font-medium">{t.notifications.noNotifications}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onMarkAsRead={(id) => markAsRead.mutate(id)}
            />
          ))}
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-default"
          >
            &larr;
          </button>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-3 py-1.5 text-sm rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-40 cursor-pointer disabled:cursor-default"
          >
            &rarr;
          </button>
        </div>
      )}
    </div>
  );
}
