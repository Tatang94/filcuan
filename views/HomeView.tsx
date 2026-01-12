
import React, { useState, useEffect, useRef } from 'react';
import { Heart, Download, Loader2, User as UserIcon, Coins, Sparkles, Zap, Timer } from 'lucide-react';
import { getFeed, handleInteraction, getCurrentUser, saveUserData } from '../services/data';
import { FeedContent } from '../types';
import { useNavigate } from 'react-router-dom';
import { COINS_PER_INTERVAL, REWARD_INTERVAL_MS } from '../constants';

const HomeView: React.FC = () => {
  const navigate = useNavigate();
  const [feed, setFeed] = useState<FeedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [timerProgress, setTimerProgress] = useState(0);
  
  // Use 'any' or 'ReturnType<typeof setInterval>' instead of NodeJS.Timeout to fix namespace error in browser
  const timerRef = useRef<any>(null);

  const loadData = async () => {
    const [data, profile] = await Promise.all([getFeed(), getCurrentUser()]);
    setFeed(data);
    setUserProfile(profile);
    setLoading(false);
  };

  useEffect(() => {
    loadData();

    // Setup reward timer 10 detik
    const tickInterval = 100; // Update progress bar setiap 100ms
    let elapsed = 0;

    timerRef.current = setInterval(async () => {
      elapsed += tickInterval;
      setTimerProgress((elapsed / REWARD_INTERVAL_MS) * 100);

      if (elapsed >= REWARD_INTERVAL_MS) {
        elapsed = 0;
        setTimerProgress(0);
        
        // Tambahkan koin jika ada feed dan user login
        if (feed.length > 0 && userProfile) {
          try {
            const updatedCoins = (userProfile.coins || 0) + COINS_PER_INTERVAL;
            await saveUserData(userProfile.id, { ...userProfile, coins: updatedCoins });
            setUserProfile(prev => prev ? { ...prev, coins: updatedCoins } : null);
          } catch (e) {
            console.error("Gagal auto-reward koin:", e);
          }
        } else if (feed.length > 0 && !userProfile) {
            // Mode Tamu: Simpan di localStorage sementara
            const currentGuestCoins = parseInt(localStorage.getItem('filcuan_guest_coins') || '0');
            localStorage.setItem('filcuan_guest_coins', (currentGuestCoins + COINS_PER_INTERVAL).toString());
        }
      }
    }, tickInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [feed.length, userProfile?.id]);

  const onInteraction = async (item: FeedContent, type: 'like' | 'download') => {
    if (!userProfile) {
      navigate('/auth', { state: { message: `Gunakan fitur ${type} untuk dapat koin!` } });
      return;
    }

    setProcessingId(item.id);
    
    try {
      if (type === 'download') {
        const response = await fetch(item.image_url);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Filcuan-Art-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }

      await handleInteraction(userProfile.id, item.id, item.image_url, type);
      setFeed(prev => prev.filter(f => f.id !== item.id));
      const updatedProfile = await getCurrentUser();
      setUserProfile(updatedProfile);
    } catch (err) {
      console.error(err);
      alert("Gagal memproses interaksi.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="animate-fadeIn pb-24 min-h-screen bg-slate-950">
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-xl z-30">
        <div className="space-y-0.5">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">FIL<span className="text-yellow-400">CUAN</span></h1>
          <p className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em]">Karya Eksklusif AI</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Progress Timer Visual */}
          <div className="flex items-center space-x-2 bg-slate-900/50 px-3 py-1.5 rounded-full border border-white/5">
             <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 transition-all duration-100 ease-linear" 
                  style={{ width: `${timerProgress}%` }}
                />
             </div>
             <Timer size={10} className="text-slate-500 animate-pulse" />
          </div>

          {userProfile ? (
            <div className="bg-yellow-400 px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-lg shadow-yellow-400/20 active:scale-95 transition-transform" onClick={() => navigate('/rewards')}>
              <Coins size={14} className="text-slate-950" />
              <span className="text-xs font-black text-slate-950">{userProfile.coins}</span>
            </div>
          ) : (
            <button onClick={() => navigate('/auth')} className="text-[10px] font-black uppercase bg-white/5 border border-white/10 px-4 py-2 rounded-xl">Masuk</button>
          )}
        </div>
      </div>

      <div className="px-6 space-y-6 pt-4">
        {loading ? (
          <div className="py-20 flex flex-col items-center space-y-4">
            <Loader2 className="animate-spin text-yellow-400" size={32} />
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Memuat Karya Admin...</p>
          </div>
        ) : feed.length === 0 ? (
          <div className="py-20 text-center space-y-6 opacity-40">
             <div className="w-20 h-20 bg-slate-900 rounded-[32px] flex items-center justify-center mx-auto border border-white/5">
                <Sparkles size={32} className="text-slate-600" />
             </div>
             <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-white">Semua Karya Habis!</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500 max-w-[200px] mx-auto leading-relaxed">Admin akan melukis karya AI baru. Tunggu ya!</p>
             </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {feed.map((item) => (
              <div key={item.id} className="group relative w-full aspect-[4/5] rounded-[48px] overflow-hidden bg-slate-900 border border-white/5 shadow-2xl animate-slideUp">
                <img src={item.image_url} className="w-full h-full object-cover" alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end">
                   <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-400 rounded-2xl flex items-center justify-center">
                           <UserIcon size={14} className="text-slate-950" />
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-yellow-400 uppercase tracking-widest">Creator</p>
                          <p className="text-xs font-black text-white uppercase italic">Filcuan Admin</p>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-white uppercase italic tracking-tighter line-clamp-2 leading-none">{item.title}</h3>
                      <div className="grid grid-cols-2 gap-4 pt-2">
                         <button disabled={processingId === item.id} onClick={() => onInteraction(item, 'like')} className="bg-white/10 backdrop-blur-xl border border-white/10 py-5 rounded-[28px] flex flex-col items-center justify-center space-y-1 active:scale-90 transition-all">
                           <Heart size={20} className="text-red-500" fill="currentColor" />
                           <span className="text-[10px] font-black uppercase text-white">+1 Koin</span>
                         </button>
                         <button disabled={processingId === item.id} onClick={() => onInteraction(item, 'download')} className="bg-yellow-400 py-5 rounded-[28px] flex flex-col items-center justify-center space-y-1 active:scale-90 transition-all shadow-xl shadow-yellow-400/20">
                           <Download size={20} className="text-slate-950" />
                           <span className="text-[10px] font-black uppercase text-slate-950">+2 Koin</span>
                         </button>
                      </div>
                   </div>
                </div>
                {processingId === item.id && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                    <Loader2 size={32} className="animate-spin text-yellow-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-10 py-16 text-center space-y-4 opacity-30">
        <Zap size={20} className="mx-auto text-yellow-400" />
        <p className="text-[9px] font-black uppercase tracking-[0.4em]">Filcuan AI Network • Koleksi Terbatas</p>
      </div>
    </div>
  );
};

export default HomeView;
