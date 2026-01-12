
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import HomeView from './views/HomeView';
import ExploreView from './views/ExploreView';
import RewardsView from './views/RewardsView';
import ProfileView from './views/ProfileView';
import AdminView from './views/AdminView';
import InfoView from './views/InfoView';
import AuthView from './views/AuthView';
import AdminLockOverlay from './components/AdminLockOverlay';
import { User } from './types';
import { saveUserData, getCurrentUser, logoutUser } from './services/data';
import { supabase } from './services/supabase';

const AppContent: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [loading, setLoading] = useState(true);

  const syncLocalCoins = async (profile: any, uid: string) => {
    const localCoins = parseInt(localStorage.getItem('filcuan_guest_coins') || '0');
    if (localCoins > 0) {
      const newTotal = parseInt(profile.coins) + localCoins;
      const updated = await saveUserData(uid, { ...profile, coins: newTotal, displayName: profile.display_name });
      localStorage.removeItem('filcuan_guest_coins');
      return updated;
    }
    return profile;
  };

  const fetchProfile = async (uid: string) => {
    let profile = await getCurrentUser();
    if (profile) {
      profile = await syncLocalCoins(profile, uid);
      setUser({
        username: profile.username,
        displayName: profile.display_name,
        coins: parseInt(profile.coins),
        joinedDate: profile.joined_date,
        isLoggedIn: true,
        photoURL: profile.photo_url
      });
      setUserId(uid);
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        await fetchProfile(session.user.id);
      } else {
        setUser(null);
        setUserId(null);
      }
      setLoading(false);
    });

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    };
    checkSession();

    const handleHash = () => {
      const isHashAdmin = window.location.hash.includes('#film');
      setIsAdmin(isHashAdmin);
      if (isHashAdmin && !isAdminAuthenticated) {
        setShowAdminPin(true);
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => {
      subscription.unsubscribe();
      window.removeEventListener('hashchange', handleHash);
    };
  }, [isAdminAuthenticated]);

  const handleAdminVerify = (pin: string) => {
    if (pin === '1994') {
      setIsAdminAuthenticated(true);
      setShowAdminPin(false);
      sessionStorage.setItem('filcuan_admin_session', 'active');
      return true;
    }
    return false;
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user || !userId) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    await saveUserData(userId, updatedUser);
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('filcuan_admin_session');
    navigate('/');
  };

  if (loading) return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center space-y-6">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-yellow-400/20 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-xl font-black italic text-white tracking-tighter uppercase">FIL<span className="text-yellow-400">CUAN</span></h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 pb-20 select-none overflow-x-hidden">
      {showAdminPin && (
        <AdminLockOverlay 
          onVerify={handleAdminVerify} 
          onClose={() => {
            setShowAdminPin(false);
            if (location.pathname === '/admin') navigate('/');
          }} 
        />
      )}

      <Routes>
        <Route path="/auth" element={<AuthView />} />
        <Route path="/" element={<HomeView />} />
        <Route path="/explore" element={<ExploreView />} />
        <Route path="/rewards" element={<RewardsView user={user} />} />
        <Route 
          path="/profile" 
          element={
            <ProfileView 
              user={user} 
              isAdmin={isAdmin} 
              onOpenAuth={() => navigate('/auth')} 
              onLogout={handleLogout} 
              onUpdateProfile={updateProfile}
            />
          } 
        />
        <Route 
          path="/admin" 
          element={isAdmin && isAdminAuthenticated ? <AdminView /> : <Navigate to="/" />} 
        />
        <Route path="/about" element={<InfoView type="about" />} />
        <Route path="/tos" element={<InfoView type="tos" />} />
        <Route path="/privacy" element={<InfoView type="privacy" />} />
        <Route path="/sitemap" element={<InfoView type="sitemap" />} />
        <Route path="/contact" element={<InfoView type="contact" />} />
      </Routes>

      <BottomNav 
        currentPath={location.pathname} 
        isAdmin={isAdmin && isAdminAuthenticated}
        onNavigate={(path) => navigate(path)} 
      />
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
