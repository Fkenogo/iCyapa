
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShieldCheck, MapPin } from 'lucide-react';
import { THEME_COLORS } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Hide main navigation on forms and admin console to avoid collision with action buttons
  const hideNav = 
    location.pathname.includes('/business/new') || 
    location.pathname.includes('/claim') || 
    location.pathname.includes('/admin');

  const navItems = [
    { to: '/', icon: <Home size={20} />, label: 'Home' },
    { to: '/buildings', icon: <MapPin size={20} />, label: 'Browse' },
    { to: '/admin', icon: <ShieldCheck size={20} />, label: 'Admin' },
  ];

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-xl relative">
      <header className="sticky top-0 z-50 bg-white border-b px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold" style={{ backgroundColor: THEME_COLORS.primary }}>iC</div>
          <span className="text-xl font-bold tracking-tight text-gray-900">iCyapa</span>
        </Link>
        <div className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">Nyamata, RW</div>
      </header>

      <main className={`flex-1 ${!hideNav ? 'pb-24' : 'pb-8'}`}>
        {children}
      </main>

      {!hideNav && (
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t px-6 py-3 flex justify-between items-center z-50 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to || (item.to === '/buildings' && location.pathname.includes('/building'));
            return (
              <Link 
                key={item.to} 
                to={item.to} 
                className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                style={isActive ? { color: THEME_COLORS.primary } : {}}
              >
                {item.icon}
                <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
};

export default Layout;