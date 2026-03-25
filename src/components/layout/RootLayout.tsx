import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function RootLayout() {
  useScrollToTop();
  return (
    <div className="min-h-screen w-full overflow-x-clip bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Header />
      <main className="w-full overflow-x-clip">
        <Outlet />
      </main>
    </div>
  );
}
