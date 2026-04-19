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
  entityType?: 'page' | 'blog' | 'legal' | 'footer' | 'product';
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
  onAddLibrarySection,
  entityType = 'page'
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'sections' | 'config'>(['footer'].includes(entityType) ? 'config' : 'sections');
  const [librarySections, setLibrarySections] = useState<ReusableSection[]>([]);

  // Si es footer, forzar pestaña config
  useEffect(() => {
    if (['footer', 'legal', 'blog'].includes(entityType)) {
      setActiveTab('config');
    }
  }, [entityType]);

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
  const sectionGroups = [
    {
      name: 'Componentes de Artículo',
      visible: entityType === 'blog',
      items: [
        { type: 'blog-text', label: 'Cuerpo de Texto', icon: 'Type' },
        { type: 'blog-intro', label: 'Párrafo Destacado', icon: 'Sparkles' },
        { type: 'blog-quote', label: 'Cita Destacada', icon: 'Quote' },
        { type: 'blog-list', label: 'Lista Estilizada', icon: 'CheckSquare' },
        { type: 'blog-image', label: 'Imagen / Galería', icon: 'ShoppingBag' },
        { type: 'blog-divider', label: 'Separador Sutil', icon: 'Layers' },
      ]
    },
    {
      name: entityType === 'blog' ? 'Secciones de Página' : 'Secciones de Marketing',
      visible: !['legal'].includes(entityType),
      items: [
        { type: 'hero', label: 'Banner Principal', icon: 'Layout' },
        { type: 'stats', label: 'Estadísticas', icon: 'BarChart' },
        { type: 'category-filter', label: 'Directorio Ecosistema', icon: 'Users' },
        { type: 'ecosystem', label: 'Nuestra Red (Features)', icon: 'Globe' },
        { type: 'products', label: 'Catálogo de Productos', icon: 'ShoppingBag' },
        { type: 'news', label: 'Noticias Actuales', icon: 'Newspaper' },
        { type: 'faq', label: 'Preguntas Frecuentes', icon: 'HelpCircle' },
        { type: 'cta', label: 'Llamado a la Acción', icon: 'Zap' },
        { type: 'hero-blog', label: 'Hero Blog', icon: 'FileText' },
        { type: 'bento', label: 'Bento Grid', icon: 'Layers' },
        { type: 'timeline', label: 'Línea de Tiempo', icon: 'Clock' },
        { type: 'featured', label: 'Producto Destacado', icon: 'Award' },
      ]
    }
  ].filter(group => group.visible);

  const sortedGroups = [...sectionGroups];



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
            {!['footer'].includes(entityType) && (
              <button
                onClick={() => {
                  setActiveTab('sections');
                  window.dispatchEvent(new CustomEvent('editor:deselect-section'));
                }}
                className={`flex-1 py-1.5 px-3 rounded-md text-[10px] font-bold uppercase transition-all ${activeTab === 'sections'
                    ? 'bg-white text-[#1C5D15] shadow-sm'
                    : 'text-gray-500 hover:text-[#1C5D15]'
                  }`}
              >
                📋 Secciones
              </button>
            )}
            <button
              onClick={() => setActiveTab('config')}
              className={`flex-1 py-1.5 px-3 rounded-md text-[10px] font-bold uppercase transition-all ${activeTab === 'config'
                  ? 'bg-white text-[#1C5D15] shadow-sm'
                  : 'text-gray-500 hover:text-[#1C5D15]'
                } ${['footer', 'legal', 'blog'].includes(entityType) ? 'w-full' : ''}`}
            >
              ⚙️ {['footer', 'legal', 'blog'].includes(entityType) ? `Configuración ${entityType.charAt(0).toUpperCase() + entityType.slice(1)}` : 'Configuración'}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto bg-white custom-scrollbar">

          {/* TAB SECCIONES - GRID PERMANENTE CON TODOS LOS ICONOS */}
          {activeTab === 'sections' && (
            <div className="p-4 space-y-6">

              {/* ── LIBRERÍA DE COMPONENTES (primero) ── */}
              <div>
                <h3 className="text-[#1C5D15] font-black uppercase text-xs tracking-widest mb-4">Librería de Componentes</h3>
                <div className="space-y-6 pb-2">
                  {sortedGroups.map((group) => (
                    <div key={group.name} className="space-y-3">
                       <div className="flex items-center gap-2 px-1">
                          <div className="h-px flex-1 bg-[#1C5D15]/10"></div>
                          <span className="text-[9px] font-black text-[#1C5D15] opacity-40 uppercase tracking-[0.2em]">{group.name}</span>
                          <div className="h-px flex-1 bg-[#1C5D15]/10"></div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-2.5">
                          {group.items.map((item) => (
                            <button
                              key={item.type}
                              onClick={() => {
                                onAddSection?.(item.type);
                                setActiveTab('config');
                              }}
                              className="flex flex-col items-center justify-center p-3.5 rounded-2xl border-2 border-emerald-50 hover:border-[#19FF00] hover:bg-emerald-50/50 transition-all group shadow-sm bg-white"
                            >
                              <div className="w-9 h-9 bg-[#19FF00]/10 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                <Icon name={item.icon} className="w-4 h-4 text-[#1C5D15]" />
                              </div>
                              <span className="text-[9px] font-bold text-[#1C5D15] text-center leading-none uppercase tracking-tighter">{item.label}</span>
                            </button>
                          ))}
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── BIBLIOTECA DE SECCIONES GUARDADAS (después) ── */}
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
                  <div className="grid grid-cols-1 gap-2 pb-8">
                    {librarySections.map((libSection: ReusableSection) => (
                      <button
                        key={libSection.id}
                        onClick={() => {
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
                  entityType={entityType}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 select-none">
                  <div className="w-20 h-20 bg-[#F7F9CE] rounded-full flex items-center justify-center mb-6 text-[#1C5D15]">
                    {entityType === 'footer' ? <Layout className="w-10 h-10" /> : <Globe className="w-10 h-10" />}
                  </div>
                  <h3 className="text-[#1C5D15] font-black uppercase text-sm mb-2">
                    {entityType === 'footer' ? 'Cargando Configuración...' : 'Selecciona una sección'}
                  </h3>
                  <p className="text-xs text-[#629960] leading-relaxed">
                    {entityType === 'footer' 
                      ? 'Espera un momento mientras cargamos los ajustes del footer.' 
                      : 'Toca cualquier elemento del sitio en el panel derecho para editar sus propiedades.'}
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
