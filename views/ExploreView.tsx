
import React, { useState, useEffect } from 'react';
import { Search, Zap, AlertCircle } from 'lucide-react';
import { getAllContent, getThemes } from '../services/data';
import { CuanContent, CuanTheme } from '../types';

const ExploreView: React.FC = () => {
  const [contents, setContents] = useState<CuanContent[]>([]);
  const [themes, setThemes] = useState<CuanTheme[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeThemeId, setActiveThemeId] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const [data, ts] = await Promise.all([getAllContent(), getThemes()]);
      setContents(data);
      setThemes(ts);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredContents = contents.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTheme = activeThemeId === 'all' || item.themeId === activeThemeId;
    
    return matchesSearch && matchesTheme;
  });

  return (
    <div className="px-6 py-8 animate-fadeIn pb-24">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-white">Jelajah</h1>
        <Zap className="text-yellow-400" size={24} fill="currentColor" />
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari tema lukisan..." 
          className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition-all placeholder:text-slate-600 text-white"
        />
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-6 -mx-6 px-6 scrollbar-hide">
        <button
          onClick={() => setActiveThemeId('all')}
          className={`px-6 py-2.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all uppercase tracking-widest ${
            activeThemeId === 'all' 
              ? 'bg-yellow-400 text-slate-950 shadow-lg' 
              : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
        >
          Semua Tema
        </button>
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setActiveThemeId(theme.id)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black whitespace-nowrap transition-all uppercase tracking-widest ${
              activeThemeId === theme.id 
                ? 'bg-yellow-400 text-slate-950 shadow-lg' 
                : 'bg-slate-900 text-slate-400 border border-slate-800'
          }`}
          >
            {theme.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-6">
        {filteredContents.map((item) => (
          <div key={item.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl bg-slate-900 ring-1 ring-white/5">
            <img 
              src={item.image_url} 
              alt={item.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-3 flex flex-col justify-end">
               <h3 className="text-[10px] font-black line-clamp-1 uppercase tracking-tight text-white">{item.title}</h3>
               <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                  {themes.find(t => t.id === item.themeId)?.name || 'Eksklusif'}
               </p>
            </div>
          </div>
        ))}
        {filteredContents.length === 0 && !loading && (
          <div className="col-span-2 py-20 text-center space-y-4 opacity-40">
            <AlertCircle className="mx-auto text-slate-800" size={48} />
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest leading-loose px-10">Belum ada karya untuk tema ini.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreView;
