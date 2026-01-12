
import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, ShieldCheck, Sparkles, AlertCircle, Info, MailCheck, CheckCircle2, ShieldEllipsis } from 'lucide-react';
import { signInUser, signUpUser } from '../services/data';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthView: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectMessage = location.state?.message;
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isLogin) {
        await signInUser(email, password);
        navigate('/');
      } else {
        if (!username.trim()) throw new Error("Username harus diisi");
        await signUpUser(email, password, username);
        // Tampilkan layar sukses cek email alih-alih navigasi langsung
        setIsRegistered(true);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan autentikasi");
    } finally {
      setLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-yellow-400/10 blur-[100px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-20%] w-80 h-80 bg-orange-500/10 blur-[120px] rounded-full" />

        <div className="w-full max-w-sm space-y-8 relative z-10 animate-fadeIn text-center">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-yellow-400 blur-2xl opacity-20 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-[40px] flex items-center justify-center shadow-2xl shadow-yellow-400/20">
              <MailCheck size={48} className="text-slate-950" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
                <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">FILCUAN ID</h1>
                <p className="text-[10px] text-yellow-400 font-black uppercase tracking-[0.3em]">PENDAFTARAN BERHASIL</p>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/5 p-8 rounded-[40px] space-y-5">
               <div className="space-y-2">
                 <p className="text-xs text-white font-black uppercase italic tracking-tight">Cek Inbox Email Resmi</p>
                 <div className="h-0.5 w-12 bg-yellow-400 mx-auto rounded-full"></div>
               </div>
               
               <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                 Kami telah mengirimkan instruksi aktivasi ke <br/>
                 <span className="text-white font-bold block mt-1">{email}</span>
               </p>

               <div className="bg-yellow-400/5 border border-yellow-400/10 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-2 text-yellow-400">
                    <ShieldEllipsis size={14} />
                    <p className="text-[9px] font-black uppercase tracking-widest">Pesan Dari: FILCUAN</p>
                  </div>
                  <p className="text-[9px] text-slate-500 font-bold text-left leading-relaxed">
                    Klik tombol konfirmasi di dalam email tersebut untuk mulai mengumpulkan koin. Periksa folder <span className="text-white">Spam</span> jika tidak ada di Inbox utama.
                  </p>
               </div>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => {
                setIsRegistered(false);
                setIsLogin(true);
              }}
              className="w-full py-4 rounded-[22px] bg-white text-slate-950 font-black uppercase tracking-widest text-[10px] shadow-xl active:scale-95 transition-all"
            >
              Lanjut ke Login
            </button>
            <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">Verified Secure by Filcuan Network</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-20%] w-64 h-64 bg-yellow-400/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-20%] w-80 h-80 bg-orange-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-sm space-y-8 relative z-10 animate-fadeIn">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-[28px] flex items-center justify-center mx-auto shadow-2xl shadow-yellow-400/20 rotate-3 transform">
            <Sparkles size={32} className="text-slate-950" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">
              FIL<span className="text-yellow-400">CUAN</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em]">AKSES AKUN FILCUAN</p>
          </div>
        </div>

        {redirectMessage && (
          <div className="bg-yellow-400/10 border border-yellow-400/20 p-4 rounded-2xl flex items-center space-x-3 text-yellow-400">
            <Info size={16} />
            <p className="text-[10px] font-black uppercase tracking-tight">{redirectMessage}</p>
          </div>
        )}

        <div className="bg-slate-900/50 backdrop-blur-2xl border border-white/5 p-8 rounded-[40px] space-y-6 shadow-2xl">
          <div className="space-y-1 text-center">
            <h2 className="text-xl font-black text-white">{isLogin ? 'Masuk Kembali' : 'Daftar Baru'}</h2>
            <p className="text-[10px] text-slate-400 font-medium">
              {isLogin ? 'Lanjutkan kumpulkan koin hari ini!' : 'Mulai kumpulkan saldo cuan sekarang.'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center space-x-3 text-red-400">
              <AlertCircle size={16} />
              <p className="text-[10px] font-black uppercase tracking-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <UserIcon size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Buat Username" 
                  className="w-full bg-slate-950 border border-white/5 rounded-[22px] py-4 pl-12 pr-4 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="relative">
              <Mail size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Alamat Email" 
                className="w-full bg-slate-950 border border-white/5 rounded-[22px] py-4 pl-12 pr-4 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all"
                required
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kata Sandi" 
                className="w-full bg-slate-950 border border-white/5 rounded-[22px] py-4 pl-12 pr-4 text-xs text-white placeholder:text-slate-700 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all"
                required
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-[22px] bg-yellow-400 text-slate-950 font-black flex items-center justify-center space-x-3 transition-all duration-300 uppercase tracking-widest text-[10px] shadow-xl active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-slate-950/20 border-t-slate-950 rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Masuk' : 'Daftar Sekarang'}</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors"
          >
            {isLogin ? 'Belum punya akun? Daftar Gratis' : 'Sudah punya akun? Login'}
          </button>
        </div>

        <div className="flex items-center justify-center space-x-2 text-[9px] text-slate-600 font-black uppercase tracking-[0.2em]">
          <ShieldCheck size={14} className="text-green-500/50" />
          <span>Keamanan Data Terjamin</span>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
