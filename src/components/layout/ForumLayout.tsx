import { Outlet } from 'react-router-dom';
import ForumSubNav from '@/features/forum/components/ForumSubNav';

export default function ForumLayout() {
  return (
    <>
      <ForumSubNav />
      <Outlet />
    </>
  );
}
