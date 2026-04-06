import { useState } from 'react';
import { ListX } from 'lucide-react';
import { Spinner } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import { useMyList } from '@/features/my-list/hooks/useMyList';
import { WATCH_STATUSES } from '@/utils/constants';
import MyListTabs from '@/features/my-list/components/MyListTabs';
import MyListCard from '@/features/my-list/components/MyListCard';
import MigrationBanner from '@/features/auth/components/MigrationBanner';
import type { Tab } from '@/features/my-list/components/MyListTabs';
import type { WatchStatus } from '@/utils/constants';

export default function MyListPage() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const { data: entries = [], isLoading } = useMyList();

  const counts: Record<Tab, number> = {
    all: entries.length,
    ...Object.fromEntries(
      WATCH_STATUSES.map((s) => [s, entries.filter((e) => e.status === s).length]),
    ),
  } as Record<Tab, number>;

  const filtered =
    activeTab === 'all' ? entries : entries.filter((e) => e.status === (activeTab as WatchStatus));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Spinner size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 flex flex-col gap-5 sm:gap-6">
      <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
        {t.myList.title}
      </h1>

      <MigrationBanner />

      <MyListTabs activeTab={activeTab} counts={counts} onTabChange={setActiveTab} />

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-zinc-400">
          <ListX size={40} strokeWidth={1.5} />
          <p className="text-base font-medium">{t.myList.emptyTitle}</p>
          <p className="text-sm">{t.myList.emptySubtitle}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((entry) => (
            <MyListCard key={entry.mal_id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  );
}
