
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, AppRoute } from '../types';
import { User as UserIcon, Settings, LogOut, Award, ChevronRight, Share2, Mail, FileText, Info, ShieldCheck, Edit3, Check, X, ShieldAlert, ListTree } from 'lucide-react';

interface ProfileViewProps {
  user: User | null;
  isAdmin: boolean;
  onOpenAuth: () => void;
  onLogout: () => void;
  onUpdateProfile: (updates: Partial<User>) => Promise<void>;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, isAdmin, onOpenAuth, onLogout, onUpdateProfile }) => {
  const navigate = useNavigate();
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(user?.displayName || user?.username || '');

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen px-10 text-center space-y-6">
        <div className="w-24 h-24 bg-slate-900 rounded-[40px] flex items-center justify-center text-slate-700 border border-white/5 shadow-2xl">
          <UserIcon size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">Halo, Sobat Cuan!</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest leading-relaxed">Masuk ke akun resmi Filcuan untuk mengamankan saldo koin dan akses penarikan.</p>
        </div>
        <button 
          onClick={onOpenAuth}
          className="w-full bg-yellow-400 text-slate-950 font-black py-4 rounded-2xl active:scale-95 transition-transform uppercase tracking-widest text-[10px] shadow-xl shadow-yellow-400/10"
        >
          Masuk Sekarang
        </button>
      </div>
    );
  }

  const handleUpdateName = async () => {
    if (newName.trim() && newName !== (user.displayName || user.username)) {
      await onUpdateProfile({ displayName: newName });
    }
    setIsEditingName(false);
  };

  // Format tanggal bergabung untuk tampilan
  const displayJoinedDate = user.joinedDate 
    ? new Date(user.joinedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Baru Saja';

  return (
    <div className="px-6 py-10 space-y-8 animate-fadeIn pb-24">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="w-28 h-28 rounded-[40px] overflow-hidden bg-gradient-to-tr from-yellow-400 to-orange-500 p-1 shadow-2xl shadow-orange-500/20">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt="Avatar" 
                className="w-full h-full object-cover rounded-[36px]"
              />
            ) : (
              <div className="w-full h-full bg-slate-900 rounded-[36px] flex items-center justify-center text-slate-700">
                <UserIcon size={40} />
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-slate-950 p-2 rounded-full border border-slate-800 shadow-xl">
            <Award size={20} className="text-yellow-400" />
          </div>
        </div>
        <div className="text-center w-full px-4">
          <div className="flex items-center justify-center space-x-2">
            {isEditingName ? (
              <div className="flex items-center space-x-2 bg-slate-900 rounded-2xl px-3 py-1.5 border border-white/10">
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                  className="bg-transparent text-white font-black text-xl text-center focus:outline-none w-40"
                  maxLength={20}
                />
                <button onClick={handleUpdateName} className="p-1 text-green-400">
                  <Check size={20} />
                </button>
                <button onClick={() => setIsEditingName(false)} className="p-1 text-red-400">
                  <X size={20} />
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-black truncate max-w-[200px] uppercase tracking-tighter italic">
                  {user.displayName || user.username}
                </h1>
                <button 
                  onClick={() => {
                    setNewName(user.displayName || user.username);
                    setIsEditingName(true);
                  }}
                  className="p-1 text-slate-500 hover:text-yellow-400 transition-colors"
                >
                  <Edit3 size={16} />
                </button>
              </>
            )}
          </div>
          <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">@{user.username}</p>
          <div className="mt-2 bg-slate-900/50 px-4 py-1.5 rounded-full inline-block">
             <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Terdaftar: {displayJoinedDate}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {isAdmin && (
           <button 
           onClick={() => navigate('/admin')}
           className="w-full glass-card p-5 rounded-[24px] flex items-center justify-between border border-yellow-400/20 bg-yellow-400/5 group"
         >
           <div className="flex items-center space-x-4">
             <div className="p-3 bg-yellow-400/10 text-yellow-400 rounded-2xl">
               <ShieldCheck size={24} />
             </div>
             <div className="text-left">
               <p className="font-black text-yellow-400 text-xs uppercase tracking-tight">Akses Administrator</p>
               <p className="text-[10px] text-slate-500 font-black uppercase">Pusat Kendali Filcuan</p>
             </div>
           </div>
           <ChevronRight size={20} className="text-slate-600 group-hover:text-white" />
         </button>
        )}

        <button className="w-full glass-card p-5 rounded-[24px] flex items-center justify-between group active:scale-[0.98] transition-all">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-800 text-slate-400 rounded-2xl">
              <Share2 size={24} />
            </div>
            <div className="text-left">
              <p className="font-black text-xs uppercase tracking-tight">Undang Rekan</p>
              <p className="text-[10px] text-slate-500 font-black uppercase">Dapatkan Bonus Referral</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-slate-600" />
        </button>

        <h3 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] pt-4 pl-1">Kebijakan & Navigasi</h3>

        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/about')} className="glass-card p-5 rounded-3xl flex flex-col space-y-3 active:scale-95 transition-all text-left">
            <div className="w-10 h-10 bg-slate-900 text-yellow-400 rounded-2xl flex items-center justify-center border border-white/5">
              <Info size={20} />
            </div>
            <p className="font-black text-[10px] uppercase tracking-tight">Tentang Kami</p>
          </button>
          
          <button onClick={() => navigate('/privacy')} className="glass-card p-5 rounded-3xl flex flex-col space-y-3 active:scale-95 transition-all text-left">
            <div className="w-10 h-10 bg-slate-900 text-purple-400 rounded-2xl flex items-center justify-center border border-white/5">
              <ShieldAlert size={20} />
            </div>
            <p className="font-black text-[10px] uppercase tracking-tight">Privasi</p>
          </button>

          <button onClick={() => navigate('/tos')} className="glass-card p-5 rounded-3xl flex flex-col space-y-3 active:scale-95 transition-all text-left">
            <div className="w-10 h-10 bg-slate-900 text-blue-400 rounded-2xl flex items-center justify-center border border-white/5">
              <FileText size={20} />
            </div>
            <p className="font-black text-[10px] uppercase tracking-tight">Aturan Main</p>
          </button>

          <button onClick={() => navigate('/sitemap')} className="glass-card p-5 rounded-3xl flex flex-col space-y-3 active:scale-95 transition-all text-left">
            <div className="w-10 h-10 bg-slate-900 text-orange-400 rounded-2xl flex items-center justify-center border border-white/5">
              <ListTree size={20} />
            </div>
            <p className="font-black text-[10px] uppercase tracking-tight">Sitemap</p>
          </button>
        </div>

        <button onClick={() => navigate('/contact')} className="w-full glass-card p-5 rounded-3xl flex items-center justify-between group mt-2 active:scale-[0.98] transition-all">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-slate-800 text-green-400 rounded-2xl">
              <Mail size={24} />
            </div>
            <p className="font-black text-xs uppercase tracking-tight">Hubungi Support</p>
          </div>
          <ChevronRight size={20} className="text-slate-600" />
        </button>

        <button 
          onClick={onLogout}
          className="w-full p-6 rounded-[32px] flex items-center justify-center space-x-2 text-red-500 font-black uppercase tracking-[0.2em] text-[10px] active:bg-red-500/10 transition-colors mt-6"
        >
          <LogOut size={20} />
          <span>Keluar Akun</span>
        </button>
      </div>

      <div className="text-center pt-8">
        <p className="text-[10px] text-slate-700 font-black uppercase tracking-[0.3em]">Filcuan Network • Official</p>
      </div>
    </div>
  );
};

export default ProfileView;
