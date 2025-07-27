import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Conflict = Database["public"]["Tables"]["schedule_conflicts"]["Row"];
type Schedule = Database["public"]["Tables"]["schedules"]["Row"];

interface ConflictWithSchedule extends Conflict {
  original_schedule?: Schedule;
  conflicting_schedule?: Schedule;
}

export function useScheduleConflicts() {
  const [conflicts, setConflicts] = useState<ConflictWithSchedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConflicts();
  }, []);

  const fetchConflicts = async () => {
    setLoading(true);

    const { data: conflictData, error } = await supabase
      .from("schedule_conflicts")
      .select("*");

    if (error || !conflictData) {
      setError(error?.message || "Failed to fetch conflicts");
      setConflicts([]);
      setLoading(false);
      return;
    }

    // Fetch all referenced schedules
    const scheduleIds = [
      ...new Set(
        conflictData.flatMap((c) => [c.schedule_id_1, c.schedule_id_2])
      ),
    ];

    const { data: schedules, error: scheduleError } = await supabase
      .from("schedules")
      .select("*")
      .in("id", scheduleIds);

    if (scheduleError || !schedules) {
      setError(scheduleError?.message || "Failed to fetch schedules");
      setConflicts([]);
      setLoading(false);
      return;
    }

    // Map schedules back to conflicts
    const scheduleMap = Object.fromEntries(
      schedules.map((s) => [s.id, s])
    );

    const enriched = conflictData.map((conflict) => ({
      ...conflict,
      original_schedule: scheduleMap[conflict.schedule_id_1],
      conflicting_schedule: scheduleMap[conflict.schedule_id_2],
    }));

    setConflicts(enriched);
    setLoading(false);
  };

  return {
    conflicts,
    loading,
    error,
    refetch: fetchConflicts,
  };
}
