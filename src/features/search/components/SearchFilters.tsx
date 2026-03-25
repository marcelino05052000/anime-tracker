import { Search } from 'lucide-react';

interface SearchFiltersProps {
  q: string;
  status: string | undefined;
  order_by: string | undefined;
  onQChange: (value: string) => void;
  onStatusChange: (value: string | undefined) => void;
  onOrderByChange: (value: string | undefined) => void;
}

const STATUS_OPTIONS = [
  { value: '', label: 'Any status' },
  { value: 'airing', label: 'Airing' },
  { value: 'complete', label: 'Completed' },
  { value: 'upcoming', label: 'Upcoming' },
] as const;

const ORDER_BY_OPTIONS = [
  { value: '', label: 'Relevance' },
  { value: 'score', label: 'Score' },
  { value: 'popularity', label: 'Popularity' },
  { value: 'rank', label: 'Rank' },
  { value: 'members', label: 'Members' },
] as const;

const selectClass =
  'h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer';

export default function SearchFilters({
  q,
  status,
  order_by,
  onQChange,
  onStatusChange,
  onOrderByChange,
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div className="relative flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
        <input
          type="text"
          value={q}
          onChange={(e) => onQChange(e.target.value)}
          placeholder="Search anime..."
          className="w-full h-10 pl-9 pr-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Status filter */}
      <select
        value={status ?? ''}
        onChange={(e) => onStatusChange(e.target.value || undefined)}
        className={selectClass}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {/* Order by filter */}
      <select
        value={order_by ?? ''}
        onChange={(e) => onOrderByChange(e.target.value || undefined)}
        className={selectClass}
      >
        {ORDER_BY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
