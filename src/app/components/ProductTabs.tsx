import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card } from './ui/card';
import { Check } from 'lucide-react';

interface ProductTabsProps {
  translation: {
    description: string;
    features: string[];
    benefits: string[];
    technical_specs: Record<string, string>;
  };
  language: string;
  t: (key: string) => string;
}

export function ProductTabs({ translation, language, t }: ProductTabsProps) {
  return (
    <div className="w-full mb-16">
      {/* Estilo inyectado para ocultar el scrollbar en todos los navegadores */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <Tabs defaultValue="description" className="w-full">
        {/* - md:justify-center: Centra el grupo en PC.
          - justify-start: Alinea al inicio en móvil para permitir el scroll.
        */}
        <TabsList className="flex w-full overflow-x-auto bg-[#629960]/20 p-1 no-scrollbar justify-start md:justify-center rounded-lg">
          {/* - flex-none: En móvil mantiene su ancho según el texto.
            - md:flex-1: En PC se estira para ocupar exactamente el 25% del total.
          */}
          <TabsTrigger 
            value="description" 
            className="flex-none md:flex-1 whitespace-nowrap px-6 py-2 data-[state=active]:bg-[#1C5D15] data-[state=active]:text-white transition-all rounded-md"
          >
            {language === 'es' ? 'Descripción' : 'Description'}
          </TabsTrigger>
          <TabsTrigger 
            value="features" 
            className="flex-none md:flex-1 whitespace-nowrap px-6 py-2 data-[state=active]:bg-[#1C5D15] data-[state=active]:text-white transition-all rounded-md"
          >
            {t('products.features')}
          </TabsTrigger>
          <TabsTrigger 
            value="benefits" 
            className="flex-none md:flex-1 whitespace-nowrap px-6 py-2 data-[state=active]:bg-[#1C5D15] data-[state=active]:text-white transition-all rounded-md"
          >
            {t('products.benefits')}
          </TabsTrigger>
          <TabsTrigger 
            value="specs" 
            className="flex-none md:flex-1 whitespace-nowrap px-6 py-2 data-[state=active]:bg-[#1C5D15] data-[state=active]:text-white transition-all rounded-md"
          >
            {t('products.specs')}
          </TabsTrigger>
        </TabsList>

        {/* --- CONTENIDOS --- */}
        <TabsContent value="description" className="mt-6 focus-visible:outline-none">
          <Card className="p-6 sm:p-8 bg-white border-none shadow-sm">
            <div className="space-y-4">
              {translation.description.split(/\n\n|(?<=\.{3})|(?<=\.)(?=\s[A-Z])/).map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index} className="text-base sm:text-lg leading-relaxed text-[#1C5D15]">
                    {paragraph.trim()}
                  </p>
                )
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6 focus-visible:outline-none">
          <Card className="p-6 sm:p-8 bg-white border-none shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-[#1C5D15]">{t('products.features')}</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {translation.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 bg-[#629960]/5 p-3 rounded-lg">
                  <Check className="w-5 h-5 text-[#19FF00] flex-shrink-0 mt-0.5" />
                  <span className="text-[#1C5D15]">{feature}</span>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="mt-6 focus-visible:outline-none">
          <Card className="p-6 sm:p-8 bg-white border-none shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-[#1C5D15]">{t('products.benefits')}</h3>
            <ul className="space-y-4">
              {translation.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-4 border-l-4 border-[#19FF00] pl-4">
                  <span className="text-[#1C5D15]">{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
        </TabsContent>

        <TabsContent value="specs" className="mt-6 focus-visible:outline-none">
          <Card className="p-6 sm:p-8 bg-white border-none shadow-sm">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-[#1C5D15]">{t('products.specs')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {Object.entries(translation.technical_specs).map(([key, value]) => (
                <div key={key} className="flex justify-between border-b border-[#629960]/10 pb-2">
                  <dt className="font-bold text-[#629960] text-sm uppercase">{key}</dt>
                  <dd className="text-[#1C5D15] font-medium text-right ml-4">{value as string}</dd>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
