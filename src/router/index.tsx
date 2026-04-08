import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import ForumLayout from '@/components/layout/ForumLayout';
import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import AnimeDetailsPage from '@/pages/AnimeDetailsPage';
import MyListPage from '@/pages/MyListPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import NotFoundPage from '@/pages/NotFoundPage';
import NotificationsPage from '@/pages/NotificationsPage';
import ForumHomePage from '@/pages/ForumHomePage';
import ForumPostPage from '@/pages/ForumPostPage';
import ForumNewPostPage from '@/pages/ForumNewPostPage';
import ForumAnimePage from '@/pages/ForumAnimePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <Navigate to="/" replace /> },
      { path: 'anime/:id', element: <AnimeDetailsPage /> },
      {
        path: 'forum',
        element: <ForumLayout />,
        children: [
          { index: true, element: <ForumHomePage /> },
          { path: 'post/:postId', element: <ForumPostPage /> },
          {
            element: <ProtectedRoute />,
            children: [
              { path: 'new', element: <ForumNewPostPage /> },
            ],
          },
          { path: 'anime/:malId', element: <ForumAnimePage /> },
        ],
      },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'my-list', element: <MyListPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
