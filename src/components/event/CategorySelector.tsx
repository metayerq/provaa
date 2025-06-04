
import React, { useState, useEffect } from 'react';
import { Check, Search, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { expandedCategories, categoryGroups } from '@/utils/expandedCategories';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CustomCategory {
  id: string;
  name: string;
  emoji: string;
  description?: string;
}

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  selectedCategory,
  onCategorySelect
}) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [customCategories, setCustomCategories] = useState<CustomCategory[]>([]);
  const [isCreatingCustom, setIsCreatingCustom] = useState(false);
  const [openAccordionValue, setOpenAccordionValue] = useState('Wine & Spirits');

  // Fetch custom categories
  useEffect(() => {
    const fetchCustomCategories = async () => {
      const { data, error } = await supabase
        .from('custom_categories')
        .select('id, name, emoji, description')
        .eq('is_approved', true)
        .order('usage_count', { ascending: false });

      if (!error && data) {
        setCustomCategories(data.map(cat => ({
          id: `custom-${cat.id}`,
          name: cat.name,
          emoji: cat.emoji || '🍽️',
          description: cat.description || ''
        })));
      }
    };

    fetchCustomCategories();
  }, []);

  // Filter categories based on search
  const filteredCategories = expandedCategories.filter(category =>
    category.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomCategories = customCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group filtered categories
  const groupedCategories = categoryGroups.reduce((acc, group) => {
    const categoriesInGroup = filteredCategories.filter(cat => cat.group === group);
    if (categoriesInGroup.length > 0) {
      acc[group] = categoriesInGroup;
    }
    return acc;
  }, {} as Record<string, typeof expandedCategories>);

  const handleCreateCustomCategory = async () => {
    if (!customCategoryName.trim() || !user) return;

    setIsCreatingCustom(true);
    try {
      const { data, error } = await supabase
        .from('custom_categories')
        .insert({
          name: customCategoryName.trim(),
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      const newCustomCategory = {
        id: `custom-${data.id}`,
        name: data.name,
        emoji: data.emoji || '🍽️',
        description: data.description || ''
      };

      setCustomCategories(prev => [newCustomCategory, ...prev]);
      onCategorySelect(newCustomCategory.id);
      setCustomCategoryName('');
      setShowCustomInput(false);
    } catch (error) {
      console.error('Error creating custom category:', error);
    } finally {
      setIsCreatingCustom(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Search experience types..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Custom categories if any */}
      {filteredCustomCategories.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-700">Custom Categories</h4>
          <div className="flex flex-wrap gap-2">
            {filteredCustomCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors border-2 ${
                  selectedCategory === category.id
                    ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => onCategorySelect(category.id)}
              >
                <span className="text-base">{category.emoji}</span>
                <span>{category.name}</span>
                {selectedCategory === category.id && (
                  <Check className="h-3 w-3 text-emerald-700" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Accordion for grouped categories */}
      <Accordion 
        type="single" 
        collapsible 
        value={openAccordionValue} 
        onValueChange={setOpenAccordionValue}
        className="w-full"
      >
        {Object.entries(groupedCategories).map(([group, categories]) => (
          <AccordionItem key={group} value={group} className="border-b border-gray-200">
            <AccordionTrigger className="hover:no-underline py-4">
              <span className="text-sm font-semibold text-gray-700">{group}</span>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-colors border-2 ${
                      selectedCategory === category.id
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => onCategorySelect(category.id)}
                    title={category.description}
                  >
                    <span className="text-base">{category.emoji}</span>
                    <span>{category.label}</span>
                    {selectedCategory === category.id && (
                      <Check className="h-3 w-3 text-emerald-700" />
                    )}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Custom category creation - Always visible */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <h4 className="text-sm font-semibold text-gray-700">Create Custom Category</h4>
        {!showCustomInput ? (
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowCustomInput(true)}
            className="inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Custom Category
          </Button>
        ) : (
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your custom category name..."
              value={customCategoryName}
              onChange={(e) => setCustomCategoryName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateCustomCategory()}
            />
            <Button
              type="button"
              onClick={handleCreateCustomCategory}
              disabled={!customCategoryName.trim() || isCreatingCustom}
            >
              {isCreatingCustom ? 'Creating...' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowCustomInput(false);
                setCustomCategoryName('');
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* No results message */}
      {searchTerm && Object.keys(groupedCategories).length === 0 && filteredCustomCategories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No categories found matching "{searchTerm}"</p>
          <p className="text-sm mt-1">Try creating a custom category instead!</p>
        </div>
      )}
    </div>
  );
};
