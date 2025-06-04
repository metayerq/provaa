
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  count: number;
}

interface FAQSidebarProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const FAQSidebar: React.FC<FAQSidebarProps> = ({
  categories,
  selectedCategory,
  onCategoryChange,
}) => {
  return (
    <div className="bg-white rounded-lg border p-6 sticky top-24">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "ghost"}
            className={`w-full justify-between text-left ${
              selectedCategory === category.id
                ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                : "hover:bg-gray-50"
            }`}
            onClick={() => onCategoryChange(category.id)}
          >
            <span className="truncate">{category.name}</span>
            <Badge 
              variant={selectedCategory === category.id ? "secondary" : "outline"}
              className={selectedCategory === category.id ? "bg-emerald-600 text-white" : ""}
            >
              {category.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};
