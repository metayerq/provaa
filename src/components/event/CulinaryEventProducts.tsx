
import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Product {
  id: string;
  name: string;
  image?: string;
}

interface CulinaryEventProductsProps {
  products: Product[];
}

export const CulinaryEventProducts: React.FC<CulinaryEventProductsProps> = ({ products }) => {
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

  if (!products || products.length === 0) {
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">What You'll Taste</h2>
        <Card>
          <CardContent className="p-6">
            <p className="text-gray-600 italic">Experience details coming soon...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-12" ref={productsRef}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">What You'll Taste</h2>
      
      <div className="space-y-4">
        {products.map((product, index) => (
          <Card 
            key={product.id} 
            className="product-item opacity-0 transform translate-y-4 transition-all duration-500 hover:shadow-lg border-0 shadow-sm"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-6">
              <div className="flex gap-6 items-start">
                {product.image && (
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={`${product.image}?auto=format&fit=crop&w=120&h=120`}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">🍷</span>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-900 font-serif leading-tight">
                        {product.name}
                      </h3>
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
