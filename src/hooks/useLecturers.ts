import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Lecturer {
  id: string;
  name: string;
  email: string;
  department_id: string;
  created_at?: string;
}


export function useLecturers(departmentFilter?: string) {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("lecturers")
        .select("*")
        .order("created_at");
      
      if (departmentFilter && departmentFilter !== "all") {
        query = query.eq("department_id", departmentFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Map the data to match our interface
      const mappedData = (data || []).map((lecturer: any) => ({
        id: lecturer.id,
        name: lecturer.name || lecturer.specialization || 'Unknown',
        email: lecturer.email || '',
        department_id: lecturer.department_id,
        created_at: lecturer.created_at
      }));
      
      setLecturers(mappedData);
    } catch (err) {
      console.error("Failed to fetch lecturers:", err);
      setError("Unable to load lecturers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, [departmentFilter]);

  const addLecturer = async (newLecturer: Omit<Lecturer, "id">) => {
    const lecturerData: any = {
      department_id: newLecturer.department_id,
      specialization: newLecturer.name,
      user_id: "placeholder" // This should be fixed when linking to auth users
    };
    
    // Only add name/email if they exist in the table
    if ((newLecturer as any).name) lecturerData.name = newLecturer.name;
    if ((newLecturer as any).email) lecturerData.email = newLecturer.email;
    
    const { error } = await supabase.from("lecturers").insert(lecturerData);
    if (error) throw error;
    await fetchLecturers();
  };

  const deleteLecturer = async (lecturerId: string) => {
    const { error } = await supabase.from("lecturers").delete().eq("id", lecturerId);
    if (error) throw error;
    await fetchLecturers();
  };

  return {
    lecturers,
    loading,
    error,
    addLecturer,
    deleteLecturer,
    refresh: fetchLecturers
  };
}
