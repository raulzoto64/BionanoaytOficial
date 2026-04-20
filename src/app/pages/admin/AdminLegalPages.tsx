import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { DatabaseManager } from '../../data/DatabaseManager';
import { LegalPage } from '../../data/supabase';
import { Plus, Trash2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';

export function AdminLegalPages() {
  const navigate = useNavigate();
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pageToDelete, setPageToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadLegalPages();
  }, []);

  const loadLegalPages = async () => {
    setIsLoading(true);
    try {
      const pages = await DatabaseManager.getLegalPages();
      setLegalPages(pages);
    } catch (error) {
      console.error('Error loading legal pages:', error);
      toast.error('Error al cargar las páginas legales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (page: LegalPage) => {
    navigate(`/admin/visual-editor/legal/${page.id}`);
  };

  const handleNewPage = async () => {
    try {
      setIsLoading(true);
      const newPage = {
        slug: `draft-legal-${Date.now()}`,
        title_es: 'Nueva Página Legal',
        title_en: 'New Legal Page',
        content_es: '',
        content_en: '',
        is_active: false
      };
      
      const created = await DatabaseManager.createLegalPage(newPage);
      navigate(`/admin/visual-editor/legal/${created.id}`);
    } catch (e) {
      toast.error('Error al crear página');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setPageToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!pageToDelete) return;
    try {
      await DatabaseManager.deleteLegalPage(pageToDelete);
      toast.success('Página legal eliminada exitosamente');
      loadLegalPages();
    } catch (error) {
      console.error('Error deleting legal page:', error);
      toast.error('Error al eliminar la página legal');
    } finally {
      setDeleteDialogOpen(false);
      setPageToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1C5D15] mx-auto mb-4"></div>
        <p className="text-[#629960] font-bold uppercase text-[10px] tracking-widest">Cargando páginas...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#1C5D15] tracking-tight">Páginas Legales</h1>
          <p className="text-[#629960]">Gestiona los términos, condiciones y políticas de privacidad</p>
        </div>
        <Button 
          className="bg-[#1C5D15] text-white hover:text-[#1C5D15] px-6"
          onClick={handleNewPage}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Página
        </Button>
      </div>

      <div className="grid gap-4">
        {legalPages.map((page) => (
          <Card key={page.id} className="p-6 bg-white border-2 border-[#1C5D15]/10 hover:border-[#19FF00]/30 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-xl font-bold text-[#1C5D15]">{page.title_es}</h3>
                  {!page.is_active && (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                      Inactiva
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#629960] mb-2">{page.title_en}</p>
                <code className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded">/legal/{page.slug}</code>
              </div>

              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  onClick={() => handleEdit(page)}
                  className="bg-[#F7F9CE] text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white border border-[#1C5D15]/10"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Editor Visual
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(page.id)}
                  className="border-red-100 text-red-400 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {legalPages.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-4 border-dashed border-gray-100">
             <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No hay páginas legales creadas</p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Delete */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar esta página legal? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={confirmDelete} className="bg-red-500 text-white hover:bg-red-600">Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
