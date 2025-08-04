import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Lecturer {
  id: string;
  name: string;
  email: string;
  department_id: string;
  created_at?: string;
}


export function useLecturers() {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLecturers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("lecturers")
        .select("id, name, email, department_id")
        .order("created_at");

      if (error) throw error;
      setLecturers(data || []);
    } catch (err) {
      console.error("Failed to fetch lecturers:", err);
      setError("Unable to load lecturers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  const addLecturer = async (newLecturer: Omit<Lecturer, "id">) => {
    const { error } = await supabase.from("lecturers").insert(newLecturer);
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
