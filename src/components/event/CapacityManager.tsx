import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Minus, AlertTriangle, CheckCircle } from 'lucide-react';

interface CapacityManagerProps {
  currentCapacity: number;
  bookedSpots: number;
  onCapacityChange: (newCapacity: number) => Promise<void>;
  eventId?: string;
  isUpdating?: boolean;
}

const CapacityManager: React.FC<CapacityManagerProps> = ({
  currentCapacity,
  bookedSpots,
  onCapacityChange,
  eventId,
  isUpdating = false
}) => {
  const [tempCapacity, setTempCapacity] = useState(currentCapacity);
  const [lastUpdateSuccess, setLastUpdateSuccess] = useState(false);
  
  const availableSpots = Math.max(0, currentCapacity - bookedSpots);
  const minCapacity = Math.max(1, bookedSpots);
  const maxCapacity = 500;
  const tempAvailableSpots = Math.max(0, tempCapacity - bookedSpots);

  useEffect(() => {
    if (!isUpdating && tempCapacity !== currentCapacity) {
      console.log('🔄 Syncing tempCapacity with prop changes', {
        oldTemp: tempCapacity,
        newCurrent: currentCapacity,
        isUpdating
      });
      setTempCapacity(currentCapacity);
      setLastUpdateSuccess(false);
    }
  }, [currentCapacity, isUpdating]);

  const handleCapacityChange = async (newCapacity: number) => {
    if (newCapacity < minCapacity) {
      console.log(`Cannot reduce capacity below ${minCapacity}`);
      return;
    }
    
    if (newCapacity > maxCapacity) {
      console.log(`Cannot increase capacity above ${maxCapacity}`);
      return;
    }

    console.log(`🔄 Updating capacity from ${currentCapacity} to ${newCapacity}`);
    setTempCapacity(newCapacity);
    setLastUpdateSuccess(false);
    
    try {
      await onCapacityChange(newCapacity);
      console.log(`✅ Capacity updated successfully to ${newCapacity}`);
      setLastUpdateSuccess(true);
    } catch (error) {
      console.error('❌ Failed to update capacity:', error);
      setTempCapacity(currentCapacity);
    }
  };

  const incrementCapacity = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (tempCapacity < maxCapacity && !isUpdating) {
      handleCapacityChange(tempCapacity + 1);
    }
  }, [tempCapacity, maxCapacity, isUpdating, handleCapacityChange]);

  const decrementCapacity = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (tempCapacity > minCapacity && !isUpdating) {
      handleCapacityChange(tempCapacity - 1);
    }
  }, [tempCapacity, minCapacity, isUpdating, handleCapacityChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= minCapacity && value <= maxCapacity) {
      setTempCapacity(value);
    }
  };

  const handleInputBlur = () => {
    if (tempCapacity !== currentCapacity && tempCapacity >= minCapacity && tempCapacity <= maxCapacity) {
      handleCapacityChange(tempCapacity);
    } else {
      setTempCapacity(currentCapacity);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      incrementCapacity(e);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      decrementCapacity(e);
    }
  };

  const canDecrease = tempCapacity > minCapacity && !isUpdating;
  const canIncrease = tempCapacity < maxCapacity && !isUpdating;

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-medium">Capacity Management</Label>
        <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{currentCapacity}</div>
              <div className="text-sm text-gray-500">Total Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-700">{bookedSpots}</div>
              <div className="text-sm text-gray-500">Confirmed Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{availableSpots}</div>
              <div className="text-sm text-gray-500">Available</div>
            </div>
          </div>

          {tempCapacity !== currentCapacity && !isUpdating && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-blue-800 font-medium mb-2">Preview of Changes:</div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-blue-900">{tempCapacity}</div>
                  <div className="text-xs text-blue-700">New Capacity</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-emerald-700">{bookedSpots}</div>
                  <div className="text-xs text-blue-700">Confirmed</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">{tempAvailableSpots}</div>
                  <div className="text-xs text-blue-700">Available</div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={decrementCapacity}
              disabled={!canDecrease}
              className={`${!canDecrease ? 'opacity-50' : 'hover:bg-red-50'}`}
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Label htmlFor="capacity">Capacity:</Label>
              <Input
                id="capacity"
                type="number"
                value={tempCapacity}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                min={minCapacity}
                max={maxCapacity}
                className="w-20 text-center"
                disabled={isUpdating}
                aria-describedby="capacity-bounds"
              />
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={incrementCapacity}
              disabled={!canIncrease}
              className={`${!canIncrease ? 'opacity-50' : 'hover:bg-green-50'}`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div id="capacity-bounds" className="mt-2 text-xs text-gray-500 text-center">
            Range: {minCapacity} - {maxCapacity}
          </div>

          {lastUpdateSuccess && !isUpdating && (
            <Alert className="mt-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Capacity successfully updated to {currentCapacity}
              </AlertDescription>
            </Alert>
          )}

          {bookedSpots > 0 && (
            <Alert className="mt-4 border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                You cannot reduce capacity below {bookedSpots} (current confirmed bookings)
              </AlertDescription>
            </Alert>
          )}

          {isUpdating && (
            <Alert className="mt-4 border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-800 flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Updating capacity...
              </AlertDescription>
            </Alert>
          )}

          {tempCapacity >= maxCapacity - 10 && (
            <Alert className="mt-4 border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                Approaching maximum capacity limit of {maxCapacity}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default CapacityManager;
