import { ShoppingCart, Check, ArrowRight, Star } from "lucide-react";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { useLanguage } from "../contexts/LanguageContext";
import { Product, ProductTranslation, PriceByQuantity } from "../data/supabase";
import { supabaseAPI } from "../data/supabase";
import { useState, useEffect } from "react";

interface ProductWithTranslation {
  id: string;
  slug: string;
  category: string;
  image: string;
  featured: boolean;
  translation: ProductTranslation;
}

interface ProductsProps {
  products?: ProductWithTranslation[];
  title: string;
  subtitle: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1 mb-3">
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

function formatPrice(price: number, currency: string) {
  if (currency === "COP") {
    return `$${price.toLocaleString("es-CO")} COP`;
  }
  return `$${price.toLocaleString("en-US")} ${currency}`;
}

export function Products({ products, title, subtitle }: ProductsProps) {
  const { t } = useLanguage();
  const [productPrices, setProductPrices] = useState<Record<string, PriceByQuantity[]>>({});
  
  // Load prices for each product
  useEffect(() => {
    const loadPrices = async () => {
      if (!products) return;
      
      const pricesData: Record<string, PriceByQuantity[]> = {};
      for (const product of products) {
        const prices = await supabaseAPI.getPricesByProduct(product.id);
        pricesData[product.id] = prices;
      }
      
      setProductPrices(pricesData);
    };
    
    loadPrices();
  }, [products]);
  
  // If products are not provided, display nothing (or placeholder)
  if (!products || products.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-[#19FF00] text-[#1C5D15] rounded-full mb-4">
              {t('products.catalog')}
            </div>
            <h2 className="text-4xl md:text-5xl mb-4 text-[#1C5D15]">
              {title}
            </h2>
            <p className="text-xl text-[#629960] max-w-3xl mx-auto">
              {subtitle}
            </p>
          </div>
          
          <div className="text-center py-12">
            <p className="text-[#629960]">{t('products.no_featured_products')}</p>
          </div>
        </div>
      </section>
    );
  }
  
  // Limit to 3 featured products
  const displayedProducts = products.slice(0, 3);
  
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-[#19FF00] text-[#1C5D15] rounded-full mb-4">
            {t('products.catalog')}
          </div>
          <h2 className="text-4xl md:text-5xl mb-4 text-[#1C5D15]">
            {title}
          </h2>
          <p className="text-xl text-[#629960] max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {displayedProducts.map((product) => {
            const prices = productPrices[product.id] || [];
            const cheapestPrice = prices.length > 0 
              ? Math.min(...prices.map(price => price.price_per_unit)) 
              : null;
            
            return (
              <Link
                key={product.id}
                to={`/products/${product.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#629960]/20 hover:border-[#19FF00] group relative flex flex-col"
              >
                {product.featured && (
                  <div className="absolute top-4 right-4 z-10 bg-[#19FF00] text-[#1C5D15] px-3 py-1 rounded-full text-sm">
                    {t('products.most_popular')}
                  </div>
                )}
                
                {/* Product Image */}
                <div className="relative h-56 overflow-hidden bg-gradient-to-br from-[#1C5D15] to-[#629960]">
                  <img
                    src={product.image}
                    alt={product.translation.name}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Product Details */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-[#629960] text-sm mb-2">{(product as any).categoryName || product.category}</div>
                  <h3 className="text-2xl mb-3 text-[#1C5D15]">{product.translation.name}</h3>
                  
                  {/* Star Rating */}
                  <StarRating rating={5} />
                  
                  {/* Product Description */}
                  <p className="text-[#629960] mb-4 leading-relaxed line-clamp-3">
                    {product.translation.short_description || product.translation.description}
                  </p>

                  {/* Price */}
                  {cheapestPrice && (
                    <div className="mb-4">
                      <div className="text-lg font-bold text-[#1C5D15]">
                        {formatPrice(cheapestPrice, prices[0]?.currency || 'COP')}
                      </div>
                      <div className="text-sm text-[#629960]">
                        {t('price.per_unit')}
                      </div>
                    </div>
                  )}

                  {/* Features */}
                  {product.translation.features && product.translation.features.length > 0 && (
                    <ul className="space-y-2 mb-6">
                      {product.translation.features.slice(0, 2).map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="w-5 h-5 text-[#19FF00] flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-[#629960]">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <Button 
                      className="w-full bg-[#1C5D15] text-white hover:bg-[#1C5D15]/90 group-hover:bg-[#19FF00] group-hover:text-[#1C5D15] transition-colors"
                      asChild
                    >
                      <span>
                        {t('btn.view_details_prices')}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </span>
                    </Button>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Additional CTA */}
        <div className="text-center mt-12">
          <Button 
            size="lg"
            variant="outline"
            className="border-[#1C5D15] text-[#1C5D15] hover:bg-[#1C5D15] hover:text-white"
            asChild
          >
            <Link to="/store">
              {t('btn.view_full_catalog')}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
