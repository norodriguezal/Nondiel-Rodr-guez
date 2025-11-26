import React from 'react';
import { Menu, Search, MousePointer2, Smartphone } from 'lucide-react';

interface HUDProps {
  onMenuClick?: () => void;
}

const HUD: React.FC<HUDProps> = ({ onMenuClick }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6 md:p-10">
      {/* Top Header */}
      <div className="flex justify-between items-start">
        <div className="pointer-events-auto">
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tighter drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
            LA REALIDAD <span className="text-holo-cyan">VIRTUAL</span>
            <br />
            Y REALIDAD <span className="text-[#00ff88]">AUMENTADA</span>
          </h1>
          <p className="text-white/80 font-mono text-sm tracking-[0.2em] mt-2 border-l-2 border-holo-pink pl-3">
            EXPLORACIÓN INMERSIVA v2.0
          </p>
        </div>
        
        <div className="flex gap-4 pointer-events-auto">
          <button className="p-3 bg-black/50 border border-white/20 text-white hover:border-holo-cyan hover:text-holo-cyan rounded-full transition-all">
            <Search className="w-5 h-5" />
          </button>
          <button className="p-3 bg-black/50 border border-white/20 text-white hover:border-holo-pink hover:text-holo-pink rounded-full transition-all">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Reticle (Decorative) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border border-white/5 rounded-full pointer-events-none flex items-center justify-center">
        <div className="w-[280px] h-[280px] border border-dashed border-white/10 rounded-full animate-spin-slow"></div>
        <div className="w-2 h-2 bg-white/20 rounded-full"></div>
      </div>

      {/* Bottom Instructions */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div className="pointer-events-auto bg-black/60 backdrop-blur-md p-4 rounded border border-white/10 max-w-lg">
          <div className="flex items-center gap-3 text-white/80 mb-2">
            <MousePointer2 className="w-4 h-4 text-holo-cyan hidden md:block" />
            <Smartphone className="w-4 h-4 text-holo-cyan md:hidden" />
            <span className="text-xs font-display uppercase tracking-widest">Controles de Navegación</span>
          </div>
          <p className="text-sm text-gray-300 font-mono leading-relaxed">
            🖱️ Arrastra para explorar el espacio | 👆 Haz clic en las esferas para ver información
          </p>
        </div>

        <div className="flex gap-2 font-mono text-xs text-holo-cyan/50 pointer-events-auto">
          <div className="px-3 py-1 border border-holo-cyan/20 rounded-full">SYS: ONLINE</div>
          <div className="px-3 py-1 border border-holo-cyan/20 rounded-full animate-pulse">NET: STABLE</div>
        </div>
      </div>
    </div>
  );
};

export default HUD;