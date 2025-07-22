
import { useState, useEffect } from 'react';
import { Department } from '@/types/database';

// Mock data - will be replaced with Supabase queries
const mockDepartments: Department[] = [
  { 
    id: "cs", 
    name: "Computer Science", 
    color: "hsl(var(--primary))", 
    description: "Department of Computer Science",
    created_at: new Date().toISOString()
  },
  { 
    id: "math", 
    name: "Mathematics", 
    color: "hsl(142, 76%, 36%)", 
    description: "Department of Mathematics",
    created_at: new Date().toISOString()
  },
  { 
    id: "physics", 
    name: "Physics", 
    color: "hsl(262, 83%, 58%)", 
    description: "Department of Physics",
    created_at: new Date().toISOString()
  },
  { 
    id: "eng", 
    name: "Engineering", 
    color: "hsl(25, 95%, 53%)", 
    description: "Department of Engineering",
    created_at: new Date().toISOString()
  }
];

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // TODO: Replace with Supabase query
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setDepartments(mockDepartments);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch departments');
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  return { departments, loading, error };
}
