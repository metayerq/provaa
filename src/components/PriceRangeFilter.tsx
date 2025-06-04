
import { useState } from "react";
import { Slider } from "@/components/ui/slider";

interface PriceRangeFilterProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}

const PriceRangeFilter = ({ min, max, value, onChange }: PriceRangeFilterProps) => {
  const handleChange = (newValue: number[]) => {
    onChange([newValue[0], newValue[1]] as [number, number]);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Price Range</h3>
        <div className="text-sm text-gray-600">
          ${value[0]} - ${value[1]}
        </div>
      </div>
      <Slider
        defaultValue={[min, max]}
        min={min}
        max={max}
        step={1}
        value={value}
        onValueChange={handleChange}
        className="my-4"
      />
    </div>
  );
};

export default PriceRangeFilter;
