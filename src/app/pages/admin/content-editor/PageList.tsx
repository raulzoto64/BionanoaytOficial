import { Card } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { FileText, Globe } from 'lucide-react';
import { Page, PageContent } from '../../../data/supabase';

interface PageWithContent extends Page {
  contentES: PageContent | null;
  contentEN: PageContent | null;
}

interface PageListProps {
  pagesData: PageWithContent[];
  onEditPage: (page: PageWithContent) => void;
}

export function PageList({ pagesData, onEditPage }: PageListProps) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl text-[#1C5D15] mb-2">Gestión de Contenido</h2>
        <p className="text-[#629960]">Administra el contenido de todas las páginas del sitio</p>
      </div>

      <div className="grid gap-4">
        {pagesData.map((page) => (
          <Card key={page.id} className="p-6 bg-white border-2 border-[#629960]/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#1C5D15] rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl text-[#1C5D15] mb-1 capitalize">
                    {page.slug.replace(/-/g, ' ')}
                  </h3>
                  <p className="text-sm text-[#629960]">
                    {page.contentES?.sections.length || 0} secciones
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Badge
                  className={
                    page.status === 'published'
                      ? 'bg-[#19FF00] text-[#1C5D15]'
                      : 'bg-[#629960] text-white'
                  }
                >
                  {page.status === 'published' ? 'Publicado' : 'Borrador'}
                </Badge>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#1C5D15] text-[#1C5D15]"
                  onClick={() => onEditPage(page)}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Editar Contenido
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-8 p-6 bg-gradient-to-r from-[#1C5D15] to-[#629960] text-white">
        <h3 className="text-2xl mb-3">💡 Editor de Contenido</h3>
        <p className="mb-4 opacity-90">
          Desde aquí podrás editar el contenido de cada sección de las páginas. Cada página tiene
          múltiples secciones que puedes personalizar en español e inglés.
        </p>
        <ul className="list-disc list-inside space-y-2 opacity-90">
          <li>Edita títulos, subtítulos y descripciones</li>
          <li>Cambia imágenes y videos</li>
          <li>Modifica textos de botones y enlaces</li>
          <li>Gestiona el contenido en ambos idiomas</li>
          <li>Reordena y administra secciones</li>
        </ul>
      </Card>
    </div>
  );
}
