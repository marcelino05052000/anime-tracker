import { Skeleton } from '@/components/ui';

export default function AnimeCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
      <Skeleton className="aspect-[3/4] w-full rounded-none" />
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
