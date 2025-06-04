
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { expandedCategories, categoryGroups } from "@/utils/expandedCategories";
import { supabase } from "@/integrations/supabase/client";

interface CategoryFilterProps {
  selectedCategories: string[];
  onChange: (categories: string[]) => void;
}

interface CustomCategory {
  id: string;
  name: string;
  emoji: string;
}

const CategoryFilter = ({ selectedCategories, onChange }: CategoryFilterProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);

  // Fetch custom categories
  useEffect(() => {
    const fetchCustomCategories = async () => {
      const { data, error } = await supabase
        .from('custom_categories')
        .select('id, name, emoji')
        .eq('is_approved', true)
        .order('usage_count', { ascending: false })
        .limit(10);

      if (!error && data) {
        setCustomCategories(data.map(cat => ({
          id: `custom-${cat.id}`,
          name: cat.name,
          emoji: cat.emoji || '🍽️'
        })));
      }
    };

    fetchCustomCategories();
  }, []);

  const allCategories = [
    ...expandedCategories.map(cat => ({ id: cat.id, name: cat.label, emoji: cat.emoji })),
    ...customCategories
  ];

  const filteredCategories = allCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      onChange(selectedCategories.filter(id => id !== categoryId));
    } else {
      onChange([...selectedCategories, categoryId]);
    }
  };

  const selectedCount = selectedCategories.length;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-3">
        Experience Types {selectedCount > 0 && `(${selectedCount} selected)`}
      </h3>
      
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search categories..."
          className="pl-10 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
        {filteredCategories.map(category => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedCategories.includes(category.id)
                ? "bg-emerald-700 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <span className="text-sm">{category.emoji}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {filteredCategories.length === 0 && searchTerm && (
        <p className="text-sm text-gray-500 mt-2">No categories found matching "{searchTerm}"</p>
      )}

      {selectedCount > 0 && (
        <button
          onClick={() => onChange([])}
          className="text-sm text-emerald-600 hover:text-emerald-700 mt-3"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default CategoryFilter;
