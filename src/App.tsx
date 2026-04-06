import { useTheme } from '@/hooks/useTheme';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import AppRouter from '@/router';

export default function App() {
  useTheme();
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
