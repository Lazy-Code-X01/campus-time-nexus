import { useState } from "react";
import { Clock, MapPin, Users, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Department {
  id: string;
  name: string;
  color: string;
}

interface Lecturer {
  id: string;
  name: string;
  department: string;
}

interface TimetableEvent {
  id: string;
  title: string;
  lecturer: string;
  room: string;
  department: string;
  time: string;
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
}

// Mock timetable data
const mockEvents: TimetableEvent[] = [
  {
    id: "1",
    title: "Data Structures & Algorithms",
    lecturer: "Dr. Sarah Johnson",
    room: "CS-101",
    department: "cs",
    time: "09:00",
    duration: 2,
    students: 85,
    capacity: 100,
    type: "lecture"
  },
  {
    id: "2",
    title: "Calculus II",
    lecturer: "Prof. Michael Chen",
    room: "MATH-205",
    department: "math",
    time: "11:00",
    duration: 1.5,
    students: 65,
    capacity: 80,
    type: "lecture"
  },
  {
    id: "3",
    title: "Physics Lab",
    lecturer: "Dr. Emily Davis",
    room: "PHY-LAB1",
    department: "physics",
    time: "14:00",
    duration: 3,
    students: 24,
    capacity: 25,
    type: "lab"
  },
  {
    id: "4",
    title: "Software Engineering",
    lecturer: "Dr. Sarah Johnson",
    room: "CS-102",
    department: "cs",
    time: "10:00",
    duration: 2,
    students: 72,
    capacity: 80,
    type: "lecture",
    conflict: true
  },
  {
    id: "5",
    title: "Engineering Design",
    lecturer: "Prof. James Wilson",
    room: "ENG-401",
    department: "eng",
    time: "13:00",
    duration: 2,
    students: 45,
    capacity: 50,
    type: "tutorial"
  }
];

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
  lecturers
}: TimetableGridProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimetableEvent | null>(null);

  // Filter events based on current filters
  const filteredEvents = mockEvents.filter(event => {
    if (viewMode === "department" && selectedDepartment !== "all") {
      return event.department === selectedDepartment;
    }
    if (viewMode === "lecturer" && selectedLecturer !== "all") {
      const lecturer = lecturers.find(l => l.id === selectedLecturer);
      return event.lecturer === lecturer?.name;
    }
    return true;
  });

  const getEventForSlot = (day: string, time: string) => {
    // For demo purposes, we'll randomly place events
    // In a real app, this would be based on actual scheduling data
    const dayIndex = weekDays.indexOf(day);
    const timeIndex = timeSlots.indexOf(time);
    
    if (dayIndex === 0 && timeIndex === 1) return filteredEvents[0]; // Monday 09:00
    if (dayIndex === 1 && timeIndex === 3) return filteredEvents[1]; // Tuesday 11:00
    if (dayIndex === 2 && timeIndex === 6) return filteredEvents[2]; // Wednesday 14:00
    if (dayIndex === 0 && timeIndex === 2) return filteredEvents[3]; // Monday 10:00 (conflict)
    if (dayIndex === 4 && timeIndex === 5) return filteredEvents[4]; // Friday 13:00
    
    return null;
  };

  const getDepartmentColor = (departmentId: string) => {
    return departments.find(d => d.id === departmentId)?.color || "bg-gray-500";
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
              const event = getEventForSlot(day, time);
              return (
                <div key={`${day}-${time}`} className="border-r p-2 relative">
                  {event && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card 
                          className={`
                            p-3 cursor-pointer transition-all hover:shadow-md
                            ${event.conflict ? 'border-destructive bg-destructive/10' : ''}
                            ${getDepartmentColor(event.department).replace('bg-', 'border-l-4 border-l-')}
                          `}
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-xs">
                              <span>{getTypeIcon(event.type)}</span>
                              <Badge variant="outline" className="text-xs">
                                {event.type}
                              </Badge>
                              {event.conflict && (
                                <AlertTriangle className="h-3 w-3 text-destructive" />
                              )}
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
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}