import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Clock, MapPin, Users, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useSchedules } from "@/hooks/useSchedules";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QuickScheduleActions } from "./QuickScheduleActions";

interface Department {
  id: string;
  name: string;
  color: string;
}

interface Lecturer {
  id: string;
  name: string;
  department_id?: string;
}

interface TimetableEvent {
  id: string;
  title: string;
  lecturer: string;
  lecturerId: string;
  room: string;
  department: string;
  time: string;
  day: string;
  duration: number; // in hours
  students: number;
  capacity: number;
  type: "lecture" | "lab" | "tutorial" | "exam";
  conflict?: boolean;
}

interface TimetableGridProps {
  viewMode: "department" | "lecturer" | "room";
  selectedDepartment: string;
  selectedLecturer: string;
  departments: Department[];
  lecturers: Lecturer[];
  selectedRoom: string;
  schedules: any[];
  onUpdateEvent?: (eventId: string, updates: any) => void;
  onDeleteEvent?: (eventId: string) => void;
  onDuplicateEvent?: (event: TimetableEvent) => void;
}


const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function TimetableGrid({
  viewMode,
  selectedDepartment,
  selectedLecturer,
  departments,
  lecturers,
  schedules,
  onUpdateEvent,
  onDeleteEvent,
  onDuplicateEvent,
  selectedRoom
}: TimetableGridProps) {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const { toast } = useToast();
  const { refetch: refreshConflicts } = useSchedules();

  const convertedEvents = schedules.map(schedule => ({
    id: schedule.id,
    title: schedule.title,
    lecturer: schedule.lecturers?.name || 'Unknown',
    lecturerId: schedule.lecturer_id, 
    room: schedule.room,
    department: schedule.department_id,
    time: schedule.start_time?.slice(0, 5),
    day_of_week: schedule.day_of_week, 
    day: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][schedule.day_of_week - 1],
    duration: parseFloat(schedule.duration?.split(' ')[0] || '1'),
    students: schedule.student_count || 0,
    capacity: schedule.capacity,
    type: schedule.type,
    conflict: false
  }));


  const handleUpdateEvent = (eventId: string, updates: any) => {
    onUpdateEvent?.(eventId, updates);
    refreshConflicts()
  };

  const handleDeleteEvent = (eventId: string) => {
    onDeleteEvent?.(eventId);
    refreshConflicts()
  };

  const handleDuplicateEvent = (event: any) => {
    onDuplicateEvent?.(event);
    refreshConflicts()
  };


  const filteredEvents = convertedEvents.filter(event => {
    const departmentMatch = selectedDepartment === "all" || event.department === selectedDepartment;
    const lecturerMatch = selectedLecturer === "all" || event.lecturerId === selectedLecturer;
    const roomMatch = selectedRoom === "all" || event.room === selectedRoom;

    return departmentMatch && lecturerMatch && roomMatch;
  });


  const getEventsForSlot = (day: string, time: string) => {
  return filteredEvents.filter(event => 
    event.day === day && event.time === time
  );
};

  const getDepartmentColor = (departmentId: string) => {
    return departments.find(d => d.id === departmentId)?.color || "#6b7280";
  };

  const getTypeIcon = (type: TimetableEvent["type"]) => {
    switch (type) {
      case "lecture": return "📚";
      case "lab": return "🔬";
      case "tutorial": return "👥";
      case "exam": return "📝";
      default: return "📖";
    }
  };


  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-6 border-b">
          <div className="p-4 border-r bg-muted/20">
            <span className="font-medium">Time</span>
          </div>
          {weekDays.map((day) => (
            <div key={day} className="p-4 border-r bg-muted/20 text-center">
              <span className="font-medium">{day}</span>
            </div>
          ))}
        </div>

        {/* Time slots */}
        {timeSlots.map((time) => (
          <div key={time} className="grid grid-cols-6 border-b min-h-[80px]">
            <div className="p-4 border-r bg-muted/10 flex items-start">
              <span className="text-sm font-medium text-muted-foreground">{time}</span>
            </div>
            {weekDays.map((day) => {
              const slotEvents = getEventsForSlot(day, time);
              return (
                <div key={`${day}-${time}`} className="border-r p-2 relative space-y-2">
                  {slotEvents.map((event) => (
                    <Dialog key={event.id}>
                      <DialogTrigger asChild>
                        <Card
                          className={`
                            group p-3 cursor-pointer transition-all hover:shadow-md border-l-4
                            ${event.conflict ? 'border-destructive bg-destructive/10' : ''}
                          `}
                          style={{ borderLeftColor: getDepartmentColor(event.department) }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 text-xs">
                                <span>{getTypeIcon(event.type)}</span>
                                <Badge variant="outline" className="text-xs">
                                  {event.type}
                                </Badge>
                                {event.conflict && (
                                  <AlertTriangle className="h-3 w-3 text-destructive" />
                                )}
                              </div>
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <QuickScheduleActions
                                  event={event}
                                  onUpdate={handleUpdateEvent}
                                  onDelete={handleDeleteEvent}
                                  onDuplicate={handleDuplicateEvent}
                                />
                              </div>
                            </div>
                            <h4 className="font-medium text-sm leading-tight">{event.title}</h4>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              {event.room}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Users className="h-3 w-3" />
                              {event.students}/{event.capacity}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {event.duration}h
                            </div>
                          </div>
                        </Card>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{event.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <span className="text-sm font-medium">Lecturer:</span>
                              <p>{event.lecturer}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Room:</span>
                              <p>{event.room}</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Time:</span>
                              <p>{event.time} ({event.duration}h)</p>
                            </div>
                            <div>
                              <span className="text-sm font-medium">Enrollment:</span>
                              <p>{event.students} / {event.capacity} students</p>
                            </div>
                          </div>
                          {event.conflict && (
                            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
                              <div className="flex items-center gap-2 text-destructive">
                                <AlertTriangle className="h-4 w-4" />
                                <span className="font-medium">Schedule Conflict Detected</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                This class conflicts with another scheduled session.
                              </p>
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Button size="sm">Edit Schedule</Button>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              );
            })}

          </div>
        ))}
      </div>
    </div>
  );
}