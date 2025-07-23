
import { useState, useEffect } from 'react';
import { Lecturer } from '@/types/database';
import { supabase } from '@/integrations/supabase/client';

// Lecturer with details from joined tables
interface LecturerWithDetails extends Lecturer {
  name: string;
  email: string;
  department_name: string;
}

export function useLecturers(departmentId?: string) {
  const [lecturers, setLecturers] = useState<LecturerWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let query = supabase
          .from('lecturers')
          .select(`
            *,
            profiles:user_id (
              name,
              email
            ),
            departments:department_id (
              name
            )
          `);

        if (departmentId && departmentId !== 'all') {
          query = query.eq('department_id', departmentId);
        }

        const { data, error: supabaseError } = await query.order('created_at');

        if (supabaseError) {
          throw supabaseError;
        }

        // Transform the data to match our expected interface
        const transformedLecturers: LecturerWithDetails[] = (data || []).map((lecturer) => ({
          ...lecturer,
          name: lecturer.profiles?.name || 'Unknown',
          email: lecturer.profiles?.email || '',
          department_name: lecturer.departments?.name || 'Unknown Department'
        }));

        setLecturers(transformedLecturers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lecturers');
        console.error('Error fetching lecturers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, [departmentId]);

  return { lecturers, loading, error };
}

export type { LecturerWithDetails };
