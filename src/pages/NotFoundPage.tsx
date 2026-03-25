import { Link } from 'react-router-dom';
import { Home, Tv } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

export default function NotFoundPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center gap-6">
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-violet-100 dark:bg-violet-950">
          <Tv size={40} className="text-violet-500" />
        </div>
        <span className="text-7xl font-black text-zinc-200 dark:text-zinc-800 leading-none select-none">
          404
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {t.details.notFound}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
          {t.notFound.subtitle}
        </p>
      </div>

      <Link
        to="/"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold transition-colors"
      >
        <Home size={16} />
        {t.details.backToHome}
      </Link>
    </div>
  );
}
