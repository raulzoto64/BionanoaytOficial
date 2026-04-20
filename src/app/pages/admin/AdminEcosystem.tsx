import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { 
  FileText, 
  Edit, 
  X, 
  Plus, 
  Trash2, 
  Save,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  EcosystemMember, 
  EcosystemMemberTranslation, 
  supabaseAPI 
} from '../../data/supabase';
import { ImageUpload } from '../../components/ImageUpload';

export const AdminEcosystem = forwardRef((_props, ref) => {
  const [members, setMembers] = useState<EcosystemMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<EcosystemMember | null>(null);
  const [translations, setTranslations] = useState<{ es: EcosystemMemberTranslation; en: EcosystemMemberTranslation }>({
    es: { member_id: '', language: 'es', name: '', description: '' },
    en: { member_id: '', language: 'en', name: '', description: '' }
  });
  const [allTranslations, setAllTranslations] = useState<Map<string, { es: EcosystemMemberTranslation; en: EcosystemMemberTranslation }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingMember, setLoadingMember] = useState<string | null>(null);
  
  useImperativeHandle(ref, () => ({
    save: handleSave
  }));

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    if (members.length === 0) setLoading(true);
    try {
      const allMembers = await supabaseAPI.getAllEcosystemMembers();
      setMembers(allMembers);
      
      // Cargar todas las traducciones
      const newTranslations = new Map();
      for (const member of allMembers) {
        const [translationES, translationEN] = await Promise.all([
          supabaseAPI.getEcosystemMemberTranslation(member.id, 'es'),
          supabaseAPI.getEcosystemMemberTranslation(member.id, 'en')
        ]);
        newTranslations.set(member.id, { es: translationES, en: translationEN });
      }
      setAllTranslations(newTranslations);
    } catch (error) {
      toast.error('Error al cargar miembros del ecosistema');
    } finally {
      setLoading(false);
    }
  };



  const handleSelectMember = async (memberId: string) => {
    setLoadingMember(memberId);
    try {
      const member = await supabaseAPI.getEcosystemMemberById(memberId);
      if (member) {
        setSelectedMember(member);
        
        // Cargar traducciones
        const [translationES, translationEN] = await Promise.all([
          supabaseAPI.getEcosystemMemberTranslation(memberId, 'es'),
          supabaseAPI.getEcosystemMemberTranslation(memberId, 'en')
        ]);
        
        setTranslations({
          es: translationES,
          en: translationEN
        });
      }
    } catch (error) {
      toast.error('Error al cargar miembro');
    } finally {
      setLoadingMember(null);
    }
  };

  const handleSave = async () => {
    if (!selectedMember) return;

    setIsSaving(true);
    try {
      // Sanitizar datos para no enviar campos de solo lectura o IDs internos en el body
      const { id, ...updateData } = selectedMember;
      
      // Actualizar datos del miembro
      await supabaseAPI.updateEcosystemMember(selectedMember.id, updateData);

      // Actualizar traducciones
      await Promise.all([
        supabaseAPI.updateEcosystemMemberTranslation(selectedMember.id, 'es', translations.es),
        supabaseAPI.updateEcosystemMemberTranslation(selectedMember.id, 'en', translations.en)
      ]);
      

      toast.success('Miembro guardado exitosamente');
      loadMembers();
    } catch (error) {
      toast.error('Error al guardar el miembro');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSelectedMember(null);
    setTranslations({
      es: { member_id: '', language: 'es', name: '', description: '' },
      en: { member_id: '', language: 'en', name: '', description: '' }
    });
  };

  const handleCreate = async () => {
    const newMember: Omit<EcosystemMember, 'id'> = {
      slug: '',
      status: 'active',
      image: '',
      sector: '',
      social_media: {},
      youtube_videos: [],
      short_videos: []
    };

    try {
      const createdMember = await supabaseAPI.createEcosystemMember(newMember);
      setSelectedMember(createdMember);
      
      // Crear traducciones vacías
      const [translationES, translationEN] = await Promise.all([
        supabaseAPI.updateEcosystemMemberTranslation(createdMember.id, 'es', { name: '', description: '' }),
        supabaseAPI.updateEcosystemMemberTranslation(createdMember.id, 'en', { name: '', description: '' })
      ]);
      
      setTranslations({
        es: translationES,
        en: translationEN
      });
      
      toast.success('Miembro creado exitosamente');
      loadMembers();
    } catch (error) {
      toast.error('Error al crear el miembro');
    }
  };

  const handleDelete = async () => {
    if (!selectedMember || !confirm('¿Estás seguro de eliminar este miembro?')) return;

    try {
      await supabaseAPI.deleteEcosystemMember(selectedMember.id);
      toast.success('Miembro eliminado exitosamente');
      setSelectedMember(null);
      setTranslations({
        es: { member_id: '', language: 'es', name: '', description: '' },
        en: { member_id: '', language: 'en', name: '', description: '' }
      });
      loadMembers();
    } catch (error) {
      toast.error('Error al eliminar el miembro');
    }
  };

  const updateSocialMedia = (platform: string, url: string) => {
    if (!selectedMember) return;
    
    const updatedMember = {
      ...selectedMember,
      social_media: {
        ...selectedMember.social_media,
        [platform]: url
      }
    };
    setSelectedMember(updatedMember);
  };

  const updateVideo = (type: 'youtube' | 'short', index: number, url: string) => {
    if (!selectedMember) return;
    
    const updatedMember = { ...selectedMember };
    const videos = type === 'youtube' ? [...updatedMember.youtube_videos] : [...updatedMember.short_videos];
    
    if (index >= videos.length) {
      videos.push(url);
    } else {
      videos[index] = url;
    }
    
    if (type === 'youtube') {
      updatedMember.youtube_videos = videos;
    } else {
      updatedMember.short_videos = videos;
    }
    
    setSelectedMember(updatedMember);
  };

  const addVideo = (type: 'youtube' | 'short') => {
    if (!selectedMember) return;
    
    const updatedMember = { ...selectedMember };
    if (type === 'youtube') {
      updatedMember.youtube_videos = [...updatedMember.youtube_videos, ''];
    } else {
      updatedMember.short_videos = [...updatedMember.short_videos, ''];
    }
    setSelectedMember(updatedMember);
  };

  const removeVideo = (type: 'youtube' | 'short', index: number) => {
    if (!selectedMember) return;
    
    const updatedMember = { ...selectedMember };
    if (type === 'youtube') {
      updatedMember.youtube_videos = updatedMember.youtube_videos.filter((_, i) => i !== index);
    } else {
      updatedMember.short_videos = updatedMember.short_videos.filter((_, i) => i !== index);
    }
    setSelectedMember(updatedMember);
  };

  if (loading && !selectedMember) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-10 h-10 text-[#1C5D15] animate-spin" />
        <p className="text-[#629960] font-medium animate-pulse">Cargando ecosistema...</p>
      </div>
    );
  }

  // Vista de edición
  if (selectedMember) {
    return (
      <div className="p-4 md:p-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-[#1C5D15] mb-2">
              Editar: {translations.es.name || 'Nuevo Miembro'}
            </h2>
            <p className="text-[#629960]">
              Gestiona la información del miembro del ecosistema
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-[#1C5D15] text-white hover:bg-[#629960]"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
            <Button onClick={handleCancel} variant="outline">
              <X className="w-4 h-4 mr-2" />
              Cerrar
            </Button>
            <Button
              onClick={handleDelete}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Datos generales */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl text-[#1C5D15] mb-4">Datos Generales</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-[#1C5D15]">Slug</Label>
                  <Input
                    type="text"
                    value={selectedMember.slug}
                    onChange={(e) => setSelectedMember({ ...selectedMember, slug: e.target.value })}
                    className="mt-1"
                    placeholder="slug-de-identificacion"
                  />
                </div>

                <div>
                  <Label className="text-[#1C5D15]">Estado</Label>
                  <select
                    value={selectedMember.status}
                    onChange={(e) => setSelectedMember({ ...selectedMember, status: e.target.value as 'active' | 'inactive' | 'draft' })}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="draft">Borrador</option>
                  </select>
                </div>

                <div>
                  <Label className="text-[#1C5D15]">Sector</Label>
                  <Input
                    type="text"
                    value={selectedMember.sector}
                    onChange={(e) => setSelectedMember({ ...selectedMember, sector: e.target.value })}
                    className="mt-1"
                    placeholder="Ej: Biotecnología"
                  />
                </div>

                <div>
                  <Label className="text-[#1C5D15]">Imagen</Label>
                  <ImageUpload
                    currentImage={selectedMember.image}
                    onImageUpload={(url) => setSelectedMember({ ...selectedMember, image: url as string })}
                    type="product"
                  />
                </div>
              </div>
            </Card>

            {/* Redes sociales */}
            <Card className="p-6">
              <h3 className="text-xl text-[#1C5D15] mb-4">Redes Sociales</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-[#1C5D15]">Facebook</Label>
                  <Input
                    type="text"
                    value={selectedMember.social_media?.facebook || ''}
                    onChange={(e) => updateSocialMedia('facebook', e.target.value)}
                    className="mt-1"
                    placeholder="https://facebook.com/..."
                  />
                </div>

                <div>
                  <Label className="text-[#1C5D15]">Twitter</Label>
                  <Input
                    type="text"
                    value={selectedMember.social_media?.twitter || ''}
                    onChange={(e) => updateSocialMedia('twitter', e.target.value)}
                    className="mt-1"
                    placeholder="https://twitter.com/..."
                  />
                </div>

                <div>
                  <Label className="text-[#1C5D15]">Instagram</Label>
                  <Input
                    type="text"
                    value={selectedMember.social_media?.instagram || ''}
                    onChange={(e) => updateSocialMedia('instagram', e.target.value)}
                    className="mt-1"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div>
                  <Label className="text-[#1C5D15]">LinkedIn</Label>
                  <Input
                    type="text"
                    value={selectedMember.social_media?.linkedin || ''}
                    onChange={(e) => updateSocialMedia('linkedin', e.target.value)}
                    className="mt-1"
                    placeholder="https://linkedin.com/..."
                  />
                </div>

                <div>
                  <Label className="text-[#1C5D15]">Website</Label>
                  <Input
                    type="text"
                    value={selectedMember.social_media?.website || ''}
                    onChange={(e) => updateSocialMedia('website', e.target.value)}
                    className="mt-1"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Traducciones */}
          <div className="space-y-6">
            {/* Español */}
            <Card className="p-6">
              <h3 className="text-xl text-[#1C5D15] mb-4">Traducción (Español)</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-[#1C5D15]">Nombre</Label>
                  <Input
                    type="text"
                    value={translations.es.name}
                    onChange={(e) => setTranslations({ ...translations, es: { ...translations.es, name: e.target.value } })}
                    className="mt-1"
                    placeholder="Nombre del miembro"
                  />
                </div>

                <div>
                  <Label className="text-[#1C5D15]">Descripción</Label>
                  <Textarea
                    value={translations.es.description}
                    onChange={(e) => setTranslations({ ...translations, es: { ...translations.es, description: e.target.value } })}
                    className="w-full mt-1"
                    placeholder="Descripción del miembro"
                    rows={6}
                  />
                </div>
              </div>
            </Card>

            {/* Inglés */}
            <Card className="p-6">
              <h3 className="text-xl text-[#1C5D15] mb-4">Traducción (English)</h3>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-[#1C5D15]">Nombre</Label>
                  <Input
                    type="text"
                    value={translations.en.name}
                    onChange={(e) => setTranslations({ ...translations, en: { ...translations.en, name: e.target.value } })}
                    className="mt-1"
                    placeholder="Member name"
                  />
                </div>

                <div>
                  <Label className="text-[#1C5D15]">Descripción</Label>
                  <Textarea
                    value={translations.en.description}
                    onChange={(e) => setTranslations({ ...translations, en: { ...translations.en, description: e.target.value } })}
                    className="w-full mt-1"
                    placeholder="Member description"
                    rows={6}
                  />
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Videos */}
        <div className="mt-8 grid md:grid-cols-2 gap-8">
          {/* YouTube Videos */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl text-[#1C5D15]">Videos de YouTube</h3>
              <Button
                onClick={() => addVideo('youtube')}
                size="sm"
                className="bg-[#629960] text-white hover:text-[#1C5D15]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
            
            <div className="space-y-4">
              {selectedMember.youtube_videos.map((video, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="text"
                    value={video}
                    onChange={(e) => updateVideo('youtube', index, e.target.value)}
                    className="flex-1"
                    placeholder="https://www.youtube.com/embed/..."
                  />
                  <Button
                    onClick={() => removeVideo('youtube', index)}
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Short Videos */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl text-[#1C5D15]">Videos Cortos</h3>
              <Button
                onClick={() => addVideo('short')}
                size="sm"
                className="bg-[#629960] text-white hover:text-[#1C5D15]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar
              </Button>
            </div>
            
            <div className="space-y-4">
              {selectedMember.short_videos.map((video, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="text"
                    value={video}
                    onChange={(e) => updateVideo('short', index, e.target.value)}
                    className="flex-1"
                    placeholder="https://www.youtube.com/embed/..."
                  />
                  <Button
                    onClick={() => removeVideo('short', index)}
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-12 flex justify-center pb-12">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="lg"
            className="bg-[#1C5D15] text-white hover:bg-[#629960] px-12 py-6 rounded-2xl text-xl font-bold shadow-xl shadow-[#1C5D15]/20 transition-all hover:scale-105 active:scale-95"
          >
            {isSaving ? (
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
            ) : (
              <Save className="w-6 h-6 mr-3" />
            )}
            {isSaving ? 'Guardando cambios...' : 'Guardar Cambios del Miembro'}
          </Button>
        </div>
      </div>
    );
  }

  // Vista de lista
  return (
    <div className="p-4 md:p-6">
      {/* Members Management */}
      <div>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-[#1C5D15] mb-2">Miembros del Ecosistema</h2>
            <p className="text-[#629960]">
              Gestiona los miembros del ecosistema y su información en múltiples idiomas
            </p>
          </div>
          <Button
            onClick={handleCreate}
            className="bg-[#629960] text-white hover:text-[#1C5D15]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Miembro
          </Button>
        </div>

        {/* Lista de miembros */}
        <div className="grid gap-4">
          {members.length === 0 ? (
            <Card className="p-12 bg-white border-2 border-[#629960]/20 text-center">
              <FileText className="w-16 h-16 text-[#1C5D15] mx-auto mb-4" />
              <h3 className="text-2xl text-[#1C5D15] mb-2">No hay miembros</h3>
              <p className="text-[#629960] mb-4">Agrega tu primer miembro para comenzar</p>
            </Card>
          ) : (
            members.map((member) => (
              <Card key={member.id} className="p-6 bg-white border-2 border-[#629960]/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {member.image ? (
                      <img 
                        src={member.image} 
                        alt="Miembro" 
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-[#1C5D15] rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-xl text-[#1C5D15] mb-1">
                        {(() => {
                          // Obtenemos la traducción del miembro actual
                          const memberTranslations = allTranslations.get(member.id);
                          return memberTranslations?.es.name || member.slug;
                        })()}
                      </h3>
                      <p className="text-sm text-[#629960]">
                        {member.sector} • {member.status}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      className={
                        member.status === 'active'
                          ? 'bg-[#19FF00] text-[#1C5D15]'
                          : member.status === 'draft'
                          ? 'bg-[#629960] text-white'
                          : 'bg-gray-400 text-white'
                      }
                    >
                      {member.status === 'active' ? 'Activo' : member.status === 'draft' ? 'Borrador' : 'Inactivo'}
                    </Badge>

                    <button
                      className="border border-[#1C5D15] text-[#1C5D15] px-3 py-1 rounded-md text-sm hover:bg-[#1C5D15] hover:text-white transition-colors disabled:opacity-50 flex items-center"
                      onClick={() => {
                        handleSelectMember(member.id);
                      }}
                      disabled={loadingMember === member.id}
                    >
                      {loadingMember === member.id ? (
                        <span>Cargando...</span>
                      ) : (
                        <>
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
                        </>
                      )}
                    </button>

                    <button
                      className="border border-red-500 text-red-500 px-3 py-1 rounded-md text-sm hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center"
                      onClick={async () => {
                        if (confirm('¿Estás seguro de eliminar este miembro?')) {
                          try {
                            await supabaseAPI.deleteEcosystemMember(member.id);
                            toast.success('Miembro eliminado exitosamente');
                            loadMembers();
                          } catch (error) {
                            toast.error('Error al eliminar el miembro');
                          }
                        }
                      }}
                      disabled={loadingMember === member.id}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Info Card */}
      <Card className="mt-8 p-6 bg-gradient-to-r from-[#1C5D15] to-[#629960] text-white">
        <h3 className="text-2xl mb-3">💡 Gestionar Miembros del Ecosistema</h3>
        <p className="mb-4 opacity-90">
          Desde aquí podrás administrar los miembros del ecosistema, incluyendo su información básica,
          redes sociales, videos y traducciones en español e inglés.
        </p>
        <ul className="list-disc list-inside space-y-2 opacity-90">
          <li>Edita información general y estado</li>
          <li>Gestiona redes sociales y enlaces</li>
          <li>Agrega y configura videos de YouTube y cortos</li>
          <li>Administra traducciones en español e inglés</li>
          <li>Elimina miembros del ecosistema</li>
          <li>Controla la visibilidad de cada miembro</li>
        </ul>
      </Card>
    </div>
  );
});
