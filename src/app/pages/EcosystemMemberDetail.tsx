import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Globe, Link as LinkIcon, Video, ExternalLink } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';
import { supabaseAPI, EcosystemMember, EcosystemMemberTranslation } from '../data/supabase';
import { SEO } from '../components/SEO';

export function EcosystemMemberDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<EcosystemMember | null>(null);
  const [translation, setTranslation] = useState<EcosystemMemberTranslation | null>(null);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    if (slug) {
      loadMember();
    }
  }, [slug, language]);

  const loadMember = async () => {
    setLoading(true);
    try {
      const ecosystemMember = await supabaseAPI.getEcosystemMemberBySlug(slug!);
      if (ecosystemMember) {
        setMember(ecosystemMember);
        const memberTranslation = await supabaseAPI.getEcosystemMemberTranslation(ecosystemMember.id, language);
        setTranslation(memberTranslation);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F9CE] flex items-center justify-center">
        <p className="text-[#629960]">Cargando...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-[#F7F9CE] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl text-[#1C5D15] mb-4">Miembro no encontrado</h2>
          <p className="text-[#629960] mb-6">El miembro del ecosistema que buscas no existe o no está disponible.</p>
          <Button 
            className="bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15]"
            onClick={() => {
              navigate("/");
              setTimeout(() => {
                const element = document.getElementById("ecosystem");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }, 500);
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title={translation?.name || 'Miembro del ecosistema'}
        description={translation?.description || `Conoce a ${translation?.name} en el ecosistema de Bionano A&T`}
        keywords={`${translation?.name}, ${member.sector}`}
      />
      
      <div className="min-h-screen bg-[#F7F9CE]">
        {/* Header */}
        <div className="bg-[#1C5D15] text-white py-8">
          <div className="max-w-6xl mx-auto px-6">
            <button 
              onClick={() => {
                navigate("/");
                setTimeout(() => {
                  const element = document.getElementById("ecosystem");
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                  }
                }, 500);
              }}
              className="flex items-center gap-2 text-white hover:text-[#19FF00] transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Volver al inicio</span>
            </button>
            <h1 className="text-4xl md:text-5xl mb-2">{translation?.name || 'Miembro'}</h1>
            <p className="text-[#19FF00] text-lg">{member.sector}</p>
            <Badge className={member.status === 'active' ? 'bg-[#19FF00] text-[#1C5D15]' : 'bg-gray-400 text-white'}>
              {member.status === 'active' ? 'Activo' : member.status === 'draft' ? 'Borrador' : 'Inactivo'}
            </Badge>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Información general */}
            <div className="space-y-8">
              {/* Imagen */}
              <Card className="overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={translation?.name || 'Miembro del ecosistema'}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gradient-to-br from-[#1C5D15] to-[#629960] flex items-center justify-center">
                    <span className="text-white text-6xl font-bold">
                      {translation?.name?.charAt(0)}{translation?.name?.split(' ').pop()?.charAt(0)}
                    </span>
                  </div>
                )}
              </Card>

              {/* Redes sociales */}
              <Card className="p-6">
                <h2 className="text-2xl text-[#1C5D15] mb-4">Redes Sociales</h2>
                <div className="space-y-4">
                  {member.social_media?.facebook && (
                    <a
                      href={member.social_media.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[#629960] hover:text-[#1C5D15] transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                      <span>Facebook</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {member.social_media?.twitter && (
                    <a
                      href={member.social_media.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[#629960] hover:text-[#1C5D15] transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                      <span>Twitter</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {member.social_media?.instagram && (
                    <a
                      href={member.social_media.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[#629960] hover:text-[#1C5D15] transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                      <span>Instagram</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {member.social_media?.linkedin && (
                    <a
                      href={member.social_media.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[#629960] hover:text-[#1C5D15] transition-colors"
                    >
                      <Globe className="w-5 h-5" />
                      <span>LinkedIn</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {member.social_media?.website && (
                    <a
                      href={member.social_media.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-[#629960] hover:text-[#1C5D15] transition-colors"
                    >
                      <LinkIcon className="w-5 h-5" />
                      <span>Website</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </Card>
            </div>

            {/* Descripción */}
            <div className="space-y-8">
              <Card className="p-8">
                <h2 className="text-3xl text-[#1C5D15] mb-6">Sobre {translation?.name}</h2>
                <p className="text-lg text-[#629960] leading-relaxed">
                  {translation?.description || `Descubre más sobre ${translation?.name} y su papel en el ecosistema de Bionano A&T.`}
                </p>
              </Card>

              {/* Videos de YouTube */}
              {member.youtube_videos && member.youtube_videos.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl text-[#1C5D15] mb-4">
                    <Video className="w-6 h-6 inline mr-2" />
                    Videos de YouTube
                  </h2>
                  <div className="space-y-4">
                    {member.youtube_videos.map((video, index) => (
                      <div key={index} className="aspect-video w-full">
                        <iframe
                          src={video}
                          title={`Video ${index + 1}`}
                          className="w-full h-full rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Videos cortos */}
              {member.short_videos && member.short_videos.length > 0 && (
                <Card className="p-6">
                  <h2 className="text-2xl text-[#1C5D15] mb-4">
                    <Video className="w-6 h-6 inline mr-2" />
                    Videos Cortos
                  </h2>
                  <div className="space-y-4">
                    {member.short_videos.map((video, index) => (
                      <div key={index} className="aspect-video w-full">
                        <iframe
                          src={video}
                          title={`Video corto ${index + 1}`}
                          className="w-full h-full rounded-lg"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}