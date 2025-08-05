import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Lecturer {
  id: string;
  name: string | null;
  email: string | null;
  department_id: string;
  specialization?: string | null;
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
        .select("id, name, email, department_id, specialization, created_at")
        .order("created_at");

      if (departmentFilter && departmentFilter !== "all") {
        query = query.eq("department_id", departmentFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      // Transform the data to ensure we have proper types
      const transformedData = (data || []).map((lecturer: any) => ({
        id: lecturer.id,
        name: lecturer.name || "",
        email: lecturer.email || "",
        department_id: lecturer.department_id,
        specialization: lecturer.specialization,
        created_at: lecturer.created_at
      }));
      setLecturers(transformedData);
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

  const addLecturer = async (newLecturer: { name: string; email: string; department_id: string; specialization?: string }) => {
    try {
      const { error } = await supabase.from("lecturers").insert([{
        name: newLecturer.name,
        email: newLecturer.email,
        department_id: newLecturer.department_id,
        specialization: newLecturer.specialization || null
      } as any]);
      if (error) throw error;
      await fetchLecturers();
    } catch (err) {
      console.error("Failed to add lecturer:", err);
      throw err;
    }
  };

  const deleteLecturer = async (lecturerId: string) => {
    try {
      const { error } = await supabase.from("lecturers").delete().eq("id", lecturerId);
      if (error) throw error;
      await fetchLecturers();
    } catch (err) {
      console.error("Failed to delete lecturer:", err);
      throw err;
    }
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