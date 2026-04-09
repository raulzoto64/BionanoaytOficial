import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Filter, Search, Star } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useLanguage } from "../contexts/LanguageContext";
import { useDatabase } from "../hooks/useDatabase";
import { supabaseAPI, Product, ProductTranslation, Category, CategoryTranslation } from "../data/supabase";

interface ProductWithDetails {
  product: Product;
  translation: ProductTranslation;
  category: CategoryTranslation | null;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 mb-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? "fill-[#19FF00] text-[#19FF00]"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
      <span className="text-sm text-[#629960] ml-1">({rating}.0)</span>
    </div>
  );
}

export function Store() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const { updateTrigger } = useDatabase();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Handle category from URL
  const selectedCategory = searchParams.get("category") || "all";

  const handleCategoryChange = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", category);
    }
    setSearchParams(newParams, { replace: true });
  };

  useEffect(() => {
    loadData();
  }, [language, updateTrigger]); // Re-cargar cuando cambie el idioma o la base de datos

  const loadData = async () => {
    if (products.length === 0) setLoading(true);
    try {
      
      // Cargar productos
      const productsData = await supabaseAPI.getProducts();
      
      // Cargar categorías
      const categoriesData = await supabaseAPI.getCategories();
      
      // Combinar productos con sus traducciones y categorías
      const productsWithDetails = await Promise.all(
        productsData.map(async (product: Product) => {
          const translation = await supabaseAPI.getProductTranslation(product.id, language);
          const category = await supabaseAPI.getCategoryTranslation(product.category, language);
          
          return {
            product,
            translation: translation!,
            category,
          };
        })
      );


      // Combinar categorías con traducciones
      const categoriesWithTranslations = await Promise.all(
        categoriesData.map(async (cat: Category) => {
          const translation = await supabaseAPI.getCategoryTranslation(cat.id, language);
          return {
            id: cat.id,
            name: translation?.name || cat.slug,
          };
        })
      );

      setProducts(productsWithDetails);
      setCategories([
        { id: "all", name: language === 'es' ? "Todos los productos" : "All products" },
        ...categoriesWithTranslations,
      ]);
      
    } catch (error) {
      // En caso de error, usar datos hardcodeados como fallback
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.product.category === selectedCategory;
    const matchesSearch = item.translation?.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleProductClick = (slug: string) => {
    navigate(`/products/${slug}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1C5D15] text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl mb-4">
            {language === 'es' ? 'Tienda Online' : 'Online Store'}
          </h1>
          <p className="text-xl text-[#F7F9CE]">
            {language === 'es'
              ? 'Productos bionanotecnológicos de alta calidad'
              : 'High-quality bionanotechnology products'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder={language === 'es' ? 'Buscar productos...' : 'Search products...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 items-center">
            <Filter className="w-5 h-5 text-[#629960]" />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white text-[#1C5D15]"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-t-[#19FF00] border-[#1C5D15]/20 rounded-full animate-spin mb-4"></div>
            <p className="text-[#629960]">
              {language === 'es' ? 'Cargando productos...' : 'Loading products...'}
            </p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              {filteredProducts.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-gray-100 hover:border-[#19FF00] cursor-pointer"
                  onClick={() => handleProductClick(item.product.slug)}
                >
                  <div className="h-64 overflow-hidden bg-gradient-to-br from-[#1C5D15] to-[#629960]">
                    <img
                      src={item.product.image}
                      alt={item.translation.name}
                      className="w-full h-full object-cover opacity-80"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <StarRating rating={5} />
                    <h3 className="text-xl mb-2 text-[#1C5D15] line-clamp-2">
                      {item.translation.name}
                    </h3>
                    <p className="text-sm text-[#629960] mb-4 line-clamp-2">
                      {item.translation.short_description}
                    </p>
                    <div className="mb-4">
                      <span className="text-sm text-[#629960]">
                        {item.category?.name || ''}
                      </span>
                    </div>
                    <Button className="w-full bg-[#1C5D15] text-white hover:bg-[#19FF00] hover:text-[#1C5D15]">
                      {language === 'es' ? 'Ver detalles' : 'View details'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-[#629960]">
                  {language === 'es'
                    ? 'No se encontraron productos con los filtros seleccionados'
                    : 'No products found with the selected filters'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}