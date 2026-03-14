import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card } from '../../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { DatabaseManager } from '../../data/DatabaseManager';
import { FooterSettings, FooterColumn, FooterLink } from '../../data/supabase';
import { Plus, Trash2, Edit, ExternalLink } from 'lucide-react';

export function AdminFooterSettings() {
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingColumn, setEditingColumn] = useState<FooterColumn | null>(null);
  const [editingLink, setEditingLink] = useState<{ columnId: string; link: FooterLink } | null>(null);
  const [formData, setFormData] = useState({
    copyright_text_es: '',
    copyright_text_en: '',
    social_media: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: ''
    }
  });

  useEffect(() => {
    loadFooterSettings();
  }, []);

  const loadFooterSettings = async () => {
    setIsLoading(true);
    try {
      const settings = await DatabaseManager.getFooterSettings();
      setFooterSettings(settings);
      setFormData({
        copyright_text_es: settings.copyright_text_es,
        copyright_text_en: settings.copyright_text_en,
        social_media: settings.social_media
      });
    } catch (error) {
      console.error('Error loading footer settings:', error);
      toast.error('Error al cargar configuración del footer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await DatabaseManager.updateFooterSettings(formData);
      toast.success('Configuración del footer actualizada exitosamente');
      loadFooterSettings();
    } catch (error) {
      console.error('Error saving footer settings:', error);
      toast.error('Error al guardar configuración del footer');
    }
  };

  const handleAddColumn = () => {
    const newColumn: FooterColumn = {
      id: `col-${Date.now()}`,
      title_es: '',
      title_en: '',
      links: []
    };
    
    const updatedSettings = {
      ...footerSettings!,
      columns: [...footerSettings!.columns, newColumn]
    };
    
    setFooterSettings(updatedSettings);
    setEditingColumn(newColumn);
    setIsDialogOpen(true);
  };

  const handleEditColumn = (column: FooterColumn) => {
    setEditingColumn(column);
    setIsDialogOpen(true);
  };

  const handleDeleteColumn = (columnId: string) => {
    if (confirm('¿Está seguro que desea eliminar esta columna?')) {
      const updatedSettings = {
        ...footerSettings!,
        columns: footerSettings!.columns.filter(col => col.id !== columnId)
      };
      setFooterSettings(updatedSettings);
      DatabaseManager.updateFooterSettings(updatedSettings);
      toast.success('Columna eliminada exitosamente');
    }
  };

  const handleSaveColumn = (column: FooterColumn) => {
    const updatedSettings = {
      ...footerSettings!,
      columns: footerSettings!.columns.map(col => 
        col.id === column.id ? column : col
      )
    };
    
    setFooterSettings(updatedSettings);
    setEditingColumn(null);
    setIsDialogOpen(false);
    DatabaseManager.updateFooterSettings(updatedSettings);
    toast.success('Columna actualizada exitosamente');
  };

  const handleAddLink = (columnId: string) => {
    const newLink: FooterLink = {
      id: `link-${Date.now()}`,
      label_es: '',
      label_en: '',
      url: ''
    };
    
    const updatedSettings = {
      ...footerSettings!,
      columns: footerSettings!.columns.map(col => 
        col.id === columnId 
          ? { ...col, links: [...col.links, newLink] }
          : col
      )
    };
    
    setFooterSettings(updatedSettings);
    setEditingLink({ columnId, link: newLink });
    setIsDialogOpen(true);
  };

  const handleEditLink = (columnId: string, link: FooterLink) => {
    setEditingLink({ columnId, link });
    setIsDialogOpen(true);
  };

  const handleDeleteLink = (columnId: string, linkId: string) => {
    if (confirm('¿Está seguro que desea eliminar este enlace?')) {
      const updatedSettings = {
        ...footerSettings!,
        columns: footerSettings!.columns.map(col => 
          col.id === columnId 
            ? { ...col, links: col.links.filter(link => link.id !== linkId) }
            : col
        )
      };
      
      setFooterSettings(updatedSettings);
      DatabaseManager.updateFooterSettings(updatedSettings);
      toast.success('Enlace eliminado exitosamente');
    }
  };

  const handleSaveLink = (link: FooterLink) => {
    const updatedSettings = {
      ...footerSettings!,
      columns: footerSettings!.columns.map(col => 
        col.id === editingLink?.columnId 
          ? { 
              ...col, 
              links: col.links.map(l => l.id === link.id ? link : l) 
            }
          : col
      )
    };
    
    setFooterSettings(updatedSettings);
    setEditingLink(null);
    setIsDialogOpen(false);
    DatabaseManager.updateFooterSettings(updatedSettings);
    toast.success('Enlace actualizado exitosamente');
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#1C5D15]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[#1C5D15]">Configuración del Footer</h1>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Configuración General</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="copyright_es">Texto de Copyright (ES)</Label>
                <Input
                  id="copyright_es"
                  value={formData.copyright_text_es}
                  onChange={(e) => setFormData({ ...formData, copyright_text_es: e.target.value })}
                  placeholder="© {{year}} Bionanoaxus. Todos los derechos reservados."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="copyright_en">Texto de Copyright (EN)</Label>
                <Input
                  id="copyright_en"
                  value={formData.copyright_text_en}
                  onChange={(e) => setFormData({ ...formData, copyright_text_en: e.target.value })}
                  placeholder="© {{year}} Bionanoaxus. All rights reserved."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={formData.social_media.facebook || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_media: { ...formData.social_media, facebook: e.target.value } 
                  })}
                  placeholder="https://facebook.com/tuempresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.social_media.twitter || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_media: { ...formData.social_media, twitter: e.target.value } 
                  })}
                  placeholder="https://twitter.com/tuempresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.social_media.instagram || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_media: { ...formData.social_media, instagram: e.target.value } 
                  })}
                  placeholder="https://instagram.com/tuempresa"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.social_media.linkedin || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    social_media: { ...formData.social_media, linkedin: e.target.value } 
                  })}
                  placeholder="https://linkedin.com/company/tuempresa"
                />
              </div>
            </div>

            <Button type="submit" className="bg-[#1C5D15] hover:bg-[#1C5D15]/90 text-white">
              Guardar Configuración
            </Button>
          </form>
        </Card>

        {/* Footer Columns */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Columnas del Footer</h2>
            <Button
              onClick={handleAddColumn}
              className="bg-[#1C5D15] hover:bg-[#1C5D15]/90 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Columna
            </Button>
          </div>

          <div className="grid gap-4">
            {footerSettings?.columns.map((column) => (
              <Card key={column.id} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">{column.title_es}</h3>
                    <p className="text-sm text-gray-600 mb-2">{column.title_en}</p>
                    <p className="text-xs text-gray-500">
                      {column.links.length} enlaces
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditColumn(column)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteColumn(column.id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium">Enlaces</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddLink(column.id)}
                      className="flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Agregar Enlace
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    {column.links.map((link) => (
                      <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{link.label_es}</p>
                          <p className="text-xs text-gray-600">{link.label_en}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            {link.url}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEditLink(column.id, link)}
                            className="flex items-center gap-1"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteLink(column.id, link.id)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>
      </div>

      {/* Dialog for editing columns or links */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingColumn ? 'Editar Columna' : editingLink ? 'Editar Enlace' : 'Nuevo Elemento'}
            </DialogTitle>
          </DialogHeader>
          
          {editingColumn ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="column_title_es">Título (ES)</Label>
                  <Input
                    id="column_title_es"
                    value={editingColumn.title_es}
                    onChange={(e) => setEditingColumn({ ...editingColumn, title_es: e.target.value })}
                    placeholder="Título en español"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="column_title_en">Título (EN)</Label>
                  <Input
                    id="column_title_en"
                    value={editingColumn.title_en}
                    onChange={(e) => setEditingColumn({ ...editingColumn, title_en: e.target.value })}
                    placeholder="Title in English"
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleSaveColumn(editingColumn)}
                  className="bg-[#1C5D15] hover:bg-[#1C5D15]/90 text-white"
                >
                  Guardar Columna
                </Button>
              </DialogFooter>
            </div>
          ) : editingLink ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="link_label_es">Texto del Enlace (ES)</Label>
                  <Input
                    id="link_label_es"
                    value={editingLink.link.label_es}
                    onChange={(e) => setEditingLink({ 
                      ...editingLink, 
                      link: { ...editingLink.link, label_es: e.target.value } 
                    })}
                    placeholder="Texto en español"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="link_label_en">Texto del Enlace (EN)</Label>
                  <Input
                    id="link_label_en"
                    value={editingLink.link.label_en}
                    onChange={(e) => setEditingLink({ 
                      ...editingLink, 
                      link: { ...editingLink.link, label_en: e.target.value } 
                    })}
                    placeholder="Text in English"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="link_url">URL</Label>
                <Input
                  id="link_url"
                  value={editingLink.link.url}
                  onChange={(e) => setEditingLink({ 
                    ...editingLink, 
                    link: { ...editingLink.link, url: e.target.value } 
                  })}
                  placeholder="/ruta/destino"
                />
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={() => handleSaveLink(editingLink.link)}
                  className="bg-[#1C5D15] hover:bg-[#1C5D15]/90 text-white"
                >
                  Guardar Enlace
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}