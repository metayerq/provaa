
import React, { useRef, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  image?: string;
}

interface EventProductsProps {
  products: Product[];
}

export const EventProducts: React.FC<EventProductsProps> = ({ products }) => {
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

  return (
    <div className="mb-12" ref={productsRef}>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">What You'll Experience</h2>
      <div className="space-y-6">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="product-item flex gap-5 p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 opacity-0 transform translate-y-4"
            style={{ transitionDelay: `${index * 0.1}s` }}
          >
            {product.image && (
              <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                <img
                  src={`${product.image}?auto=format&fit=crop&w=120&h=120`}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
