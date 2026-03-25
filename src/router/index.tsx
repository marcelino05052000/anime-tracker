import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from '@/components/layout/RootLayout';
import HomePage from '@/pages/HomePage';
import SearchPage from '@/pages/SearchPage';
import AnimeDetailsPage from '@/pages/AnimeDetailsPage';
import MyListPage from '@/pages/MyListPage';
import NotFoundPage from '@/pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'anime/:id', element: <AnimeDetailsPage /> },
      { path: 'my-list', element: <MyListPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
