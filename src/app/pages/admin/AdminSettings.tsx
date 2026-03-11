import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Settings, 
  Save, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Palette
} from 'lucide-react';
import { toast } from 'sonner';
import { SiteSettings, supabaseAPI } from '../../data/supabase';

export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await supabaseAPI.getSiteSettings();
      setSettings(data);
    } catch (error) {
      toast.error('Error al cargar configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    setSaving(true);
    try {
      await supabaseAPI.updateSiteSettings(settings);
      toast.success('Configuración guardada exitosamente');
    } catch (error) {
      toast.error('Error al guardar configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SiteSettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const updateNestedField = (parent: keyof SiteSettings, field: string, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [parent]: {
        ...(settings[parent] as any),
        [field]: value,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#629960]">Cargando configuración...</p>
      </div>
    );
  }

  if (!settings) return null;

  // Asegurar que las propiedades existan
  const safeSettings = {
    ...settings,
    social_media: settings.social_media || {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    seo: settings.seo || {
      default_title: "",
      default_description: "",
      default_keywords: "",
    },
    colors: settings.colors || {
      primary: "#1C5D15",
      secondary: "#629960",
      accent: "#19FF00",
      background: "#F7F9CE",
    },
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-[#1C5D15] mb-2">Configuración del Sistema</h2>
          <p className="text-[#629960]">Ajustes generales y preferencias</p>
        </div>
        <Button
          onClick={handleSave}
          className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15]"
          disabled={saving}
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Información General */}
        <Card className="p-6 bg-white border-2 border-[#629960]/20">
          <h3 className="text-xl text-[#1C5D15] mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Información General
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="siteName" className="text-[#1C5D15]">
                Nombre del Sitio
              </Label>
              <Input
                id="siteName"
                type="text"
                value={safeSettings.site_name || ""}
                onChange={(e) => updateField('site_name', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="siteEmail" className="text-[#1C5D15] flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email de Contacto
              </Label>
              <Input
                id="siteEmail"
                type="email"
                value={safeSettings.site_email || ""}
                onChange={(e) => updateField('site_email', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="sitePhone" className="text-[#1C5D15] flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Teléfono
              </Label>
              <Input
                id="sitePhone"
                type="text"
                value={safeSettings.site_phone || ""}
                onChange={(e) => updateField('site_phone', e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="siteAddress" className="text-[#1C5D15] flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Dirección
              </Label>
              <Input
                id="siteAddress"
                type="text"
                value={safeSettings.site_address || ""}
                onChange={(e) => updateField('site_address', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* Redes Sociales */}
        <Card className="p-6 bg-white border-2 border-[#629960]/20">
          <h3 className="text-xl text-[#1C5D15] mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Redes Sociales
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="facebook" className="text-[#1C5D15] flex items-center gap-2">
                <Facebook className="w-4 h-4" />
                Facebook
              </Label>
              <Input
                id="facebook"
                type="url"
                value={safeSettings.social_media.facebook || ''}
                onChange={(e) => updateNestedField('social_media', 'facebook', e.target.value)}
                placeholder="https://facebook.com/..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="twitter" className="text-[#1C5D15] flex items-center gap-2">
                <Twitter className="w-4 h-4" />
                Twitter
              </Label>
              <Input
                id="twitter"
                type="url"
                value={safeSettings.social_media.twitter || ''}
                onChange={(e) => updateNestedField('social_media', 'twitter', e.target.value)}
                placeholder="https://twitter.com/..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="instagram" className="text-[#1C5D15] flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                Instagram
              </Label>
              <Input
                id="instagram"
                type="url"
                value={safeSettings.social_media.instagram || ''}
                onChange={(e) => updateNestedField('social_media', 'instagram', e.target.value)}
                placeholder="https://instagram.com/..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="linkedin" className="text-[#1C5D15] flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                type="url"
                value={safeSettings.social_media.linkedin || ''}
                onChange={(e) => updateNestedField('social_media', 'linkedin', e.target.value)}
                placeholder="https://linkedin.com/..."
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        {/* SEO */}
        <Card className="p-6 bg-white border-2 border-[#629960]/20">
          <h3 className="text-xl text-[#1C5D15] mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            SEO (Optimización para Motores de Búsqueda)
          </h3>
          <div className="space-y-6">
            <div>
              <Label htmlFor="seoTitle" className="text-[#1C5D15]">
                Título por Defecto
              </Label>
              <Input
                id="seoTitle"
                type="text"
                value={safeSettings.seo.default_title || ""}
                onChange={(e) => updateNestedField('seo', 'default_title', e.target.value)}
                className="mt-1"
                maxLength={60}
              />
              <p className="text-xs text-[#629960] mt-1">
                {safeSettings.seo.default_title?.length || 0}/60 caracteres (recomendado: 50-60)
              </p>
            </div>

            <div>
              <Label htmlFor="seoDescription" className="text-[#1C5D15]">
                Descripción por Defecto
              </Label>
              <textarea
                id="seoDescription"
                value={safeSettings.seo.default_description || ""}
                onChange={(e) => updateNestedField('seo', 'default_description', e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg"
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-[#629960] mt-1">
                {safeSettings.seo.default_description?.length || 0}/160 caracteres (recomendado: 150-160)
              </p>
            </div>

            <div>
              <Label htmlFor="seoKeywords" className="text-[#1C5D15]">
                Palabras Clave (separadas por comas)
              </Label>
              <Input
                id="seoKeywords"
                type="text"
                value={safeSettings.seo.default_keywords || ""}
                onChange={(e) => updateNestedField('seo', 'default_keywords', e.target.value)}
                className="mt-1"
                placeholder="palabra1, palabra2, palabra3"
              />
            </div>
          </div>
        </Card>

        {/* Colores del Tema */}
        <Card className="p-6 bg-white border-2 border-[#629960]/20">
          <h3 className="text-xl text-[#1C5D15] mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Colores del Tema
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="colorPrimary" className="text-[#1C5D15]">
                Color Primario
              </Label>
              <div className="flex gap-3 mt-1">
                <Input
                  id="colorPrimary"
                  type="color"
                  value={settings.colors.primary}
                  onChange={(e) => updateNestedField('colors', 'primary', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={settings.colors.primary}
                  onChange={(e) => updateNestedField('colors', 'primary', e.target.value)}
                  className="flex-1"
                  placeholder="#1C5D15"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="colorSecondary" className="text-[#1C5D15]">
                Color Secundario
              </Label>
              <div className="flex gap-3 mt-1">
                <Input
                  id="colorSecondary"
                  type="color"
                  value={settings.colors.secondary}
                  onChange={(e) => updateNestedField('colors', 'secondary', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={settings.colors.secondary}
                  onChange={(e) => updateNestedField('colors', 'secondary', e.target.value)}
                  className="flex-1"
                  placeholder="#629960"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="colorAccent" className="text-[#1C5D15]">
                Color de Acento
              </Label>
              <div className="flex gap-3 mt-1">
                <Input
                  id="colorAccent"
                  type="color"
                  value={settings.colors.accent}
                  onChange={(e) => updateNestedField('colors', 'accent', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={settings.colors.accent}
                  onChange={(e) => updateNestedField('colors', 'accent', e.target.value)}
                  className="flex-1"
                  placeholder="#19FF00"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="colorBackground" className="text-[#1C5D15]">
                Color de Fondo
              </Label>
              <div className="flex gap-3 mt-1">
                <Input
                  id="colorBackground"
                  type="color"
                  value={settings.colors.background}
                  onChange={(e) => updateNestedField('colors', 'background', e.target.value)}
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={settings.colors.background}
                  onChange={(e) => updateNestedField('colors', 'background', e.target.value)}
                  className="flex-1"
                  placeholder="#F7F9CE"
                />
              </div>
            </div>
          </div>

          {/* Preview de colores */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-[#629960] mb-3">Vista Previa:</p>
            <div className="flex gap-4">
              <div className="flex-1 text-center">
                <div
                  className="h-16 rounded-lg mb-2"
                  style={{ backgroundColor: settings.colors.primary }}
                />
                <p className="text-xs">Primario</p>
              </div>
              <div className="flex-1 text-center">
                <div
                  className="h-16 rounded-lg mb-2"
                  style={{ backgroundColor: settings.colors.secondary }}
                />
                <p className="text-xs">Secundario</p>
              </div>
              <div className="flex-1 text-center">
                <div
                  className="h-16 rounded-lg mb-2"
                  style={{ backgroundColor: settings.colors.accent }}
                />
                <p className="text-xs">Acento</p>
              </div>
              <div className="flex-1 text-center">
                <div
                  className="h-16 rounded-lg mb-2 border"
                  style={{ backgroundColor: settings.colors.background }}
                />
                <p className="text-xs">Fondo</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Botón de guardar inferior */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15]"
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </div>
    </div>
  );
}
