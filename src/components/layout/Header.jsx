import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Moon, Sun, Ticket } from 'lucide-react';
import { ProfileDrawer } from './ProfileDrawer';
import { useApp } from '../../App';

export const Header = ({ user, onLogout }) => {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { updateProfile } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
    setIsDark(!isDark);
  };

  const handleLogout = () => { onLogout(); navigate('/'); };

  if (!user && location.pathname === '/') return null;

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/60">
        <div className="max-w-3xl mx-auto h-15 flex items-center justify-between px-4 sm:px-6 py-3">
          {/* Brand */}
          <button
            onClick={() => navigate(`/${user?.role || ''}`)}
            className="flex items-center gap-2 font-bold text-lg tracking-tight text-slate-800 dark:text-slate-100 hover:opacity-80 transition-opacity"
          >
            <Ticket size={22} className="text-primary-500" />
            <span className="hidden sm:inline">SmartPass</span>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {user && (
              <>
                {/* Profile avatar */}
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="h-9 w-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white font-bold text-sm flex items-center justify-center ring-2 ring-primary-200 dark:ring-primary-800 hover:ring-primary-400 transition-all hover:scale-105"
                  title="View profile"
                >
                  {user.name?.charAt(0) || '?'}
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="h-9 w-9 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {drawerOpen && (
        <ProfileDrawer
          user={user}
          onClose={() => setDrawerOpen(false)}
          onUpdate={updateProfile}
        />
      )}
    </>
  );
};
