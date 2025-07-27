import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Schedule = Database['public']['Tables']['schedules']['Row'];
type ScheduleInsert = Database['public']['Tables']['schedules']['Insert'];

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchSchedules();
  }, []);

  // const fetchSchedules = async () => {
  //   try {
  //     setLoading(true);
  //     const { data, error } = await supabase
  //       .from('schedules')
  //       .select(`
  //         *,
  //         departments (
  //           id,
  //           name,
  //           color
  //         ),
  //         lecturers (
  //           id,
  //           profiles (
  //             name
  //           )
  //         )
  //       `);

  //     if (error) throw error;
  //     setSchedules(data || []);
  //   } catch (err) {
  //     console.error('Error fetching schedules:', err);
  //     setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchSchedules = async () => {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from('schedules')
      .select(`
        *,
        departments (
          id,
          name,
          color
        ),
        lecturers (
          id,
          name,
          email
        )
      `);

    if (error) throw error;
    setSchedules(data || []);
  } catch (err) {
    console.error('Error fetching schedules:', err);
    setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
  } finally {
    setLoading(false);
  }
};


  const createSchedule = async (scheduleData: ScheduleInsert) => {
    try {
      // Convert day string to number
      const dayMap: Record<string, number> = {
        'Monday': 1,
        'Tuesday': 2,
        'Wednesday': 3,
        'Thursday': 4,
        'Friday': 5
      };

      // Convert time string to PostgreSQL time format and calculate end time
      const startTime = scheduleData.start_time || '00:00';
      const duration = scheduleData.duration || '1 hour';
      
      // Calculate end time based on start time and duration
      const startHour = parseInt(startTime.split(':')[0]);
      const startMinute = parseInt(startTime.split(':')[1]);
      const durationStr = String(duration);
      const durationHours = durationStr.includes('hour') ? parseFloat(durationStr.split(' ')[0]) : 1;
      
      const endHour = Math.floor(startHour + durationHours);
      const endMinute = startMinute + (durationHours % 1) * 60;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;

      const { data, error } = await supabase
        .from('schedules')
        .insert({
          ...scheduleData,
          // day_of_week: dayMap[scheduleData.day_of_week as unknown as string] || 1,
          day_of_week: scheduleData.day_of_week,
          start_time: startTime,
          end_time: endTime
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Schedule created",
        description: "New schedule has been added successfully."
      });

      await fetchSchedules(); // Refresh the list
      return data;
    } catch (err) {
      console.error('Error creating schedule:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create schedule';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      throw err;
    }
  };

  const updateSchedule = async (id: string, updates: Partial<ScheduleInsert>) => {
    try {
      const { error } = await supabase
        .from('schedules')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Schedule updated",
        description: "Schedule has been updated successfully."
      });

      await fetchSchedules(); 
    } catch (err) {
      console.error('Error updating schedule:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update schedule';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      console.log("Attempting to delete schedule with ID:", id);

      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Schedule deleted",
        description: "Schedule has been removed successfully."
      });

      await fetchSchedules(); 

    } catch (err) {
      console.error('Error deleting schedule:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete schedule';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  return {
    schedules,
    loading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    refetch: fetchSchedules
  };
}