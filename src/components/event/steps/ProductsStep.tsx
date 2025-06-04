
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { EventForm, ProductForm } from '../form/types';

interface ProductsStepProps {
  formData: EventForm;
  setFormData: React.Dispatch<React.SetStateAction<EventForm>>;
  isEditing?: boolean;
}

const ProductsStep: React.FC<ProductsStepProps> = ({ 
  formData, 
  setFormData 
}) => {
  const addProduct = () => {
    const newProduct: ProductForm = {
      name: '',
      producer: '',
      year: '',
      type: ''
    };
    setFormData(prev => ({ 
      ...prev, 
      products: [...prev.products, newProduct] 
    }));
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
  };

  const updateProduct = (index: number, field: keyof ProductForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.map((product, i) => 
        i === index ? { ...product, [field]: value } : product
      )
    }));
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What Will You Experience?</h2>
        <p className="text-gray-600">
          Add details about what participants will taste, learn, or experience during your event. 
          This section is optional - some experiences focus on learning techniques rather than tasting specific products.
        </p>
      </div>

      <div className="space-y-4">
        {formData.products.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">No products added yet</p>
            <p className="text-sm text-gray-400 mb-4">
              Add products for tasting experiences, or skip this section for workshop-focused events
            </p>
            <Button onClick={addProduct} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          </div>
        ) : (
          formData.products.map((product, index) => (
            <div key={index} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Product {index + 1}</h4>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProduct(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`product-name-${index}`}>Product Name*</Label>
                  <Input
                    id={`product-name-${index}`}
                    value={product.name}
                    onChange={(e) => updateProduct(index, 'name', e.target.value)}
                    placeholder="e.g., Aged Cheddar, Colombian Coffee"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`product-producer-${index}`}>Producer/Brand*</Label>
                  <Input
                    id={`product-producer-${index}`}
                    value={product.producer}
                    onChange={(e) => updateProduct(index, 'producer', e.target.value)}
                    placeholder="e.g., Local Farm, Roastery Name"
                  />
                </div>

                <div>
                  <Label htmlFor={`product-year-${index}`}>Year/Vintage</Label>
                  <Input
                    id={`product-year-${index}`}
                    value={product.year}
                    onChange={(e) => updateProduct(index, 'year', e.target.value)}
                    placeholder="e.g., 2020"
                  />
                </div>

                <div>
                  <Label htmlFor={`product-type-${index}`}>Type/Category</Label>
                  <Input
                    id={`product-type-${index}`}
                    value={product.type}
                    onChange={(e) => updateProduct(index, 'type', e.target.value)}
                    placeholder="e.g., Red Wine, Single Origin"
                  />
                </div>
              </div>
            </div>
          ))
        )}

        {formData.products.length > 0 && (
          <Button onClick={addProduct} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Another Product
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProductsStep;
