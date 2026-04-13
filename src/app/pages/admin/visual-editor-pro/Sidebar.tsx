import { Globe, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { Section } from '../../../data/supabase';
import { VisualEditorSidebar } from '../../../components/admin/visual-editor/VisualEditorSidebar';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeSectionES: Section | null;
  activeSectionEN: Section | null;
  handleUpdateSection: (sectionId: string, content: any, lang?: 'es' | 'en' | 'both') => void;
  allProducts: any[];
  allEcosystemMembers: any[];
  pageSlug?: string;
}

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeSectionES,
  activeSectionEN,
  handleUpdateSection,
  allProducts,
  allEcosystemMembers,
  pageSlug
}: SidebarProps) {
  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute z-[999] transition-all duration-300 ease-out bg-white shadow-xl rounded-lg p-2 hover:bg-gray-50 hover:shadow-2xl ${sidebarOpen
            ? 'left-[356px] top-[72px]'
            : 'left-4 top-[72px]'
          }`}
        title="Alternar panel de configuración"
      >
        {sidebarOpen ? <PanelLeftClose className="w-5 h-5 text-[#1C5D15]" /> : <PanelLeftOpen className="w-5 h-5 text-[#1C5D15]" />}
      </button>

      <aside className={`${sidebarOpen ? 'w-[400px]' : 'w-0'} bg-white border-r flex-shrink-0 flex flex-col h-full overflow-hidden shadow-2xl relative z-10 transition-all duration-300 ease-out`}>
        <div className="p-4 border-b bg-gray-50/80 flex items-center justify-between">
          <div>
            <h2 className="font-black text-[#1C5D15] text-xs uppercase tracking-widest">Configuración</h2>
            <p className="text-[10px] text-[#629960] font-medium">Personaliza el bloque seleccionado</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">
          {activeSectionES && activeSectionEN ? (
            <VisualEditorSidebar
              sectionES={activeSectionES}
              sectionEN={activeSectionEN}
              onUpdateSection={handleUpdateSection}
              availableProducts={allProducts}
              availableEcosystemMembers={allEcosystemMembers}
              pageSlug={pageSlug}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-10 select-none">
              <div className="w-20 h-20 bg-[#F7F9CE] rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Globe className="w-10 h-10 text-[#1C5D15]" />
              </div>
              <h3 className="text-[#1C5D15] font-black uppercase text-sm mb-2">Editor en Vivo</h3>
              <p className="text-xs text-[#629960] leading-relaxed">
                Toca cualquier elemento del sitio en el panel derecho para editar sus propiedades, textos e imágenes de forma visual.
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
