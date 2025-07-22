
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'lecturer' | 'student';
          department_id: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'lecturer' | 'student';
          department_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'lecturer' | 'student';
          department_id?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      departments: {
        Row: {
          id: string;
          name: string;
          color: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      lecturers: {
        Row: {
          id: string;
          user_id: string;
          department_id: string;
          specialization: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          department_id: string;
          specialization?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          department_id?: string;
          specialization?: string | null;
          created_at?: string;
        };
      };
      schedules: {
        Row: {
          id: string;
          title: string;
          lecturer_id: string;
          room: string;
          department_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          duration: string;
          student_count: number;
          capacity: number;
          type: 'lecture' | 'lab' | 'tutorial' | 'exam';
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          lecturer_id: string;
          room: string;
          department_id: string;
          day_of_week: number;
          start_time: string;
          end_time: string;
          duration: string;
          student_count?: number;
          capacity: number;
          type: 'lecture' | 'lab' | 'tutorial' | 'exam';
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          lecturer_id?: string;
          room?: string;
          department_id?: string;
          day_of_week?: number;
          start_time?: string;
          end_time?: string;
          duration?: string;
          student_count?: number;
          capacity?: number;
          type?: 'lecture' | 'lab' | 'tutorial' | 'exam';
          created_at?: string;
        };
      };
      schedule_conflicts: {
        Row: {
          id: string;
          schedule_id_1: string;
          schedule_id_2: string;
          conflict_type: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          resolved: boolean;
          resolution_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          schedule_id_1: string;
          schedule_id_2: string;
          conflict_type: string;
          severity: 'low' | 'medium' | 'high' | 'critical';
          resolved?: boolean;
          resolution_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          schedule_id_1?: string;
          schedule_id_2?: string;
          conflict_type?: string;
          severity?: 'low' | 'medium' | 'high' | 'critical';
          resolved?: boolean;
          resolution_notes?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Department = Database['public']['Tables']['departments']['Row'];
export type Lecturer = Database['public']['Tables']['lecturers']['Row'];
export type Schedule = Database['public']['Tables']['schedules']['Row'];
export type ScheduleConflict = Database['public']['Tables']['schedule_conflicts']['Row'];
