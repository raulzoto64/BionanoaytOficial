import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Plus, Edit, Trash2, Save, X, Languages, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Translation, supabaseAPI } from '../../data/supabase';

export function AdminTranslations() {
  const [translationsData, setTranslationsData] = useState<Translation[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [formData, setFormData] = useState({
    key: '',
    category: 'ui' as 'ui' | 'messages' | 'navigation' | 'forms',
    es: '',
    en: '',
  });

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'ui', label: 'UI (Interfaz)' },
    { value: 'messages', label: 'Mensajes' },
    { value: 'navigation', label: 'Navegación' },
    { value: 'forms', label: 'Formularios' },
  ];

  useEffect(() => {
    loadTranslations();
  }, []);

  const loadTranslations = async () => {
    setLoading(true);
    try {
      const data = await supabaseAPI.getTranslations();
      setTranslationsData(data);
    } catch (error) {
      toast.error('Error al cargar traducciones');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (translation: Translation) => {
    setEditingId(translation.id);
    setFormData({
      key: translation.key,
      category: translation.category as 'ui' | 'messages' | 'navigation' | 'forms',
      es: translation.es,
      en: translation.en,
    });
  };

  const handleSave = async () => {
    try {
      if (!formData.key || !formData.es || !formData.en) {
        toast.error('Por favor complete todos los campos');
        return;
      }

      if (editingId) {
        // Actualizar traducción existente
        await supabaseAPI.updateTranslation(editingId, formData);
        toast.success('Traducción actualizada exitosamente');
      } else if (isCreating) {
        // Crear nueva traducción
        await supabaseAPI.createTranslation(formData);
        toast.success('Traducción creada exitosamente');
      }

      setEditingId(null);
      setIsCreating(false);
      resetForm();
      loadTranslations();
    } catch (error) {
      toast.error('Error al guardar la traducción');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta traducción?')) return;

    try {
      await supabaseAPI.deleteTranslation(id);
      toast.success('Traducción eliminada exitosamente');
      loadTranslations();
    } catch (error) {
      toast.error('Error al eliminar la traducción');
    }
  };

  const resetForm = () => {
    setFormData({
      key: '',
      category: 'ui',
      es: '',
      en: '',
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
  };

  const startCreating = () => {
    setIsCreating(true);
    resetForm();
  };

  // Filtrar traducciones
  const filteredTranslations = translationsData.filter((trans) => {
    const matchesSearch =
      trans.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trans.es.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trans.en.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || trans.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      ui: 'bg-blue-500',
      messages: 'bg-purple-500',
      navigation: 'bg-green-500',
      forms: 'bg-orange-500',
    };
    return colors[category] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#629960]">Cargando traducciones...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 text-foreground">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl text-[#1C5D15] mb-2">Gestión de Traducciones</h2>
          <p className="text-[#629960]">Sistema multiidioma (Español / English)</p>
        </div>
        <Button
          onClick={startCreating}
          className="bg-[#1C5D15] text-white hover:text-[#1C5D15]"
          disabled={isCreating || editingId !== null}
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Traducción
        </Button>
      </div>

      {/* Search & Filter */}
      <Card className="p-4 mb-6 bg-white">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar por clave, texto en español o inglés..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white text-[#1C5D15]"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Create Form */}
      {isCreating && (
        <Card className="p-6 mb-6 bg-white border-2 border-[#19FF00]">
          <h3 className="text-xl text-[#1C5D15] mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Nueva Traducción
          </h3>
          <TranslationForm formData={formData} setFormData={setFormData} />
          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleSave}
              className="bg-[#1C5D15] text-white hover:text-[#1C5D15]"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
          </div>
        </Card>
      )}

      {/* Translations List */}
      <div className="grid gap-4">
        {filteredTranslations.length === 0 ? (
          <Card className="p-12 bg-white border-2 border-[#629960]/20 text-center">
            <Languages className="w-16 h-16 text-[#1C5D15] mx-auto mb-4" />
            <h3 className="text-2xl text-[#1C5D15] mb-2">No hay traducciones</h3>
            <p className="text-[#629960] mb-4">
              {searchQuery || filterCategory !== 'all'
                ? 'No se encontraron resultados con los filtros aplicados'
                : 'Crea tu primera traducción para comenzar'}
            </p>
          </Card>
        ) : (
          filteredTranslations.map((translation) => (
            <Card
              key={translation.id}
              className={`p-6 bg-white border-2 ${
                editingId === translation.id ? 'border-[#19FF00]' : 'border-[#629960]/20'
              }`}
            >
              {editingId === translation.id ? (
                <>
                  <h3 className="text-xl text-[#1C5D15] mb-4 flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Editar Traducción
                  </h3>
                  <TranslationForm formData={formData} setFormData={setFormData} />
                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={handleSave}
                      className="bg-[#1C5D15] text-white hover:text-[#1C5D15]"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </Button>
                    <Button onClick={handleCancel} variant="outline">
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#1C5D15] rounded-lg flex items-center justify-center">
                        <Languages className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg text-[#1C5D15] font-mono">{translation.key}</h3>
                        <Badge className={`${getCategoryBadgeColor(translation.category)} text-white`}>
                          {translation.category.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4 pl-13">
                      <div className="space-y-1">
                        <p className="text-xs text-[#629960] font-semibold">🇪🇸 ESPAÑOL</p>
                        <p className="text-sm bg-gray-50 p-3 rounded border">
                          {translation.es}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-[#629960] font-semibold">🇬🇧 ENGLISH</p>
                        <p className="text-sm bg-gray-50 p-3 rounded border">
                          {translation.en}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(translation)}
                      className="border-[#1C5D15] text-[#1C5D15]"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(translation.id)}
                      className="border-red-500 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Stats */}
      <Card className="mt-6 p-6 bg-gradient-to-r from-[#1C5D15] to-[#629960] text-white">
        <h3 className="text-xl mb-3">📊 Estadísticas</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <p className="text-2xl font-bold">{translationsData.length}</p>
            <p className="text-sm opacity-90">Total de traducciones</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {translationsData.filter((t) => t.category === 'ui').length}
            </p>
            <p className="text-sm opacity-90">Interfaz (UI)</p>
          </div>
          <div>
            <p className="text-2xl font-bold">
              {translationsData.filter((t) => t.category === 'navigation').length}
            </p>
            <p className="text-sm opacity-90">Navegación</p>
          </div>
          <div>
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm opacity-90">Idiomas soportados</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

// Componente de formulario reutilizable
function TranslationForm({
  formData,
  setFormData,
}: {
  formData: any;
  setFormData: (data: any) => void;
}) {
  return (
    <div className="grid gap-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="key" className="text-[#1C5D15]">
            Clave (Key) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="key"
            type="text"
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            placeholder="nav.home"
            className="mt-1 font-mono"
          />
          <p className="text-xs text-[#629960] mt-1">
            Formato: categoria.elemento (ej: ui.button, nav.home)
          </p>
        </div>

        <div>
          <Label htmlFor="category" className="text-[#1C5D15]">
            Categoría <span className="text-red-500">*</span>
          </Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as 'ui' | 'messages' | 'navigation' | 'forms',
              })
            }
            className="w-full mt-1 px-3 py-2 border rounded-lg"
          >
            <option value="ui">UI (Interfaz)</option>
            <option value="messages">Mensajes</option>
            <option value="navigation">Navegación</option>
            <option value="forms">Formularios</option>
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="es" className="text-[#1C5D15]">
          🇪🇸 Texto en Español <span className="text-red-500">*</span>
        </Label>
        <Input
          id="es"
          type="text"
          value={formData.es}
          onChange={(e) => setFormData({ ...formData, es: e.target.value })}
          placeholder="Texto en español"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="en" className="text-[#1C5D15]">
          🇬🇧 Text in English <span className="text-red-500">*</span>
        </Label>
        <Input
          id="en"
          type="text"
          value={formData.en}
          onChange={(e) => setFormData({ ...formData, en: e.target.value })}
          placeholder="Text in English"
          className="mt-1"
        />
      </div>
    </div>
  );
}
