import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Tv } from 'lucide-react';
import { Button } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import { useLogin } from '../hooks/useLogin';

const inputClass =
  'w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-violet-500';

export default function LoginPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const login = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const returnTo = (location.state as { returnTo?: string })?.returnTo ?? '/';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    login.mutate(
      { email, password },
      {
        onSuccess: () => navigate(returnTo, { replace: true }),
        onError: (err) => {
          if (err && typeof err === 'object' && 'response' in err) {
            const res = (err as { response?: { status?: number } }).response;
            if (res?.status === 401) {
              setError(t.auth.invalidCredentials);
              return;
            }
          }
          setError(t.auth.genericError);
        },
      },
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
      <div className="w-full max-w-sm flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <Tv size={32} className="text-violet-600 dark:text-violet-400" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t.auth.loginTitle}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.auth.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.auth.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.auth.password}</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              autoComplete="current-password"
            />
          </div>

          <Button variant="primary" size="md" type="submit" disabled={login.isPending}>
            {login.isPending ? '...' : t.auth.loginAction}
          </Button>
        </form>

        <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
          {t.auth.noAccount}{' '}
          <Link to="/register" className="text-violet-600 dark:text-violet-400 hover:underline">
            {t.auth.register}
          </Link>
        </p>
      </div>
    </div>
  );
}
