import { AlertTriangle, Clock, Users, MapPin } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ConflictDetails {
  type: "lecturer" | "room" | "capacity" | "overlap";
  severity: "high" | "medium" | "low";
  description: string;
  affectedSchedules: Array<{
    id: string;
    title: string;
    time: string;
    room: string;
    lecturer: string;
  }>;
  suggestions: string[];
}

interface ScheduleConflictCheckerProps {
  conflicts: ConflictDetails[];
  onResolveConflict?: (conflictId: string, resolution: string) => void;
}

const conflictIcons = {
  lecturer: Users,
  room: MapPin,
  capacity: Users,
  overlap: Clock
};

const severityColors = {
  high: "border-destructive bg-destructive/10 text-destructive",
  medium: "border-orange-500 bg-orange-50 text-orange-700",
  low: "border-yellow-500 bg-yellow-50 text-yellow-700"
};

export function ScheduleConflictChecker({ conflicts, onResolveConflict }: ScheduleConflictCheckerProps) {
  if (conflicts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <h3 className="font-medium">Schedule Conflicts Detected</h3>
        <Badge variant="destructive">{conflicts.length}</Badge>
      </div>

      <div className="space-y-3">
        {conflicts.map((conflict, index) => {
          const IconComponent = conflictIcons[conflict.type];
          
          return (
            <Alert key={index} className={severityColors[conflict.severity]}>
              <IconComponent className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">{conflict.description}</p>
                  </div>

                  {/* Affected Schedules */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Affected Schedules:</p>
                    <div className="space-y-1">
                      {conflict.affectedSchedules.map((schedule) => (
                        <div key={schedule.id} className="bg-background/50 p-2 rounded border">
                          <p className="font-medium text-sm">{schedule.title}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                            <span>📅 {schedule.time}</span>
                            <span>📍 {schedule.room}</span>
                            <span>👨‍🏫 {schedule.lecturer}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Suggested Solutions:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {conflict.suggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Resolution Actions */}
                  <div className="flex gap-2 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Conflict Resolution</DialogTitle>
                          <DialogDescription>
                            Review the conflict details and choose a resolution method.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Conflict Type: {conflict.type}</h4>
                            <p className="text-sm text-muted-foreground">{conflict.description}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium">Resolution Options:</h4>
                            <div className="space-y-2">
                              {conflict.suggestions.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="w-full justify-start"
                                  onClick={() => onResolveConflict?.(conflict.affectedSchedules[0].id, suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm" 
                      onClick={() => onResolveConflict?.(conflict.affectedSchedules[0].id, "auto")}
                    >
                      Auto-Resolve
                    </Button>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          );
        })}
      </div>
    </div>
  );
}

// Mock conflict data for demonstration
export const mockConflicts: ConflictDetails[] = [
  {
    type: "lecturer",
    severity: "high",
    description: "Dr. Sarah Johnson is double-booked for Monday 10:00 AM",
    affectedSchedules: [
      {
        id: "1",
        title: "Data Structures & Algorithms",
        time: "Monday 10:00-12:00",
        room: "CS-101",
        lecturer: "Dr. Sarah Johnson"
      },
      {
        id: "4",
        title: "Software Engineering",
        time: "Monday 10:00-12:00",
        room: "CS-102",
        lecturer: "Dr. Sarah Johnson"
      }
    ],
    suggestions: [
      "Move Software Engineering to Tuesday 10:00 AM",
      "Reschedule Data Structures to Monday 2:00 PM",
      "Assign a different lecturer to one of the courses"
    ]
  },
  {
    type: "room",
    severity: "medium",
    description: "Room CS-101 is over-booked on Wednesday",
    affectedSchedules: [
      {
        id: "2",
        title: "Database Systems",
        time: "Wednesday 14:00-16:00",
        room: "CS-101",
        lecturer: "Dr. Mike Brown"
      }
    ],
    suggestions: [
      "Move to CS-102 (available)",
      "Use larger lecture hall LH-A",
      "Split into two smaller sessions"
    ]
  },
  {
    type: "capacity",
    severity: "low",
    description: "Expected attendance exceeds room capacity in PHY-LAB1",
    affectedSchedules: [
      {
        id: "3",
        title: "Physics Lab",
        time: "Wednesday 14:00-17:00",
        room: "PHY-LAB1",
        lecturer: "Dr. Emily Davis"
      }
    ],
    suggestions: [
      "Split lab into two sessions",
      "Use PHY-LAB2 with higher capacity",
      "Limit enrollment to room capacity"
    ]
  }
];