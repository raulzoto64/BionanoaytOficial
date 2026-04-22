import { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Sparkles, 
  Award, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  Info
} from "lucide-react";
import { useNavigate } from "react-router";
import { handleAction } from "../utils/actions";
import { motion } from "framer-motion";

interface Feature {
  icon: 'Shield' | 'Leaf' | 'Droplets';
  title: string;
  description: string;
}

interface FeaturedProductProps {
  content: Record<string, any> & { features?: Feature[] };
  sectionId?: string;
}

export function FeaturedProduct({ content, sectionId }: FeaturedProductProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');

  // Datos del producto BNX-001
  const productData = {
    name: content.productName || "BNX-001",
    short_description: "Nuestra solución insignia de desinfección y protección antimicrobiana de última generación. Formulado con nanopartículas de plata orgánica y extractos botánicos activos, BNX ofrece una eficacia sin precedentes contra bacterias, hongos, virus y esporas, con impacto mínimo sobre el ecosistema.",
    description: `BNX-001 es nuestra tecnología estrella desarrollada después de 7 años de investigación. Es un biocida 100% natural basado en extractos vegetales activados que elimina el 99.9% de microorganismos patógenos en superficies y ambientes.

Su fórmula patentada actúa en menos de 60 segundos, creando una barrera protectora que dura hasta 30 días. No es tóxico, no genera resistencia bacteriana y es completamente seguro para personas, animales y medio ambiente.

Utilizado actualmente en hospitales, industrias alimentarias, centros educativos y transporte público en más de 12 países.`,
    features: [
      "Elimina 99.9% de bacterias, virus, hongos y esporas",
      "Actúa en menos de 60 segundos de contacto",
      "Protección residual activa por hasta 30 días",
      "100% biodegradable y no tóxico",
      "No genera resistencia microbiana",
      "Certificado por organismos internacionales"
    ],
    benefits: [
      "Reduce costos operativos en un 40%",
      "Elimina completamente uso de químicos agresivos",
      "Cumple con todas las normativas sanitarias mundiales",
      "Protege a tu personal y clientes de contaminaciones cruzadas",
      "Sello de garantía BionanoAYT incluido"
    ],
    technical_specs: "pH: 6.8 - 7.2 | Concentración: 1200 ppm | Vida útil: 24 meses | Temperatura de uso: 5°C a 45°C"
  };

  return (
    <section className="py-20 bg-gradient-to-b from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-5 lg:px-6">
        
        {/* HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-[#19FF00] text-[#1C5D15] px-4 py-1.5">
            Biotecnología Avanzada
          </Badge>
          <h2 className="text-4xl md:text-5xl font-black text-[#1C5D15] mb-4">
            {productData.name}
          </h2>
          <p className="text-xl text-[#629960] max-w-3xl mx-auto leading-relaxed">
            {productData.short_description}
          </p>
        </motion.div>

        {/* GRID PRINCIPAL 2 COLUMNAS */}
        <div className="grid md:grid-cols-2 gap-12 items-start">
          
          {/* COLUMNA IZQUIERDA - IMAGEN */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-[#1C5D15] to-[#629960] p-4 group hover:scale-[1.02] hover:shadow-xl transition-all duration-500 will-change-transform">
              <img
                src={content.productImage}
                alt={productData.name}
                className="w-full h-full object-cover rounded-xl"
              />
              
              {/* Overlay inferior */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-4 text-white flex items-center gap-4">
                  <Sparkles className="w-8 h-8" />
                  <div>
                    <div className="text-3xl font-black">99.9%</div>
                    <div className="text-sm opacity-90">Remoción microbiana</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* COLUMNA DERECHA - TABS */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* ✅ EN MOVIL: TODO EL CONTENIDO UNO DEBAJO DEL OTRO SIN TABS */}
            {/* ✅ EN DESKTOP: TABS NORMALES */}
            <div className="hidden md:block">
              <Tabs defaultValue="description" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="description">Descripción</TabsTrigger>
                  <TabsTrigger value="features">Características</TabsTrigger>
                  <TabsTrigger value="benefits">Beneficios</TabsTrigger>
                </TabsList>

                {/* TAB DESCRIPCIÓN */}
                <TabsContent value="description" className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-l-4 border-l-green-600">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3 mb-4">
                          <div className="bg-green-100 p-2 rounded-lg mt-1">
                            <FileText className="w-5 h-5 text-green-600" />
                          </div>
                          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {productData.description}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {productData.technical_specs && (
                      <Card className="border-l-4 border-l-blue-600 bg-blue-50/50 mt-6">
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 text-blue-700">
                            <Info className="w-4 h-4" />
                            <span className="text-sm font-medium">Especificaciones técnicas:</span>
                          </div>
                          <div className="text-sm text-gray-600 mt-2 font-mono">
                            {productData.technical_specs}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                </TabsContent>

                {/* TAB CARACTERISTICAS */}
                <TabsContent value="features" className="space-y-3">
                  {productData.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      whileHover={{ x: 4, boxShadow: "0 4px 20px rgba(28, 93, 21, 0.1)" }}
                    >
                      <Card className="border-l-4 border-l-green-600 hover:shadow-md transition-all">
                        <CardContent className="py-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-green-100 p-2 rounded-lg">
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                            </div>
                            <span className="text-gray-700">{feature}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </TabsContent>

                {/* TAB BENEFICIOS */}
                <TabsContent value="benefits" className="space-y-3">
                  {productData.benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Card className="border-l-4 border-l-emerald-500 bg-emerald-50/50">
                        <CardContent className="py-4">
                          <div className="flex items-start gap-3">
                            <div className="bg-emerald-100 p-2 rounded-lg">
                              <Award className="w-5 h-5 text-emerald-600" />
                            </div>
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}

                  <Card className="bg-amber-50 border-amber-200 mt-4">
                    <CardContent className="py-3">
                      <div className="flex items-center gap-2 text-amber-700 text-sm">
                        <Info className="w-4 h-4" />
                        <span>✔️ Único producto en el mercado con esta combinación de ventajas</span>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* MOBILE - TODOS LOS CONTENIDOS VISIBLES UNO DEBAJO DEL OTRO SIN TABS */}
            <div className="md:hidden space-y-8">
              
              <div>
                <h3 className="text-xl font-bold text-[#1C5D15] mb-4">Descripción</h3>
                <Card className="border-l-4 border-l-green-600">
                  <CardContent className="pt-5">
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                      {productData.description}
                    </div>
                  </CardContent>
                </Card>

                  {productData.technical_specs && (
                  <Card className="border-l-4 border-l-blue-600 bg-blue-50/50 mt-6">
                    <CardContent className="pt-4">
                      <div className="text-sm text-gray-600 mt-2 font-mono">
                        {productData.technical_specs}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#1C5D15] mb-4">Características</h3>
                <div className="space-y-3">
                  {productData.features.map((feature, index) => (
                    <Card key={index} className="border-l-4 border-l-green-600">
                      <CardContent className="py-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#1C5D15] mb-4">Beneficios</h3>
                <div className="space-y-3">
                  {productData.benefits.map((benefit, index) => (
                    <Card key={index} className="border-l-4 border-l-emerald-500 bg-emerald-50/50">
                      <CardContent className="py-4">
                        <div className="flex items-start gap-3">
                          <div className="bg-emerald-100 p-2 rounded-lg">
                            <Award className="w-5 h-5 text-emerald-600" />
                          </div>
                          <span className="text-gray-700">{benefit}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

            </div>

            {/* BOTON CTA */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <Button 
                size="lg"
                className="w-full rounded-full px-8 uppercase text-sm tracking-wider h-12 bg-[#19FF00] text-[#1C5D15] hover:bg-[#19FF00]/90 group"
                onClick={() => handleAction(content.ctaActionType, content.ctaLink, navigate, { from: 'home', sectionId: sectionId || 'featured' })}
              >
                {content.ctaText || "Solicitar información"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <p className="text-center text-sm text-gray-500 mt-2">Asesoría técnica especializada incluida</p>
            </motion.div>
          </motion.div>
        </div>

        {/* SECCIÓN ESTADISTICAS */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16"
        >
          <Card className="bg-green-50 border-green-200 text-center hover:shadow-lg transition-shadow">
            <CardContent className="py-6">
              <div className="text-4xl font-black text-green-600">99.9%</div>
              <div className="text-sm text-gray-600 mt-1">Eficiencia biocida</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200 text-center hover:shadow-lg transition-shadow">
            <CardContent className="py-6">
              <div className="text-4xl font-black text-blue-600">+35</div>
              <div className="text-sm text-gray-600 mt-1">Días en tránsito</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200 text-center hover:shadow-lg transition-shadow">
            <CardContent className="py-6">
              <div className="text-4xl font-black text-purple-600">30%</div>
              <div className="text-sm text-gray-600 mt-1">Recuperación de pérdidas</div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200 text-center hover:shadow-lg transition-shadow">
            <CardContent className="py-6">
              <div className="text-4xl font-black text-amber-600">0</div>
              <div className="text-sm text-gray-600 mt-1">Residuos químicos</div>
            </CardContent>
          </Card>
        </motion.div>

      </div>
    </section>
  );
}