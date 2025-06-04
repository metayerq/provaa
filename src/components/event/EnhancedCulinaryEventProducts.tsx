
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  image?: string;
  producer?: string;
  year?: string;
  type?: string;
}

interface EnhancedCulinaryEventProductsProps {
  products: Product[];
}

export const EnhancedCulinaryEventProducts: React.FC<EnhancedCulinaryEventProductsProps> = ({ 
  products
}) => {
  const productsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const items = productsRef.current?.querySelectorAll('.product-item');
          items?.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add('visible');
            }, index * 100);
          });
        }
      },
      {
        threshold: 0.1,
      }
    );

    if (productsRef.current) {
      observer.observe(productsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Return null if no products exist - this will prevent the section from rendering
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="mb-8" ref={productsRef}>
      <h2 className="text-xl font-bold text-gray-900 mb-4 font-serif">What You'll Taste</h2>
      
      <div className="space-y-3">
        {products.map((product, index) => (
          <Card 
            key={product.id} 
            className="product-item opacity-0 transform translate-y-4 transition-all duration-500 hover:shadow-md border-0 shadow-sm"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4">
              <div className="flex gap-4 items-start">
                {product.image && (
                  <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={`${product.image}?auto=format&fit=crop&w=100&h=100`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-lg">🍷</span>
                    <div>
                      <h3 className="font-semibold text-gray-900 font-serif leading-tight">
                        {product.name}
                      </h3>
                      {(product.producer || product.year || product.type) && (
                        <div className="flex gap-2 text-sm text-gray-500 mt-1">
                          {product.producer && <span>{product.producer}</span>}
                          {product.year && <span>• {product.year}</span>}
                          {product.type && <span>• {product.type}</span>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
