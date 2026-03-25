import { useTheme } from '@/hooks/useTheme';
import AppRouter from '@/router';

export default function App() {
  useTheme();
  return <AppRouter />;
}
