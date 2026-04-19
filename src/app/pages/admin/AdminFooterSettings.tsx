import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Sparkles, Layout } from 'lucide-react';
import { useNavigate } from 'react-router';

export function AdminFooterSettings() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnterEditor = () => {
    navigate('/admin/visual-editor/footer/global');
  };

  return (
    <div className="p-4 md:p-8 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-gradient-to-r from-[#19FF00]/20 to-[#1C5D15]/20 blur-2xl rounded-full opacity-50 animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-3xl shadow-xl border border-[#1C5D15]/10">
            <Layout className="w-16 h-16 text-[#1C5D15] mx-auto" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black text-[#1C5D15] tracking-tight">
            Editor Visual del <span className="text-[#19FF00]">Footer</span>
          </h1>
          <p className="text-lg text-[#629960] leading-relaxed">
            Hemos unificado la gestión del footer. Ahora puedes editar los enlaces, 
            redes sociales y textos legales directamente sobre la previsualización real del sitio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          {[
            { title: 'Gestión de Enlaces', desc: 'Añade o quita columnas y links dinámicamente.' },
            { title: 'Redes Sociales', desc: 'Configura tus perfiles oficiales de forma visual.' },
            { title: 'Textos Legales', desc: 'Cambia el copyright y avisos del pie de página.' },
            { title: 'Vista Previa', desc: 'Mira cómo queda en móvil, tablet y escritorio al instante.' }
          ].map((feat, i) => (
            <div key={i} className="p-4 bg-[#F7F9CE]/30 rounded-2xl border border-[#1C5D15]/5">
              <h3 className="font-bold text-[#1C5D15] text-sm mb-1">{feat.title}</h3>
              <p className="text-xs text-[#629960]">{feat.desc}</p>
            </div>
          ))}
        </div>

        <Button 
          onClick={handleEnterEditor}
          disabled={isLoading}
          className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15] px-12 py-8 rounded-2xl font-black uppercase text-lg tracking-widest shadow-[0_20px_40px_-15px_rgba(28,93,21,0.3)] hover:scale-105 transition-all group"
        >
          <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
          Abrir Editor Visual
        </Button>

        <p className="text-[10px] text-[#629960]/60 font-medium uppercase tracking-[0.2em]">
          BionanoAYT Admin v2.0 • Pro Visual Engine
        </p>
      </div>
    </div>
  );
}