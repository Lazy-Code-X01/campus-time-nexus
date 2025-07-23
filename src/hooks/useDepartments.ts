
import { useState, useEffect } from 'react';
import { Department } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error: supabaseError } = await supabase
          .from('departments')
          .select('*')
          .order('name');

        if (supabaseError) {
          throw supabaseError;
        }

        setDepartments(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch departments');
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading, error };
}
