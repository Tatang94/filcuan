import React, { useState, useEffect } from 'react';
import { User, WithdrawalRequest } from '../types';
import { Wallet, History, Info, ArrowUpRight, Lock, Coins, CheckCircle2, Clock } from 'lucide-react';
import { CONVERSION_RATE, COINS_PER_INTERVAL } from '../constants';
import { addWithdrawalRequest, saveUserData } from '../services/data';
import { useNavigate } from 'react-router-dom';

interface RewardsViewProps {
  user: User | null;
}

const RewardsView: React.FC<RewardsViewProps> = ({ user }) => {
  const navigate = useNavigate();
  const [withdrawing, setWithdrawing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [localCoins, setLocalCoins] = useState(0);
  
  useEffect(() => {
    if (!user) {
      const stored = parseInt(localStorage.getItem('filcuan_guest_coins') || '0');
      setLocalCoins(stored);
    }
  }, [user]);

  const displayCoins = user ? user.coins : localCoins;
  const is30th = new Date().getDate() === 30;
  const balanceIDR = Math.floor(displayCoins / CONVERSION_RATE);

  const handleWithdraw = async () => {
    if (!user) {
      navigate('/auth', { state: { message: "Silakan daftar untuk menarik koin kamu!" } });
      return;
    }

    if (!is30th || balanceIDR < 10000) return;
    setWithdrawing(true);
    
    try {
      const { data: { user: supabaseUser } } = await import('../services/supabase').then(m => m.supabase.auth.getUser());
      
      const newReq: any = {
        username: user.username,
        amount: balanceIDR,
        method: 'DANA',
        status: 'pending'
      };
      
      await addWithdrawalRequest(newReq);
      
      if (supabaseUser) {
        await saveUserData(supabaseUser.id, { ...user, coins: 0 });
      }

      setWithdrawing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setWithdrawing(false);
    }
  };

  return (
    <div className="px-6 py-8 space-y-6 animate-fadeIn pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black tracking-tight text-white">Dompet Cuan</h1>
        <div className="bg-slate-800/50 p-2 rounded-2xl border border-white/5">
          <Info size={18} className="text-slate-400" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-8 rounded-[40px] text-slate-950 shadow-2xl shadow-yellow-400/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wallet size={120} />
        </div>
        
        <div className="relative z-10 space-y-6">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Saldo Terkumpul</p>
            <div className="flex items-center space-x-2">
              <span className="text-4xl font-black tracking-tighter">{displayCoins.toLocaleString()}</span>
              <Coins size={24} className="opacity-50" />
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-6 border-t border-black/10">
            <div>
              <p className="text-[10px] font-black uppercase opacity-60 mb-1">Estimasi IDR</p>
              <p className="text-xl font-black">Rp {balanceIDR.toLocaleString()}</p>
            </div>
            <button 
              onClick={handleWithdraw}
              className={`flex items-center space-x-2 px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all ${
                (user && is30th && balanceIDR >= 10000) || !user
                ? 'bg-slate-950 text-white shadow-xl active:scale-95' 
                : 'bg-black/10 text-slate-900/40 cursor-not-allowed'
              }`}
            >
              {withdrawing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : success ? (
                <CheckCircle2 size={16} />
              ) : is30th || !user ? (
                <ArrowUpRight size={16} />
              ) : (
                <Lock size={14} />
              )}
              <span>{!user ? 'Daftar & Tarik' : success ? 'Berhasil' : 'Tarik'}</span>
            </button>
          </div>
        </div>
      </div>

      {!user && (
        <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-3xl flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-2xl flex items-center justify-center flex-shrink-0">
             <Info size={20} className="text-blue-400" />
          </div>
          <p className="text-[10px] text-blue-200 font-bold uppercase leading-relaxed tracking-wide">
            Koin saat ini tersimpan di perangkat. <span className="text-blue-400">Daftar Akun</span> untuk mengamankan saldo dan mencairkannya!
          </p>
        </div>
      )}

      {user && balanceIDR < 10000 && (
        <div className="bg-slate-900/50 border border-white/5 p-4 rounded-2xl flex items-center space-x-3">
          <Info size={16} className="text-yellow-400" />
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Min. Penarikan Rp 10.000</p>
        </div>
      )}

      {!is30th && user && (
        <div className="glass-card p-5 rounded-3xl border border-white/5 flex items-start space-x-4">
          <div className="w-10 h-10 bg-yellow-400/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Clock size={20} className="text-yellow-400" />
          </div>
          <div className="space-y-1">
            <p className="text-[11px] font-black text-white uppercase tracking-wider">Jadwal Penarikan</p>
            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
              Sistem penarikan hanya terbuka otomatis setiap tanggal <span className="text-yellow-400 font-black">30</span> setiap bulannya. Terus kumpulkan koin!
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 pl-1 flex items-center space-x-2">
          <History size={14} />
          <span>Status Akun</span>
        </h3>
        <div className="glass-card p-6 rounded-3xl border border-white/5 text-center space-y-2">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
             {user ? 'Akun Terverifikasi' : 'Mode Tamu (Belum Login)'}
           </p>
           <p className="text-xs text-slate-400">
             {user ? 'Semua cuanmu tersimpan aman di cloud.' : 'Login untuk melihat riwayat penarikan dan mengamankan koin.'}
           </p>
        </div>
      </div>
    </div>
  );
};

export default RewardsView;