import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Info, FileText, Mail, ShieldCheck, Copy, ExternalLink, ShieldAlert, ListTree, Home, Compass, Gift, User, Settings } from 'lucide-react';

interface InfoViewProps {
  type: 'about' | 'tos' | 'contact' | 'privacy' | 'sitemap';
}

const InfoView: React.FC<InfoViewProps> = ({ type }) => {
  const navigate = useNavigate();

  const getContent = () => {
    switch (type) {
      case 'about':
        return {
          title: 'Tentang Kami',
          icon: <Info className="text-yellow-400" />,
          status: 'Filcuan Official Platform',
          body: (
            <div className="space-y-4 text-slate-400 text-sm leading-relaxed">
              <p className="font-bold text-white text-lg italic uppercase tracking-tighter">FILCUAN: Nonton Jadi Cuan</p>
              <p>
                FILCUAN adalah platform hiburan digital terdepan yang mengintegrasikan konten video berkualitas dengan sistem imbalan ekonomi langsung kepada pengguna.
              </p>
              <p>
                Kami percaya bahwa waktu Anda sangat berharga. Melalui teknologi sinkronisasi koin real-time kami, setiap detik yang Anda habiskan untuk menikmati konten akan dihargai secara adil.
              </p>
              <div className="bg-slate-900/50 p-6 rounded-[32px] border border-white/5 space-y-3 mt-6">
                <p className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em]">Keunggulan Ekosistem</p>
                <ul className="space-y-3 text-[11px] font-bold uppercase tracking-wide">
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    <span>Transparansi Koin Real-time</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    <span>Penarikan Aman via E-Wallet</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    <span>Data Tersinkronisasi Cloud</span>
                  </li>
                </ul>
              </div>
            </div>
          )
        };
      case 'tos':
        return {
          title: 'Ketentuan Layanan',
          icon: <FileText className="text-blue-400" />,
          status: 'Update Terakhir: 2024',
          body: (
            <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
              <section className="space-y-2">
                <p className="text-xs font-black text-white uppercase tracking-widest">1. Penggunaan Akun</p>
                <p>Setiap individu hanya diperbolehkan memiliki satu akun terverifikasi. Penggunaan bot atau emulator dilarang keras.</p>
              </section>
              <section className="space-y-2">
                <p className="text-xs font-black text-white uppercase tracking-widest">2. Akumulasi Koin</p>
                <p>Koin diperoleh melalui aktivitas menonton yang aktif. Sistem mendeteksi keberadaan penonton secara berkala.</p>
              </section>
              <section className="space-y-2">
                <p className="text-xs font-black text-white uppercase tracking-widest">3. Kebijakan Withdrawal</p>
                <p>Proses pencairan dana diproses setiap tanggal 30. Waktu pemrosesan dapat memakan waktu 1-3 hari kerja tergantung beban sistem.</p>
              </section>
            </div>
          )
        };
      case 'privacy':
        return {
          title: 'Kebijakan Privasi',
          icon: <ShieldAlert className="text-purple-400" />,
          status: 'Data Keamanan Terjamin',
          body: (
            <div className="space-y-6 text-slate-400 text-sm leading-relaxed">
              <section className="space-y-2">
                <p className="text-xs font-black text-white uppercase tracking-widest">Penyimpanan Data</p>
                <p>Data profil dan saldo koin Anda disimpan dengan enkripsi tingkat tinggi di database Supabase kami. Kami tidak pernah membagikan data pribadi Anda kepada pihak ketiga tanpa izin eksplisit.</p>
              </section>
              <section className="space-y-2">
                <p className="text-xs font-black text-white uppercase tracking-widest">Keamanan Transaksi</p>
                <p>Setiap permintaan penarikan melalui proses verifikasi manual dan otomatis untuk mencegah aktivitas mencurigakan dan memastikan dana sampai ke tujuan yang benar.</p>
              </section>
              <section className="space-y-2">
                <p className="text-xs font-black text-white uppercase tracking-widest">Kontrol Pengguna</p>
                <p>Anda memiliki hak penuh untuk mengedit nama tampilan dan memantau riwayat aktivitas Anda melalui halaman profil.</p>
              </section>
            </div>
          )
        };
      case 'sitemap':
        const links = [
          { icon: <Home size={16} />, label: 'Beranda Utama', path: '/' },
          { icon: <Compass size={16} />, label: 'Pusat Jelajah Konten', path: '/explore' },
          { icon: <Gift size={16} />, label: 'Dompet & Hadiah', path: '/rewards' },
          { icon: <User size={16} />, label: 'Profil Saya', path: '/profile' },
          { icon: <Settings size={16} />, label: 'Pengaturan Akun', path: '/profile' },
          { icon: <ShieldCheck size={16} />, label: 'Autentikasi Aman', path: '/auth' },
        ];
        return {
          title: 'Sitemap Aplikasi',
          icon: <ListTree className="text-orange-400" />,
          status: 'Navigasi Cepat',
          body: (
            <div className="space-y-4">
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest pl-1 mb-2">Struktur Navigasi Filcuan</p>
              <div className="grid gap-3">
                {links.map((link, idx) => (
                  <button 
                    key={idx}
                    onClick={() => navigate(link.path)}
                    className="flex items-center justify-between p-4 glass-card rounded-2xl border border-white/5 active:scale-95 transition-all text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-slate-950 rounded-lg text-slate-400">{link.icon}</div>
                      <span className="text-xs font-bold text-white uppercase tracking-tight">{link.label}</span>
                    </div>
                    <ChevronLeft size={16} className="rotate-180 text-slate-600" />
                  </button>
                ))}
              </div>
            </div>
          )
        };
      case 'contact':
        const email = 'tatangtaryaedi.tte@gmail.com';
        return {
          title: 'Hubungi Kami',
          icon: <Mail className="text-green-400" />,
          status: 'Layanan Support 24/7',
          body: (
            <div className="space-y-6">
              <div className="text-center space-y-2 py-4">
                <div className="w-20 h-20 bg-slate-900 rounded-[32px] flex items-center justify-center mx-auto border border-white/5 shadow-xl">
                  <Mail size={32} className="text-slate-400" />
                </div>
                <h3 className="font-black text-white uppercase tracking-tight italic pt-2">Bantuan Teknis</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Respon cepat via email resmi</p>
              </div>

              <div className="glass-card p-6 rounded-[32px] border border-white/5 space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Official Email</p>
                  <p className="text-sm font-black text-yellow-400 break-all">{email}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => {
                      navigator.clipboard.writeText(email);
                      alert('Email berhasil disalin!');
                    }}
                    className="flex items-center justify-center space-x-2 bg-slate-800 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                  >
                    <Copy size={14} />
                    <span>Salin</span>
                  </button>
                  <a 
                    href={`mailto:${email}`}
                    className="flex items-center justify-center space-x-2 bg-white text-slate-950 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform"
                  >
                    <ExternalLink size={14} />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-600 font-black uppercase tracking-[0.2em] pt-8">
                <ShieldCheck size={14} className="text-green-500/50" />
                <span>Verified Official Support</span>
              </div>
            </div>
          )
        };
    }
  };

  const content = getContent();

  return (
    <div className="min-h-screen bg-slate-950 pb-20 animate-fadeIn">
      <div className="p-6 flex items-center justify-between sticky top-0 bg-slate-950/80 backdrop-blur-xl z-30 border-b border-white/5">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-3 bg-white/5 rounded-2xl active:scale-95 transition-transform border border-white/10"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <div className="space-y-0.5">
            <h1 className="text-lg font-black tracking-tight uppercase italic">{content.title}</h1>
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{content.status}</p>
          </div>
        </div>
        <div className="p-2 bg-slate-900 rounded-xl">
          {content.icon}
        </div>
      </div>

      <div className="px-8 py-10">
        {content.body}
      </div>
    </div>
  );
};

export default InfoView;