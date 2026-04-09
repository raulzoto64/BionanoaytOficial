import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ExternalLink, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "../contexts/LanguageContext";
import { DatabaseManager } from "../data/DatabaseManager";
import { FooterSettings } from "../data/supabase";
import { supabaseAPI, Category} from "../data/supabase";

interface ContactInfo {
  phone: string;
  email: string;
  location: string;
}

interface FooterProps {
  contactInfo: ContactInfo;
}

export function Footer({ contactInfo }: FooterProps) {
  const { t, language } = useLanguage();
  const [footerSettings, setFooterSettings] = useState<FooterSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    loadFooterSettings();
    loadCategories();
    loadSiteSettings();
  }, []);

  const loadSiteSettings = async () => {
    try {
      const settings = await supabaseAPI.getSiteSettings();
      setSiteSettings(settings);
    } catch (error) {
      console.error('Error loading site settings:', error);
    }
  };

  const loadFooterSettings = async () => {
    try {
      const settings = await DatabaseManager.getFooterSettings();
      setFooterSettings(settings);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading footer settings:', error);
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await supabaseAPI.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("¡Mensaje enviado! Nos pondremos en contacto pronto.");
    setFormData({ name: "", email: "", message: "" });
  };

  const getCurrentYear = () => new Date().getFullYear();

  const renderFooterColumns = () => {
    if (isLoading || !footerSettings) return null;

    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {footerSettings.columns.map((column) => (
          <div key={column.id} className="space-y-4">
            <h4 className="text-lg font-semibold text-[#19FF00]">
              {language === 'es' ? column.title_es : column.title_en}
            </h4>
            <ul className="space-y-3">
              {column.links.map((link) => (
                <li key={link.id}>
                  <a
                    href={link.type === 'category_dropdown' ? `/store?category=${link.category_id}` : link.url}
                    className="text-white/80 hover:text-[#19FF00] transition-colors flex items-center gap-1"
                    target={link.url.startsWith('http') ? '_blank' : '_self'}
                    rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
                  >
                    {language === 'es' ? link.label_es : link.label_en}
                    {link.url.startsWith('http') && (
                      <ExternalLink className="w-3 h-3" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  const renderSocialMedia = () => {
    if (isLoading || !footerSettings) return null;

    const socialLinks = [
      { 
        name: 'Facebook', 
        icon: Facebook, 
        url: footerSettings.social_media.facebook 
      },
      { 
        name: 'Twitter', 
        icon: Twitter, 
        url: footerSettings.social_media.twitter 
      },
      { 
        name: 'Instagram', 
        icon: Instagram, 
        url: footerSettings.social_media.instagram 
      },
      { 
        name: 'LinkedIn', 
        icon: Linkedin, 
        url: footerSettings.social_media.linkedin 
      },
    ].filter(link => link.url);

    if (socialLinks.length === 0) return null;

    return (
      <div className="flex items-center gap-6 mb-8">
        <span className="text-white/80">Síguenos:</span>
        <div className="flex gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-[#19FF00] hover:text-[#1C5D15] transition-all"
              target="_blank"
              rel="noopener noreferrer"
              title={link.name}
            >
              <link.icon className="w-5 h-5" />
            </a>
          ))}
        </div>
      </div>
    );
  };

  return (
    <footer className="bg-[#1C5D15] text-white py-16">
      <div className="max-w-6xl mx-auto px-5 lg:px-6">
        {/* Footer Columns */}
        {renderFooterColumns()}

        {/* Contact Form and Info */}
        <div id="contact" className="grid md:grid-cols-2 gap-12 mb-12">
          {/* Contact Form */}
          <div>
            <h3 className="text-3xl mb-6">{t('footer.contact')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder={t('form.name')}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder={t('form.email')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <div>
                <Textarea
                  placeholder={t('form.message')}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <Button 
                type="submit"
                className="w-full bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00]/90"
              >
                {t('btn.send_message')}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-3xl mb-6">{t('footer.information')}</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#19FF00]/20 rounded-lg">
                  <Phone className="w-6 h-6 text-[#19FF00]" />
                </div>
                <div>
                  <h4 className="mb-1">{t('footer.phone')}</h4>
                  <p className="text-white/80">
                    {siteSettings?.site_phone || contactInfo.phone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#19FF00]/20 rounded-lg">
                  <Mail className="w-6 h-6 text-[#19FF00]" />
                </div>
                <div>
                  <h4 className="mb-1">{t('footer.email')}</h4>
                  <p className="text-white/80">
                    {siteSettings?.site_email || contactInfo.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#19FF00]/20 rounded-lg">
                  <MapPin className="w-6 h-6 text-[#19FF00]" />
                </div>
                <div>
                  <h4 className="mb-1">{t('footer.address')}</h4>
                  <p className="text-white/80">
                    {siteSettings?.site_address || contactInfo.location}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        {renderSocialMedia()}

        {/* Copyright */}
        <div className="pt-8 border-t border-white/20 text-center text-white/60">
          <p>
            {isLoading || !footerSettings 
              ? `© ${getCurrentYear()} BionanoAyT. All rights reserved.`
              : (language === 'es' 
                  ? footerSettings.copyright_text_es.replace('{{year}}', getCurrentYear().toString())
                  : footerSettings.copyright_text_en.replace('{{year}}', getCurrentYear().toString())
                )
            }
          </p>
        </div>
      </div>
    </footer>
  );
}