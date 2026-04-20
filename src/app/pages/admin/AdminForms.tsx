import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabaseAPI, Form } from '../../data/supabase';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Layout,
  Sparkles
} from 'lucide-react';
import { Button } from '../../components/ui/button';
import { toast } from 'sonner';
import { ConfirmModal } from '../../components/ui/ConfirmModal';

export function AdminForms() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = async () => {
    setLoading(true);
    try {
      const data = await supabaseAPI.getForms();
      setForms(data);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar formularios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    navigate('/admin/forms/edit/new');
  };

  const handleEdit = (form: Form) => {
    navigate(`/admin/forms/edit/${form.id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await supabaseAPI.deleteForm(id);
      toast.success('Formulario eliminado');
      loadForms();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredForms = forms.filter(f => 
    (f?.name?.toLowerCase().includes(searchQuery.toLowerCase())) || 
    (f?.title_es?.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (f?.title_en?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header Premium */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-[#1C5D15] tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-[#19FF00] rounded-2xl shadow-lg shadow-[#19FF00]/20">
              <Sparkles className="w-8 h-8 text-[#1C5D15]" />
            </div>
            Formularios Inteligentes
          </h1>
          <p className="text-[#629960] mt-2 font-medium">Crea experiencias de captura de datos premium con un par de clics.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#19FF00] transition-colors" />
            <input 
              type="text"
              placeholder="Buscar formularios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3.5 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-[#1C5D15] focus:ring-4 focus:ring-[#19FF00]/10 transition-all w-64 shadow-sm"
            />
          </div>
          <Button 
            onClick={handleCreate}
            className="bg-[#1C5D15] hover:text-[#1C5D15] text-white rounded-full px-8 py-7 font-black text-xs uppercase tracking-widest shadow-xl shadow-[#1C5D15]/20 transition-all hover:-translate-y-1 active:scale-95 flex items-center gap-3 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            Nuevo Formulario
          </Button>
        </div>
      </div>

      {/* Grid de Formularios Estilo Cards Premium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [1,2,3].map(i => (
            <div key={i} className="h-64 bg-white/50 animate-pulse rounded-[2.5rem] border border-gray-100"></div>
          ))
        ) : filteredForms.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-100 italic text-gray-400">
             No hay formularios que coincidan con tu búsqueda.
          </div>
        ) : (
          filteredForms.map(form => (
            <div key={form.id} className="group bg-white rounded-[2.5rem] p-6 shadow-xl shadow-[#1C5D15]/5 border border-gray-50 hover:border-[#19FF00] transition-all relative overflow-hidden flex flex-col">
              <div className="flex items-start justify-between mb-6 relative z-10">
                <div className="w-14 h-14 bg-[#1C5D15]/5 rounded-2xl flex items-center justify-center text-[#1C5D15] group-hover:bg-[#19FF00] group-hover:text-[#1C5D15] transition-all">
                  <Layout className="w-7 h-7" />
                </div>
                <div className="flex gap-1">
                   <button onClick={() => handleEdit(form)} className="p-3 bg-gray-50 text-gray-400 hover:bg-[#1C5D15] hover:text-white rounded-xl transition-all"><Edit2 size={16}/></button>
                   <button onClick={() => setIsDeleting(form.id)} className="p-3 bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16}/></button>
                </div>
              </div>
              
              <div className="flex-1 relative z-10">
                <h3 className="text-xl font-black text-[#1C5D15] mb-1 line-clamp-1">{form.name}</h3>
                <p className="text-xs text-[#629960] font-bold uppercase tracking-widest mb-4">{form.fields?.length || 0} Pasos de entrada</p>
                <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{form.title_es}</p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between relative z-10">
                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${form.is_active ? 'bg-[#19FF00]/10 text-[#1C5D15]' : 'bg-gray-100 text-gray-400'}`}>
                   {form.is_active ? '● Activo' : '● Pausado'}
                </span>
                <span className="text-[10px] text-gray-300 font-bold">{new Date(form.updated_at).toLocaleDateString()}</span>
              </div>

              {/* Efecto decorativo de fondo */}
              <div className="absolute -right-4 -bottom-4 text-[#1C5D15]/5 group-hover:text-[#19FF00]/10 transition-colors pointer-events-none">
                <Layout size={120} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Confirmación para eliminar */}
      <ConfirmModal
        isOpen={!!isDeleting}
        onClose={() => setIsDeleting(null)}
        onConfirm={() => isDeleting && handleDelete(isDeleting)}
        title="¿Eliminar Formulario?"
        message="Esta acción no se puede deshacer y deshabilitará los popups que utilicen este formulario."
      />
    </div>
  );
}
