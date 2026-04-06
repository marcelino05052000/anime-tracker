import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import { useAuthContext } from '../context/AuthContext';
import { useImportList } from '../hooks/useImportList';
import { useMyList } from '@/features/my-list/hooks/useMyList';

const LOCAL_STORAGE_KEY = 'anime-tracker-my-list';
const DISMISSED_KEY = 'anime-tracker-migration-dismissed';

export default function MigrationBanner() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuthContext();
  const { data: serverEntries } = useMyList();
  const importList = useImportList();
  const [localEntries, setLocalEntries] = useState<Record<string, unknown> | null>(null);
  const [visible, setVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (localStorage.getItem(DISMISSED_KEY)) return;

    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const list = parsed?.state?.list;
      if (list && typeof list === 'object' && Object.keys(list).length > 0) {
        setLocalEntries(list);
      }
    } catch {
      // Invalid data, ignore
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (localEntries && serverEntries !== undefined && serverEntries.length === 0) {
      setVisible(true);
    }
  }, [localEntries, serverEntries]);

  if (!visible || !localEntries) return null;

  const entries = Object.values(localEntries) as Array<{
    mal_id: number;
    title: string;
    image_url: string;
    score: number | null;
    episodes: number | null;
    status: string;
    user_score: number | null;
    current_episode: number | null;
    added_at: string;
    updated_at: string;
  }>;
  const count = entries.length;

  function handleImport() {
    importList.mutate(entries, {
      onSuccess: () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setSuccess(true);
        setTimeout(() => setVisible(false), 2000);
      },
    });
  }

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
  }

  if (success) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-4 py-3 text-sm text-green-700 dark:text-green-300">
        {t.auth.migrationSuccess}
      </div>
    );
  }

  return (
    <div className="bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <Download size={18} className="shrink-0 text-violet-600 dark:text-violet-400" />
        <p className="text-sm text-violet-700 dark:text-violet-300">
          {t.auth.migrationMessage.replace('{count}', String(count))}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="primary"
          size="sm"
          onClick={handleImport}
          disabled={importList.isPending}
        >
          {importList.isPending ? '...' : t.auth.migrationImport}
        </Button>
        <button
          onClick={handleDismiss}
          className="p-1 rounded text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          aria-label={t.auth.migrationDismiss}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
