import { useState } from "react";
import { 
  Copy, 
  Move, 
  Trash2, 
  Edit3, 
  MoreHorizontal,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface TimetableEvent {
  id: string;
  title: string;
  lecturer: string;
  room: string;
  department: string;
  time: string;
  duration: number;
  day: string;
  type: "lecture" | "lab" | "tutorial" | "exam";
}

interface QuickScheduleActionsProps {
  event: TimetableEvent;
  onUpdate: (eventId: string, updates: Partial<TimetableEvent>) => void;
  onDelete: (eventId: string) => void;
  onDuplicate: (event: TimetableEvent) => void;
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
];

const mockRooms = [
  { id: "A101", name: "Lecture Hall A101", capacity: 120 },
  { id: "B205", name: "Seminar Room B205", capacity: 30 },
  { id: "C301", name: "Computer Lab C301", capacity: 40 },
  { id: "D105", name: "Physics Lab D105", capacity: 25 }
];

type ActionType = "move" | "edit" | "delete" | null;

export function QuickScheduleActions({ 
  event, 
  onUpdate, 
  onDelete, 
  onDuplicate 
}: QuickScheduleActionsProps) {
  const [actionType, setActionType] = useState<ActionType>(null);
  const [moveData, setMoveData] = useState({
    day: event.day,
    time: event.time,
    room: event.room
  });

  const [editData, setEditData] = useState({
    title: event.title,
    // keeping it simple for mvp for now
    // duration: event.duration,
    // lecturer_id: event.lecturer
    room: event.room
  });
  
  const { toast } = useToast();

    const handleMove = () => {
      const dayMap: Record<string, number> = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
      };

      const updates = {
        day_of_week: dayMap[moveData.day],
        start_time: moveData.time,
        room: moveData.room,
      };

      onUpdate(event.id, updates);
      setActionType(null);

      toast({
        title: "Schedule moved",
        description: `${event.title} has been moved to ${moveData.day} at ${moveData.time}`,
      });
    };


  const handleEdit = () => {
    onUpdate(event.id, editData);
    setActionType(null);
    toast({
      title: "Schedule updated",
      description: `${event.title} has been updated successfully`,
    });
  };

  const handleDelete = () => {
    onDelete(event.id);
    setActionType(null);
    toast({
      title: "Schedule deleted",
      description: `${event.title} has been removed from the timetable`,
      variant: "destructive",
    });
  };

  const handleDuplicate = () => {
    const duplicatedEvent = {
      ...event,
      id: `${event.id}-copy-${Date.now()}`,
      title: `${event.title} (Copy)`
    };
    onDuplicate(duplicatedEvent);
    toast({
      title: "Schedule duplicated",
      description: `A copy of ${event.title} has been created`,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()} >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            setActionType("edit");
          }}>
            <Edit3 className="mr-2 h-4 w-4" />
            Edit Details
          </DropdownMenuItem>

          <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            setActionType("move");
          }}>
            <Move className="mr-2 h-4 w-4" />
            Move Schedule
          </DropdownMenuItem>
            {/* removing this for now since we are focusing on mvp based */}
          {/* <DropdownMenuItem onClick={(e) => {
            e.stopPropagation();
            handleDuplicate();
          }}>
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </DropdownMenuItem> */}

          <DropdownMenuSeparator />

          <DropdownMenuItem 
            onClick={(e) => {
              e.stopPropagation();
              setActionType("delete");
            }}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>

      </DropdownMenu>

      {/* Move Dialog */}
      <Dialog open={actionType === "move"} onOpenChange={() => setActionType(null)}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Move Schedule</DialogTitle>
            <DialogDescription>
              Change the day, time, or room for "{event.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Day</Label>
                <Select value={moveData.day} onValueChange={(value) => 
                  setMoveData(prev => ({ ...prev, day: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {weekDays.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Time</Label>
                <Select value={moveData.time} onValueChange={(value) => 
                  setMoveData(prev => ({ ...prev, time: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                value={moveData.room}
                onChange={(e) => setMoveData(prev => ({ ...prev, room: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button onClick={handleMove}>
              <Move className="mr-2 h-4 w-4" />
              Move Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={actionType === "edit"} onOpenChange={() => setActionType(null)}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Edit Schedule</DialogTitle>
            <DialogDescription>
              Update the details for "{event.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-1 gap-4">
              {/* removed the duration because supabase automatically calculates the duration */}
              {/* <div className="space-y-2">
                <Label>Duration (hours)</Label>
                <Select value={editData.duration.toString()} onValueChange={(value) => 
                  setEditData(prev => ({ ...prev, duration: parseFloat(value) }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">30 minutes</SelectItem>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="1.5">1.5 hours</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="2.5">2.5 hours</SelectItem>
                    <SelectItem value="3">3 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}
              <div className="space-y-2">
                <Label htmlFor="editRoom">Room</Label>
                <Input
                  id="editRoom"
                  value={editData.room}
                  onChange={(e) => setEditData(prev => ({ ...prev, room: e.target.value }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button onClick={handleEdit}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Update Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={actionType === "delete"} onOpenChange={() => setActionType(null)}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Delete Schedule</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{event.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Schedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}