import { Search } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

interface SearchFiltersProps {
  q: string;
  status: string | undefined;
  order: string | undefined;
  season: string | undefined;
  onQChange: (value: string) => void;
  onStatusChange: (value: string | undefined) => void;
  onOrderChange: (value: string | undefined) => void;
  onSeasonChange: (value: string | undefined) => void;
}

const selectClass =
  'w-full sm:w-auto h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer';

export default function SearchFilters({
  q,
  status,
  order,
  season,
  onQChange,
  onStatusChange,
  onOrderChange,
  onSeasonChange,
}: SearchFiltersProps) {
  const { t } = useI18n();
  const s = t.search;

  const statusOptions = [
    { value: '', label: s.anyStatus },
    { value: 'airing', label: s.statusAiring },
    { value: 'complete', label: s.statusCompleted },
    { value: 'upcoming', label: s.statusUpcoming },
    { value: 'season', label: s.statusThisSeason },
  ];

  const orderOptions = [
    { value: '', label: s.orderRelevance },
    { value: 'score_desc', label: s.orderScoreDesc },
    { value: 'score_asc', label: s.orderScoreAsc },
    { value: 'popularity', label: s.orderPopularity },
    { value: 'rank_asc', label: s.orderRankAsc },
    { value: 'rank_desc', label: s.orderRankDesc },
    { value: 'members', label: s.orderMembers },
  ];

  const currentStatusValue = season === 'current' ? 'season' : status ?? '';

  function handleStatusChange(value: string) {
    if (value === 'season') {
      onSeasonChange('current');
    } else {
      onStatusChange(value || undefined);
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto_auto] gap-3">
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          placeholder={s.placeholder}
          className="w-full h-10 pl-9 pr-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <select
        value={currentStatusValue}
        onChange={(e) => handleStatusChange(e.target.value)}
        className={selectClass}
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={order ?? ''}
        onChange={(e) => onOrderChange(e.target.value || undefined)}
        className={selectClass}
      >
        {orderOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
