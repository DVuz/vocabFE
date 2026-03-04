import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router';
import Header from '../components/layout/Header';

const ROUTES_WITHOUT_HEADER = ['/login'];

function RootComponent() {
  const pathname = useRouterState({ select: s => s.location.pathname });
  const showHeader = !ROUTES_WITHOUT_HEADER.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {showHeader && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export const Route = createRootRoute({ component: RootComponent });
