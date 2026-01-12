
import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Activity, RefreshCw, Wand2, Stars, Sparkles, LayoutGrid, Banknote, ArrowLeft, Loader2, Image as ImageIcon, Tag
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CuanTheme, CuanContent, WithdrawalRequest } from '../types';
import { 
  getThemes, saveTheme, deleteTheme,
  getAllContent, saveContent, deleteContent,
  getPayouts, updateWithdrawalStatus,
  uploadMedia
} from '../services/data';
import { GoogleGenAI } from "@google/genai";

const AdminView: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stats' | 'themes' | 'contents' | 'payouts'>('stats');
  const [loading, setLoading] = useState(true);
  
  const [themes, setThemes] = useState<CuanTheme[]>([]);
  const [contents, setContents] = useState<CuanContent[]>([]);
  const [payouts, setPayouts] = useState<WithdrawalRequest[]>([]);

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedThemeId, setSelectedThemeId] = useState('');

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [ts, data, pays] = await Promise.all([
        getThemes(),
        getAllContent(),
        getPayouts()
      ]);
      setThemes(ts);
      setContents(data);
      setPayouts(pays as any);
      if (ts.length > 0) setSelectedThemeId(ts[0].id);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleGenerateAICinematic = async () => {
    if (!aiPrompt.trim()) return;
    if (themes.length === 0) {
      alert("Buat tema lukisan dulu di tab Tema!");
      return;
    }

    setIsGeneratingAI(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { 
          parts: [{ text: `Digital art masterpiece, detailed, cinematic, 4:5 ratio: ${aiPrompt}` }] 
        },
      });

      let base64Data = '';
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Data = part.inlineData.data;
          break;
        }
      }

      if (!base64Data) throw new Error("Gagal melukis gambar.");

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/png' });

      const finalUrl = await uploadMedia(blob, 'contents');

      await saveContent({
        id: `ai-${Date.now()}`,
        title: aiPrompt.substring(0, 30),
        image_url: finalUrl,
        poster: finalUrl,
        themeId: selectedThemeId || themes[0].id,
        description: `Admin AI Masterpiece`,
        tags: ['AI', 'Premium']
      });

      setIsAIModalOpen(false);
      setAiPrompt('');
      alert("Lukisan Berhasil Diterbitkan!");
      loadAllData();
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAddTheme = async () => {
    const name = prompt("Nama Tema Lukisan Baru:");
    if (name) {
      await saveTheme({ id: Date.now().toString(), name });
      loadAllData();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 animate-fadeIn">
      {/* AI MODAL */}
      {isAIModalOpen && (
        <div className="fixed inset-0 z-[150] bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-6">
          <div className="w-full max-w-sm bg-slate-900 border border-white/5 rounded-[48px] p-8 space-y-6 shadow-2xl">
            <div className="flex items-center space-x-3 text-yellow-400">
               <Stars size={24} />
               <h3 className="text-xl font-black uppercase italic">AI Studio</h3>
            </div>
            
            {!isGeneratingAI ? (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1 mb-2 block">Pilih Tema Koleksi</label>
                    <select 
                      value={selectedThemeId}
                      onChange={(e) => setSelectedThemeId(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-xs text-white outline-none"
                    >
                      {themes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-1 mb-2 block">Deskripsi Lukisan</label>
                    <textarea 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Gambarkan lukisan yang ingin dibuat..."
                      className="w-full bg-slate-950 border border-white/5 rounded-3xl p-6 text-xs text-white focus:ring-1 focus:ring-yellow-400 outline-none h-32 resize-none"
                    />
                  </div>
                </div>
                <div className="flex space-x-3">
                  <button onClick={() => setIsAIModalOpen(false)} className="flex-1 py-4 text-slate-500 font-black uppercase text-[10px]">Batal</button>
                  <button onClick={handleGenerateAICinematic} className="flex-[2] bg-yellow-400 text-slate-950 py-4 rounded-2xl font-black uppercase text-[10px]">Lukis & Publish</button>
                </div>
              </>
            ) : (
              <div className="py-12 text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 border-4 border-yellow-400/20 rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm font-black text-white uppercase italic animate-pulse">Sedang Melukis...</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="sticky top-0 bg-slate-950/80 backdrop-blur-xl z-40 px-6 py-8 border-b border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <button onClick={() => navigate(-1)} className="p-3 bg-slate-900 rounded-[20px] text-slate-400"><ArrowLeft size={20} /></button>
            <div>
              <h1 className="text-xl font-black italic uppercase tracking-tighter">Admin Panel</h1>
              <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Manajemen Karya</p>
            </div>
          </div>
          <button onClick={loadAllData} className="p-3 bg-slate-900 rounded-[20px] text-yellow-400"><RefreshCw size={20} /></button>
        </div>

        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'stats', icon: <Activity size={16} />, label: 'Stats' },
            { id: 'themes', icon: <Tag size={16} />, label: 'Tema' },
            { id: 'contents', icon: <ImageIcon size={16} />, label: 'Karya' },
            { id: 'payouts', icon: <Banknote size={16} />, label: 'Dana' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id ? 'bg-white text-slate-950' : 'bg-slate-900 text-slate-500'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 mt-8">
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-yellow-400" /></div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'stats' && (
              <div className="grid grid-cols-1 gap-4">
                <button 
                  onClick={() => setIsAIModalOpen(true)}
                  className="bg-gradient-to-tr from-yellow-400 to-orange-500 p-8 rounded-[40px] flex items-center justify-between group"
                >
                  <div className="flex items-center space-x-5">
                    <div className="bg-white/20 p-4 rounded-[24px]"><Wand2 className="text-white" size={28} /></div>
                    <div className="text-left text-slate-950">
                      <p className="text-lg font-black uppercase italic tracking-tighter">Buat Lukisan AI</p>
                      <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Gemini Art Generation</p>
                    </div>
                  </div>
                  <Plus className="text-slate-950" size={28} />
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-900 p-6 rounded-[32px] border border-white/5">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Total Tema</p>
                    <p className="text-2xl font-black">{themes.length}</p>
                  </div>
                  <div className="bg-slate-900 p-6 rounded-[32px] border border-white/5">
                    <p className="text-[10px] font-black uppercase text-slate-500 mb-1">Total Karya</p>
                    <p className="text-2xl font-black">{contents.length}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'themes' && (
              <div className="space-y-4">
                <button 
                  onClick={handleAddTheme}
                  className="w-full bg-slate-900 border border-white/5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 text-yellow-400"
                >
                  <Plus size={16} />
                  <span>Tambah Tema Baru</span>
                </button>
                {themes.map(t => (
                  <div key={t.id} className="bg-slate-900 p-5 rounded-3xl border border-white/5 flex items-center justify-between">
                    <p className="text-xs font-black uppercase italic">{t.name}</p>
                    <button onClick={() => deleteTheme(t.id).then(loadAllData)} className="text-red-500 opacity-50"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contents' && (
              <div className="grid grid-cols-1 gap-4">
                {contents.map(v => (
                  <div key={v.id} className="bg-slate-900 p-4 rounded-3xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-4 overflow-hidden">
                      <img src={v.image_url} className="w-12 h-12 rounded-xl object-cover" alt="" />
                      <div>
                        <p className="text-xs font-black text-white truncate max-w-[150px] uppercase italic">{v.title}</p>
                        <p className="text-[8px] text-slate-500 font-bold uppercase">{themes.find(t => t.id === v.themeId)?.name}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteContent(v.id).then(loadAllData)} className="text-red-500 p-3 bg-red-500/10 rounded-xl"><Trash2 size={18} /></button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'payouts' && (
              <div className="space-y-4">
                {payouts.map((p: any) => (
                  <div key={p.id} className="bg-slate-900 p-6 rounded-[32px] border border-white/5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-black text-white uppercase tracking-tight italic">@{p.username}</p>
                        <p className="text-xl font-black text-yellow-400">Rp {p.amount.toLocaleString()}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Via: {p.method}</p>
                      </div>
                      <span className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-full ${
                        p.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                        p.status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                        'bg-yellow-500/10 text-yellow-500'
                      }`}>{p.status}</span>
                    </div>
                    {p.status === 'pending' && (
                      <div className="flex space-x-3">
                        <button onClick={() => updateWithdrawalStatus(p.id, 'approved').then(loadAllData)} className="flex-1 bg-green-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase">Approve</button>
                        <button onClick={() => updateWithdrawalStatus(p.id, 'rejected').then(loadAllData)} className="flex-1 bg-slate-800 text-red-500 py-4 rounded-2xl text-[10px] font-black uppercase">Reject</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;
