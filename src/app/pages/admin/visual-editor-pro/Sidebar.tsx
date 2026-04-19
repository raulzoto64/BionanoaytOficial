import { useState, useEffect } from 'react';
import { Globe, PanelLeftClose, PanelLeftOpen, Layout, BarChart, Users, ShoppingBag, Newspaper, HelpCircle, Zap, Type, Quote, Clock, History, Star, Handshake, Award, BadgeCheck, Layers, MessageSquare, FolderKanban, UsersRound, FileText, Sparkles, Target, CheckSquare, Database, Plus } from 'lucide-react';
import { Section, supabaseAPI, ReusableSection } from '../../../data/supabase';
import { VisualEditorSidebar } from '../../../components/admin/visual-editor/VisualEditorSidebar';

// Helper component for dynamic icons
const Icon = ({ name, className }: { name: string, className?: string }) => {
  const icons: any = {
    Layout, BarChart, Users, Globe, ShoppingBag, Newspaper, HelpCircle, Zap, Type,
    Quote, Clock, History, Star, Handshake, Award, BadgeCheck, Layers, MessageSquare,
    FolderKanban, UsersRound, FileText, Sparkles, Target, CheckSquare
  };
  const Comp = icons[name] || Globe;
  return <Comp className={className} />;
};

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeSectionES: Section | null;
  activeSectionEN: Section | null;
  handleUpdateSection: (sectionId: string, content: any, lang?: 'es' | 'en' | 'both') => void;
  onAddSection?: (type: string) => void;
  allProducts: any[];
  allEcosystemMembers: any[];
  availableForms?: any[];
  pageSlug?: string;
  onAddLibrarySection?: (section: ReusableSection) => void;
}

