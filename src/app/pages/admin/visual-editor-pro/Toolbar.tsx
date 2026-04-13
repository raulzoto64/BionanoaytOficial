import { Button } from '../../../components/ui/button';
import {
  ChevronLeft,
  Save,
  Monitor,
  Tablet,
  Smartphone,
  Loader2,
  ExternalLink
} from 'lucide-react';

interface ToolbarProps {
  pageTitle: string;
  onBack: () => void;
  deviceView: 'desktop' | 'tablet' | 'mobile';
  setDeviceView: (view: 'desktop' | 'tablet' | 'mobile') => void;
  deviceOrientation: 'portrait' | 'landscape';
  setDeviceOrientation: (o: 'portrait' | 'landscape') => void;
  activeLanguage: 'es' | 'en';
  setActiveLanguage: (lang: 'es' | 'en') => void;
  onViewLive: () => void;
  onSave: () => void;
  saving: boolean;
  setCustomWidth: (w: number | null) => void;
}

export function Toolbar({
  pageTitle,
  onBack,
  deviceView,
  setDeviceView,
  deviceOrientation,
  setDeviceOrientation,
  activeLanguage,
  setActiveLanguage,
  onViewLive,
  onSave,
  saving,
  setCustomWidth
}: ToolbarProps) {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6 shrink-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-[#629960] hover:text-[#1C5D15] hover:bg-[#1C5D15]/5 rounded-full"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          Volver
        </Button>
        <div className="h-6 w-px bg-gray-200"></div>
        <div>
          <h1 className="font-extrabold text-[#1C5D15] text-sm uppercase tracking-tighter">
            {pageTitle}
          </h1>
          <p className="text-[10px] text-[#629960] font-medium uppercase tracking-widest leading-none">Editor Visual Pro</p>
        </div>
      </div>

      {/* Viewport Switcher */}
      <div className="flex items-center gap-1 bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
        <button
          onClick={() => { setDeviceView('mobile'); setCustomWidth(null); }}
          className={`p-2 rounded-xl transition-all ${deviceView === 'mobile' ? 'bg-white text-[#1C5D15] shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          title="Móvil"
        >
          <Smartphone className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setDeviceView('tablet'); setCustomWidth(null); }}
          className={`p-2 rounded-xl transition-all ${deviceView === 'tablet' ? 'bg-white text-[#1C5D15] shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          title="Tablet"
        >
          <Tablet className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setDeviceView('desktop'); setCustomWidth(null); }}
          className={`p-2 rounded-xl transition-all ${deviceView === 'desktop' ? 'bg-white text-[#1C5D15] shadow-md scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          title="Escritorio (100%)"
        >
          <Monitor className="w-4 h-4" />
        </button>

        {deviceView !== 'desktop' && (
          <>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button
              onClick={() => { setDeviceOrientation(deviceOrientation === 'portrait' ? 'landscape' : 'portrait'); setCustomWidth(null); }}
              className={`p-2 rounded-xl transition-all bg-white text-[#1C5D15] shadow-sm hover:scale-105`}
              title="Rotar dispositivo"
            >
              <Smartphone className={`w-4 h-4 transition-transform duration-500 ${deviceOrientation === 'landscape' ? '-rotate-90' : ''}`} />
            </button>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="flex items-center bg-gray-100 border rounded-xl p-1 gap-1">
          <button
            className={`h-7 px-3 text-[10px] font-black rounded-lg transition-all ${activeLanguage === 'es' ? 'bg-[#1C5D15] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveLanguage('es')}
          >
            ES
          </button>
          <button
            className={`h-7 px-3 text-[10px] font-black rounded-lg transition-all ${activeLanguage === 'en' ? 'bg-[#1C5D15] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveLanguage('en')}
          >
            EN
          </button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onViewLive}
          className="rounded-full border-[#1C5D15]/20 text-[#1C5D15] hover:bg-[#1C5D15]/5 h-9 font-bold text-xs"
        >
          <ExternalLink className="w-3.5 h-3.5 mr-2" />
          Previsualizar
        </Button>

        <Button
          onClick={onSave}
          disabled={saving}
          className="bg-[#1C5D15] hover:bg-[#19FF00] hover:text-[#1C5D15] text-white rounded-full px-6 font-bold shadow-lg shadow-[#1C5D15]/20 h-9 transition-all active:scale-95"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Publicar
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
