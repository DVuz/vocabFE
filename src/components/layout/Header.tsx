import { Link, useNavigate } from '@tanstack/react-router';
import {
  BookMarked,
  BookOpen,
  ClipboardList,
  Clock,
  LogOut,
  Menu,
  RotateCcw,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../contexts/auth';

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate({ to: '/' });
  };

  const navLinks = [
    { to: '/vocabulary', icon: <BookMarked size={15} />, label: 'Từ vựng của tôi' },
    { to: '/review', icon: <RotateCcw size={15} />, label: 'Ôn tập' },
    { to: '/quiz', icon: <ClipboardList size={15} />, label: 'Kiểm tra' },
    { to: '/review-history', icon: <Clock size={15} />, label: 'Lịch sử ôn tập' },
  ] as const;

  return (
    <>
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 h-16
                       bg-white/85 backdrop-blur-md border-b border-zinc-200"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-sm">
            <BookOpen size={18} className="text-white" strokeWidth={2} />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-zinc-900 hidden sm:block">
            Dylan
            <span className="text-emerald-600"> Dictionary</span>
          </span>
        </Link>

        {/* Nav links — chỉ hiện khi đã đăng nhập, desktop */}
        {isLoggedIn && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                         text-zinc-600 hover:text-emerald-700 hover:bg-emerald-50 transition-all"
                activeProps={{ className: 'text-emerald-700 bg-emerald-50' }}
              >
                {icon}
                {label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {/* Avatar + name */}
              <div className="hidden sm:flex items-center gap-2">
                {user?.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-emerald-100"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center
                               text-emerald-700 text-sm font-bold"
                  >
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <span className="text-sm font-medium text-zinc-700">{user?.name}</span>
              </div>
              {/* Logout — desktop only */}
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                         text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-all"
              >
                <LogOut size={15} />
                <span>Đăng xuất</span>
              </button>
              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMobileOpen(v => !v)}
                className="md:hidden p-2 rounded-lg text-zinc-500 hover:bg-zinc-100 transition-all"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="px-4 py-1.5 bg-emerald-600 text-white text-sm font-semibold
                       rounded-full hover:bg-emerald-700 transition-all hover:-translate-y-px"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </header>

      {/* Mobile drawer */}
      {isLoggedIn && mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 flex flex-col"
          onClick={() => setMobileOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          {/* Panel */}
          <div
            className="relative mt-16 mx-3 bg-white rounded-2xl shadow-xl border border-zinc-200 overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* User row */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100">
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-100"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
              )}
              <span className="text-sm font-semibold text-zinc-800">{user?.name}</span>
            </div>
            {/* Nav items */}
            <nav className="py-2">
              {navLinks.map(({ to, icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  activeProps={{ className: 'bg-emerald-50 text-emerald-700' }}
                >
                  {icon}
                  {label}
                </Link>
              ))}
            </nav>
            {/* Logout */}
            <div className="border-t border-zinc-100 py-2">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-500 hover:text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={15} />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
