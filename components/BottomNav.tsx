
import React from 'react';
import { Home, Compass, Gift, User, ShieldCheck } from 'lucide-react';

interface BottomNavProps {
  currentPath: string;
  isAdmin: boolean;
  onNavigate: (path: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentPath, isAdmin, onNavigate }) => {
  const navItems = [
    { icon: <Home size={22} />, label: 'Home', path: '/' },
    { icon: <Compass size={22} />, label: 'Jelajah', path: '/explore' },
    { icon: <Gift size={22} />, label: 'Hadiah', path: '/rewards' },
    { icon: <User size={22} />, label: 'Profil', path: '/profile' },
  ];

  if (isAdmin) {
    navItems.push({ icon: <ShieldCheck size={22} />, label: 'Admin', path: '/admin' });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-lg border-t border-slate-800 pb-safe-area-inset-bottom z-50 bottom-nav-shadow">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-4">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
              currentPath === item.path ? 'text-yellow-400 scale-110' : 'text-slate-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
