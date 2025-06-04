
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DataConsistencyButtonProps {
  onFixComplete: () => void;
}

export const DataConsistencyButton: React.FC<DataConsistencyButtonProps> = ({ onFixComplete }) => {
  const [isFixing, setIsFixing] = useState(false);
  const { toast } = useToast();

  const handleFixDataConsistency = async () => {
    setIsFixing(true);
    
    try {
      console.log('Running data consistency fix...');
      
      // Call the database function to fix spots consistency
      const { error } = await supabase.rpc('recalculate_all_event_spots');
      
      if (error) {
        console.error('Error fixing data consistency:', error);
        throw error;
      }
      
      console.log('✅ Data consistency fix completed successfully');
      
      toast({
        title: "Data Consistency Fixed",
        description: "All event spots have been recalculated based on confirmed bookings.",
      });
      
      // Call the callback to refresh the parent component
      onFixComplete();
      
    } catch (error: any) {
      console.error('Error in data consistency fix:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fix data consistency",
        variant: "destructive"
      });
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <Button
      onClick={handleFixDataConsistency}
      disabled={isFixing}
      variant="outline"
      size="sm"
      className="text-amber-700 border-amber-300 hover:bg-amber-50"
    >
      {isFixing ? (
        <>
          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          Fixing...
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Fix Data Consistency
        </>
      )}
    </Button>
  );
};