export function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  activeSectionES,
  activeSectionEN,
  handleUpdateSection,
  onAddSection,
  allProducts,
  allEcosystemMembers,
  availableForms = [],
  pageSlug,
  onAddLibrarySection
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'sections' | 'config'>('sections');
  const [librarySections, setLibrarySections] = useState<ReusableSection[]>([]);

  // Cargar secciones de la biblioteca
  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const data = await supabaseAPI.getReusableSections();
        setLibrarySections(data || []);
      } catch (error) {
        console.error("Error fetching library sections:", error);
      }
    };
    fetchLibrary();
  }, [activeTab]);

  // Auto cambiar a pestaña configuracion cuando seleccionas una seccion
  useEffect(() => {
    if (activeSectionES) {
      setActiveTab('config');
    }
  }, [activeSectionES]);

  const sectionTypes = [
    // SECCIONES ORIGINALES
    { type: 'hero', label: 'Banner Principal', icon: 'Layout' },
    { type: 'stats', label: 'Estadísticas', icon: 'BarChart' },
    { type: 'category-filter', label: 'Directorio Ecosistema', icon: 'Users' },
    { type: 'ecosystem', label: 'Nuestra Red (Features)', icon: 'Globe' },
    { type: 'products', label: 'Catálogo de Productos', icon: 'ShoppingBag' },
    { type: 'news', label: 'Noticias Actuales', icon: 'Newspaper' },
    { type: 'faq', label: 'Preguntas Frecuentes', icon: 'HelpCircle' },
    { type: 'cta', label: 'Llamado a la Acción', icon: 'Zap' },
    { type: 'text', label: 'Bloque de Texto', icon: 'Type' },

    // SECCIONES ADICIONALES IMPLEMENTADAS
    { type: 'hero-blog', label: 'Hero Blog', icon: 'FileText' },
    { type: 'bento', label: 'Bento / Por Qué Elegirnos', icon: 'Layers' },
    { type: 'quote', label: 'Cita / Testimonio', icon: 'Quote' },
    { type: 'timeline', label: 'Línea de Tiempo', icon: 'Clock' },
    { type: 'history', label: 'Historia de la Empresa', icon: 'History' },
    { type: 'features', label: 'Características / Propósitos', icon: 'Star' },
    { type: 'trust', label: 'Aliados / Confianza', icon: 'Handshake' },
    { type: 'featured', label: 'Destacados', icon: 'Award' },
    { type: 'team', label: 'Equipo', icon: 'UsersRound' },
    { type: 'problems', label: 'Problemas que Solucionamos', icon: 'Target' },
    { type: 'sectors', label: 'Sectores / Industrias', icon: 'FolderKanban' },
    { type: 'certifications', label: 'Certificaciones', icon: 'BadgeCheck' },
    { type: 'flipcards', label: 'Tarjetas Giratorias', icon: 'Sparkles' },
    { type: 'clientes', label: 'Logos de Clientes', icon: 'CheckSquare' },
    { type: 'custom', label: 'Sección Personalizada', icon: 'MessageSquare' },
    { type: 'blog', label: 'Sección de Blog', icon: 'Newspaper' },
  ];

  return (
    <>
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute z-[999] transition-all duration-300 ease-out bg-white shadow-xl rounded-lg p-2 hover:bg-gray-50 hover:shadow-2xl left-4 top-[16px] ${sidebarOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        title="Abrir panel de configuración"
      >
        <PanelLeftOpen className="w-5 h-5 text-[#1C5D15]" />
      </button>

      <aside className={`${sidebarOpen ? 'w-[400px]' : 'w-0'} bg-white border-r flex-shrink-0 flex flex-col h-full overflow-hidden shadow-2xl relative z-10 transition-all duration-300 ease-out`}>
        <div className="p-4 border-b bg-gray-50/80">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-black text-[#1C5D15] text-xs uppercase tracking-widest leading-none mb-1">Editor Visual</h2>
              <p className="text-[9px] text-[#629960] font-bold uppercase tracking-tighter">Personaliza tu contenido</p>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
              title="Cerrar panel"
            >
              <PanelLeftClose className="w-4 h-4 text-[#1C5D15]" />
            </button>
          </div>

          {/* TABS MENU HORIZONTAL COMO ELEMENTOR */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setActiveTab('sections');
                // Reset forzar completamente para que se pueda volver a seleccionar la misma seccion
                window.dispatchEvent(new CustomEvent('editor:deselect-section'));
                console.log('[EDITOR] Seccion deseleccionada automaticamente al ir a pestaña Secciones');
              }}
              className={`flex-1 py-1.5 px-3 rounded-md text-[10px] font-bold uppercase transition-all ${activeTab === 'sections'
                  ? 'bg-white text-[#1C5D15] shadow-sm'
                  : 'text-gray-500 hover:text-[#1C5D15]'
                }`}
            >
              📋 Secciones
            </button>
            <button
              onClick={() => setActiveTab('config')}
              className={`flex-1 py-1.5 px-3 rounded-md text-[10px] font-bold uppercase transition-all ${activeTab === 'config'
                  ? 'bg-white text-[#1C5D15] shadow-sm'
                  : 'text-gray-500 hover:text-[#1C5D15]'
                }`}
            >
              ⚙️ Configuración
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">

          {/* TAB SECCIONES - GRID PERMANENTE CON TODOS LOS ICONOS */}
          {activeTab === 'sections' && (
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-[#1C5D15] font-black uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#19FF00]" />
                  Biblioteca de Secciones
                </h3>
                {librarySections.length === 0 ? (
                  <p className="text-[10px] text-[#629960] italic bg-gray-50 p-4 rounded-2xl border text-center">
                    No hay secciones guardadas en la biblioteca todavía.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {librarySections.map((libSection: ReusableSection) => (
                      <button
                        key={libSection.id}
                        onClick={() => {
                           // El contenido guardado en la biblioteca tiene estructura {es: content, en: content}
                           // necesitamos insertarlo correctamente.
                           onAddLibrarySection?.(libSection);
                           setActiveTab('config');
                        }}
                        className="flex items-center gap-3 p-3 rounded-2xl border-2 border-emerald-50 hover:border-[#1C5D15]/30 hover:bg-emerald-50/30 transition-all text-left shadow-sm bg-white group"
                      >
                         <div className="w-8 h-8 bg-[#1C5D15]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Database className="w-4 h-4 text-[#1C5D15]" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <h4 className="text-[11px] font-black text-[#1C5D15] truncate uppercase tracking-tighter">{libSection.name}</h4>
                            <p className="text-[9px] text-[#629960] font-bold uppercase tracking-widest opacity-60">{libSection.type}</p>
                         </div>
                         <Plus className="w-4 h-4 text-[#1C5D15]/20 group-hover:text-[#1C5D15] transition-colors" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-[#1C5D15] font-black uppercase text-xs tracking-widest mb-4">Añadir nueva sección (Base)</h3>
                <div className="grid grid-cols-2 gap-3 pb-8">
                  {sectionTypes.map((item) => (
                    <button
                      key={item.type}
                      onClick={() => {
                        onAddSection?.(item.type);
                        setActiveTab('config');
                      }}
                      className="flex flex-col items-center justify-center p-4 rounded-3xl border-2 border-[#F7F9CE] hover:border-[#19FF00] hover:bg-[#F7F9CE]/20 transition-all group shadow-sm bg-white"
                    >
                      <div className="w-10 h-10 bg-[#19FF00]/10 rounded-2xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                        <Icon name={item.icon} className="w-5 h-5 text-[#1C5D15]" />
                      </div>
                      <span className="text-[10px] font-bold text-[#1C5D15] text-center leading-tight uppercase tracking-tighter">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONFIGURACION */}
          {activeTab === 'config' && (
            <>
              {activeSectionES && activeSectionEN ? (
                <VisualEditorSidebar
                  sectionES={activeSectionES}
                  sectionEN={activeSectionEN}
                  onUpdateSection={handleUpdateSection}
                  availableProducts={allProducts}
                  availableEcosystemMembers={allEcosystemMembers}
                  availableForms={availableForms}
                  pageSlug={pageSlug}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 select-none">
                  <div className="w-20 h-20 bg-[#F7F9CE] rounded-full flex items-center justify-center mb-6">
                    <Globe className="w-10 h-10 text-[#1C5D15]" />
                  </div>
                  <h3 className="text-[#1C5D15] font-black uppercase text-sm mb-2">Selecciona una sección</h3>
                  <p className="text-xs text-[#629960] leading-relaxed">
                    Toca cualquier elemento del sitio en el panel derecho para editar sus propiedades.
                  </p>
                </div>
              )}
            </>
          )}

        </div>
      </aside>
    </>
  );
}
