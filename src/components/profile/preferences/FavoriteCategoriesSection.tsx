
import { useFormContext } from "react-hook-form";
import { Tag } from "./Tag";
import { foodCategories } from "./constants";
import { PreferencesFormValues } from "./types";

interface FavoriteCategoriesSectionProps {
  onToggleCategory: (categoryId: string) => void;
}

export function FavoriteCategoriesSection({ onToggleCategory }: FavoriteCategoriesSectionProps) {
  const form = useFormContext<PreferencesFormValues>();
  const favoriteCategories = form.watch('favoriteCategories');

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Favorite Categories</h3>
      <div className="flex flex-wrap gap-3">
        {foodCategories.map((category) => (
          <Tag
            key={category.id}
            id={category.id}
            label={category.label}
            emoji={category.emoji}
            isSelected={favoriteCategories.includes(category.id)}
            onClick={() => onToggleCategory(category.id)}
          />
        ))}
      </div>
    </div>
  );
}
