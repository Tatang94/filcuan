import React, { useState } from 'react';
import { ShieldAlert, X, Delete } from 'lucide-react';

interface AdminLockOverlayProps {
  onVerify: (pin: string) => boolean;
  onClose: () => void;
}

const AdminLockOverlay: React.FC<AdminLockOverlayProps> = ({ onVerify, onClose }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);
      
      if (newPin.length === 4) {
        const isValid = onVerify(newPin);
        if (!isValid) {
          setTimeout(() => {
            setError(true);
            setPin('');
          }, 200);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-8 animate-fadeIn">
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-colors"
      >
        <X size={28} />
      </button>

      <div className="w-full max-w-xs space-y-12 text-center">
        <div className="space-y-4">
          <div className="w-16 h-16 bg-yellow-400/10 rounded-3xl flex items-center justify-center mx-auto border border-yellow-400/20">
            <ShieldAlert size={32} className="text-yellow-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-white uppercase tracking-tight">Admin Restricted</h2>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Masukkan PIN untuk Lanjut</p>
          </div>
        </div>

        {/* PIN Indicators */}
        <div className={`flex justify-center space-x-6 ${error ? 'animate-bounce text-red-500' : ''}`}>
          {[0, 1, 2, 3].map((i) => (
            <div 
              key={i} 
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                pin.length > i 
                  ? 'bg-yellow-400 border-yellow-400 scale-125 shadow-[0_0_15px_rgba(234,179,8,0.5)]' 
                  : 'border-slate-800'
              } ${error ? 'border-red-500 bg-red-500' : ''}`}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="w-full aspect-square flex items-center justify-center text-2xl font-black text-white bg-white/5 rounded-3xl border border-white/5 active:bg-yellow-400 active:text-slate-950 transition-all active:scale-90"
            >
              {num}
            </button>
          ))}
          <div />
          <button
            onClick={() => handleNumberClick('0')}
            className="w-full aspect-square flex items-center justify-center text-2xl font-black text-white bg-white/5 rounded-3xl border border-white/5 active:bg-yellow-400 active:text-slate-950 transition-all active:scale-90"
          >
            0
          </button>
          <button
            onClick={handleBackspace}
            className="w-full aspect-square flex items-center justify-center text-slate-500 active:text-white transition-colors"
          >
            <Delete size={28} />
          </button>
        </div>
        
        {error && (
          <p className="text-red-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
            PIN Salah! Silakan Coba Lagi.
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminLockOverlay;