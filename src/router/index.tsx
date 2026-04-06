import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import SearchPage from '@/pages/SearchPage';
import AnimeDetailsPage from '@/pages/AnimeDetailsPage';
import MyListPage from '@/pages/MyListPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'anime/:id', element: <AnimeDetailsPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'my-list', element: <MyListPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
