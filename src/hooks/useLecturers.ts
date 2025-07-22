
import { useState, useEffect } from 'react';
import { Lecturer } from '@/types/database';

// Mock data with expanded lecturer information
interface LecturerWithDetails extends Lecturer {
  name: string;
  email: string;
  department_name: string;
}

const mockLecturers: LecturerWithDetails[] = [
  { 
    id: "1", 
    user_id: "user-1",
    name: "Dr. Sarah Johnson", 
    email: "sarah.johnson@university.edu",
    department_id: "cs",
    department_name: "Computer Science",
    specialization: "Data Structures & Algorithms",
    created_at: new Date().toISOString()
  },
  { 
    id: "2", 
    user_id: "user-2",
    name: "Prof. Michael Chen", 
    email: "michael.chen@university.edu",
    department_id: "math",
    department_name: "Mathematics",
    specialization: "Calculus & Linear Algebra",
    created_at: new Date().toISOString()
  },
  { 
    id: "3", 
    user_id: "user-3",
    name: "Dr. Emily Davis", 
    email: "emily.davis@university.edu",
    department_id: "physics",
    department_name: "Physics",
    specialization: "Experimental Physics",
    created_at: new Date().toISOString()
  },
  { 
    id: "4", 
    user_id: "user-4",
    name: "Prof. James Wilson", 
    email: "james.wilson@university.edu",
    department_id: "eng",
    department_name: "Engineering",
    specialization: "Mechanical Engineering",
    created_at: new Date().toISOString()
  }
];

export function useLecturers(departmentId?: string) {
  const [lecturers, setLecturers] = useState<LecturerWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with Supabase query
    const fetchLecturers = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filteredLecturers = mockLecturers;
        if (departmentId && departmentId !== 'all') {
          filteredLecturers = mockLecturers.filter(l => l.department_id === departmentId);
        }
        
        setLecturers(filteredLecturers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch lecturers');
      } finally {
        setLoading(false);
      }
    };

    fetchLecturers();
  }, [departmentId]);

  return { lecturers, loading, error };
}

export type { LecturerWithDetails };
