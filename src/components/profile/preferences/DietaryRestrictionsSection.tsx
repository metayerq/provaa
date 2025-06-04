
import { useFormContext } from "react-hook-form";
import { Tag } from "./Tag";
import { dietaryRestrictions } from "./constants";
import { PreferencesFormValues } from "./types";

interface DietaryRestrictionsSectionProps {
  onToggleDietaryRestriction: (restrictionId: string) => void;
}

export function DietaryRestrictionsSection({ onToggleDietaryRestriction }: DietaryRestrictionsSectionProps) {
  const form = useFormContext<PreferencesFormValues>();
  const dietaryRestrictionsValues = form.watch('dietaryRestrictions');

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Dietary Restrictions</h3>
      <div className="flex flex-wrap gap-3">
        {dietaryRestrictions.map((restriction) => (
          <Tag
            key={restriction.id}
            id={restriction.id}
            label={restriction.label}
            emoji={restriction.emoji}
            isSelected={dietaryRestrictionsValues.includes(restriction.id)}
            onClick={() => onToggleDietaryRestriction(restriction.id)}
          />
        ))}
      </div>
    </div>
  );
}
