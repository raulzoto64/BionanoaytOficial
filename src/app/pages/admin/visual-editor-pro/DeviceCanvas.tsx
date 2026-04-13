import { PreviewFrame } from './PreviewFrame';
import { VisualEditorPreview } from '../../../components/admin/visual-editor/VisualEditorPreview';
import { Navigation } from '../../../components/Navigation';
import { Footer } from '../../../components/Footer';

interface DeviceCanvasProps {
  deviceView: 'desktop' | 'tablet' | 'mobile';
  deviceOrientation: 'portrait' | 'landscape';
  customWidth: number | null;
  onResizeStart: (e: React.MouseEvent) => void;
  isResizing: boolean;
  activeLanguage: string;
  activeSections: any[];
  activeSectionId: string | null;
  setActiveSectionId: (id: string) => void;
  allProducts: any[];
  allEcosystemMembers: any[];
  allCategories: any[];
  allBlogPosts: any[];
  pageSlug?: string;
}

export function DeviceCanvas({
  deviceView,
  deviceOrientation,
  customWidth,
  onResizeStart,
  isResizing,
  activeLanguage,
  activeSections,
  activeSectionId,
  setActiveSectionId,
  allProducts,
  allEcosystemMembers,
  allCategories,
  allBlogPosts,
  pageSlug,
}: DeviceCanvasProps) {
  return (
    <main className="flex-1 bg-[#222] overflow-y-auto flex items-start justify-center p-8 lg:p-12 custom-scrollbar-dark relative">
      <div className="relative group w-full flex justify-center py-10 min-h-screen items-start">
        <div className={`relative flex items-center justify-center ${deviceView !== 'desktop' ? 'mx-auto' : 'w-full'}`}>
          {/* Resize Handle */}
          {deviceView !== 'desktop' && (
            <div
              onMouseDown={onResizeStart}
              className="absolute -right-8 w-6 h-20 bg-white shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded-full cursor-ew-resize z-50 flex flex-col items-center justify-center border border-gray-200 transition-all active:bg-gray-50 active:scale-95 group-hover:opacity-100 opacity-50"
            >
              <div className="w-1 h-8 bg-gray-300 rounded-full flex gap-1">
                <span className="w-px h-full bg-gray-400"></span>
                <span className="w-px h-full bg-gray-400"></span>
              </div>
            </div>
          )}

          {/* Device Mockup */}
          <div
            id="device-mockup"
            style={{
              width: customWidth ? `${customWidth}px` :
                (deviceView === 'mobile' ? (deviceOrientation === 'landscape' ? '812px' : '375px') :
                  deviceView === 'tablet' ? (deviceOrientation === 'landscape' ? '1024px' : '768px') : undefined)
            }}
            className={`bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative flex-shrink-0 origin-top overflow-hidden transition-all duration-700 ${isResizing ? 'transition-none' : ''} ${deviceView === 'mobile' ?
                (deviceOrientation === 'landscape' ? 'h-[375px] rounded-[40px] border-[12px] border-[#111]' : 'h-[812px] rounded-[60px] border-[12px] border-[#111]') :
                deviceView === 'tablet' ?
                  (deviceOrientation === 'landscape' ? 'h-[768px] rounded-[40px] border-[14px] border-[#111]' : 'h-[1024px] rounded-[40px] border-[14px] border-[#111]') :
                  'w-full max-w-[1400px] rounded-xl h-[calc(100vh-120px)] min-h-[600px] shadow-none'
              }`}
          >
            {/* Notch */}
            {deviceView === 'mobile' && deviceOrientation === 'portrait' && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-[#111] rounded-b-3xl z-[100] flex items-end justify-center pb-1">
                <div className="w-12 h-1 bg-gray-800 rounded-full" />
              </div>
            )}

            <div className="h-full overflow-y-auto custom-scrollbar-content">
              <PreviewFrame>
                <div className="min-h-screen relative flex flex-col overflow-x-hidden">
                  <div className="pointer-events-none opacity-90 saturate-50 z-50">
                    <Navigation />
                  </div>
                  <div className="pt-20 flex-1">
                    <VisualEditorPreview
                      sections={activeSections}
                      activeSectionId={activeSectionId}
                      onSectionClick={setActiveSectionId}
                      availableProducts={allProducts}
                      availableEcosystemMembers={allEcosystemMembers}
                      availableCategories={allCategories}
                      availableBlogPosts={allBlogPosts}
                      pageSlug={pageSlug}
                    />
                  </div>
                  <div className="pointer-events-none opacity-90 saturate-50 mt-auto shrink-0 z-40 bg-white">
                    <Footer contactInfo={{ phone: "+57 (300) 123-4567", email: "contacto@bionanoayt.com", location: "Bogotá, Colombia" }} />
                  </div>
                </div>
              </PreviewFrame>
            </div>

            {deviceView === 'mobile' && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-[#111] rounded-full z-[100]" />
            )}
          </div>

          {isResizing && <div className="absolute inset-0 z-[999] cursor-ew-resize bg-transparent" />}
        </div>

        {/* Info Badge */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#1C5D15] text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl opacity-50 z-[100] border border-white/20 backdrop-blur-md">
          {deviceView} View • {customWidth ? `${Math.round(customWidth)}px` : (deviceView === 'mobile' ? (deviceOrientation === 'landscape' ? '812px' : '375px') : deviceView === 'tablet' ? (deviceOrientation === 'landscape' ? '1024px' : '768px') : '100%')} • {activeLanguage.toUpperCase()}
        </div>
      </div>
    </main>
  );
}
