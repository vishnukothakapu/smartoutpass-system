import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Bell, Moon, Sun } from 'lucide-react';
import './Header.css';

export const Header = ({ user, onLogout }) => {
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(t => t === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  if (!user && location.pathname === '/') return null; // Don't show header on login

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-brand" onClick={() => navigate(`/${user?.role || ''}`)}>
          <span className="brand-icon">🎟️</span>
          <span className="brand-text">SmartPass</span>
        </div>
        
        <div className="header-actions">
          <button className="icon-btn" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          {user && (
            <>
              <button className="icon-btn" onClick={() => navigate(`/${user.role}/notifications`)}>
                <Bell size={20} />
                <span className="notification-dot"></span>
              </button>
              <button className="icon-btn" onClick={handleLogout}>
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
