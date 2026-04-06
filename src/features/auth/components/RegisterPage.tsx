import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Tv } from 'lucide-react';
import { Button } from '@/components/ui';
import { useI18n } from '@/hooks/useI18n';
import { useRegister } from '../hooks/useRegister';

const inputClass =
  'w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 text-sm px-3 focus:outline-none focus:ring-2 focus:ring-violet-500';

export default function RegisterPage() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const register = useRegister();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    register.mutate(
      { username, email, password },
      {
        onSuccess: () => navigate('/', { replace: true }),
        onError: (err) => {
          if (err && typeof err === 'object' && 'response' in err) {
            const res = (err as { response?: { status?: number; data?: { message?: string } } }).response;
            if (res?.status === 409) {
              const msg = res.data?.message ?? '';
              if (msg.includes('email')) {
                setError(t.auth.emailInUse);
              } else {
                setError(t.auth.usernameInUse);
              }
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
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{t.auth.registerTitle}</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{t.auth.registerSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.auth.username}</label>
            <input
              type="text"
              required
              minLength={3}
              maxLength={20}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={inputClass}
              autoComplete="username"
            />
          </div>

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
              autoComplete="new-password"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{t.auth.confirmPassword}</label>
            <input
              type="password"
              required
              minLength={6}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputClass}
              autoComplete="new-password"
            />
          </div>

          <Button variant="primary" size="md" type="submit" disabled={register.isPending}>
            {register.isPending ? '...' : t.auth.registerAction}
          </Button>
        </form>

        <p className="text-sm text-center text-zinc-500 dark:text-zinc-400">
          {t.auth.hasAccount}{' '}
          <Link to="/login" className="text-violet-600 dark:text-violet-400 hover:underline">
            {t.auth.login}
          </Link>
        </p>
      </div>
    </div>
  );
}
