import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useScrollToTop } from '@/hooks/useScrollToTop';

export default function RootLayout() {
  useScrollToTop();
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
