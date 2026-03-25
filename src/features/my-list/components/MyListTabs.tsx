import { WATCH_STATUSES, WATCH_STATUS_LABELS } from '@/utils/constants';
import type { WatchStatus } from '@/utils/constants';

type Tab = 'all' | WatchStatus;

interface MyListTabsProps {
  activeTab: Tab;
  counts: Record<Tab, number>;
  onTabChange: (tab: Tab) => void;
}

const TABS: { value: Tab; label: string }[] = [
  { value: 'all', label: 'All' },
  ...WATCH_STATUSES.map((s) => ({ value: s as Tab, label: WATCH_STATUS_LABELS[s] })),
];

export default function MyListTabs({ activeTab, counts, onTabChange }: MyListTabsProps) {
  return (
    <div className="flex gap-1 border-b border-zinc-200 dark:border-zinc-800 overflow-x-auto">
      {TABS.map(({ value, label }) => {
        const isActive = activeTab === value;
        const count = counts[value];
        return (
          <button
            key={value}
            onClick={() => onTabChange(value)}
            className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              isActive
                ? 'border-violet-600 text-violet-600 dark:border-violet-400 dark:text-violet-400'
                : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            {label}
            {count > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                  isActive
                    ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                    : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export type { Tab };
