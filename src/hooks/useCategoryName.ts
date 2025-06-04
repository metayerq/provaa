
import { useState, useEffect } from 'react';
import { resolveCategoryName } from '@/utils/categoryResolver';

export const useCategoryName = (categoryId: string) => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const resolveName = async () => {
      if (!categoryId || categoryId.trim() === '') {
        setCategoryName('');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        console.log('useCategoryName: Resolving category:', categoryId);
        const name = await resolveCategoryName(categoryId);
        console.log('useCategoryName: Resolved to:', name);
        setCategoryName(name);
      } catch (error) {
        console.error('useCategoryName: Error resolving category name:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
        setCategoryName(''); // Set to empty string on error
      } finally {
        setIsLoading(false);
      }
    };

    resolveName();
  }, [categoryId]);

  return { categoryName, isLoading, error };
};
