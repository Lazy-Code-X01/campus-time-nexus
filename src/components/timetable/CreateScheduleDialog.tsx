import { useState } from "react";
import { Plus, Clock, MapPin, Users, AlertTriangle, Calendar } from "lucide-react";
import { useDepartments } from "@/hooks/useDepartments";
import { useLecturers } from "@/hooks/useLecturers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

interface CreateScheduleDialogProps {
  departments: Department[];
  lecturers: Lecturer[];
  onSave: (scheduleData: any) => void;
}

interface ScheduleFormData {
  title: string;
  description: string;
  department: string;
  lecturer: string;
  courseCode: string;
  type: "lecture" | "lab" | "tutorial" | "exam";
  day: string;
  startTime: string;
  duration: number;
  room: string;
  capacity: number;
  estimatedStudents: number;
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "08:00", "09:00", "10:00",
  "11:00", "12:00", "13:00",
  "14:00",  "15:00", "16:00", "17:00"
];

const scheduleTypes = [
  { value: "lecture", label: "Lecture", icon: "📚" },
  { value: "lab", label: "Laboratory", icon: "🔬" },
  { value: "tutorial", label: "Tutorial", icon: "👥" },
  { value: "exam", label: "Examination", icon: "📝" }
];

const mockRooms = [
  { id: "A101", name: "Lecture Hall A101", capacity: 120 },
  { id: "B205", name: "Seminar Room B205", capacity: 30 },
  { id: "C301", name: "Computer Lab C301", capacity: 40 },
  { id: "D105", name: "Physics Lab D105", capacity: 25 }
];

const mockCourses = [
  { code: "CS101", title: "Introduction to Computer Science" },
  { code: "CS201", title: "Data Structures & Algorithms" },
  { code: "CS301", title: "Software Engineering" },
  { code: "CS401", title: "Artificial Intelligence" }
];



export function CreateScheduleDialog({ departments, lecturers, onSave }: CreateScheduleDialogProps) {
  const [open, setOpen] = useState(false);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: "",
    description: "",
    department: "",
    lecturer: "",
    courseCode: "",
    type: "lecture",
    day: "",
    startTime: "",
    duration: 1,
    room: "",
    capacity: 50,
    estimatedStudents: 30
  });

  const filteredLecturers = formData.department 
    ? lecturers.filter(l => l.department_id === formData.department)
    : lecturers;

  const checkConflicts = () => {
    const conflicts: string[] = [];
    
    // Simulate conflict detection
    if (formData.lecturer && formData.day && formData.startTime) {
      // Check lecturer availability
      if (formData.day === "Monday" && formData.startTime === "09:00") {
        conflicts.push("Lecturer has another class scheduled at this time");
      }
      
      // Check room availability
      if (formData.room && formData.day === "Tuesday" && formData.startTime === "11:00") {
        conflicts.push("Room is already booked for this time slot");
      }
      
      // Check capacity issues
      if (formData.estimatedStudents > formData.capacity) {
        conflicts.push("Estimated students exceed room capacity");
      }
    }
    
    setConflicts(conflicts);
    return conflicts.length === 0;
  };

  function calculateEndTime(startTime: string, durationHours: number): string {
  const [startHour, startMinute] = startTime.split(":").map(Number);
  const totalStartMinutes = startHour * 60 + startMinute;
  const totalEndMinutes = totalStartMinutes + durationHours * 60;
  const endHour = Math.floor(totalEndMinutes / 60);
  const endMinute = totalEndMinutes % 60;
  return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
}


  const handleSubmit = () => {
    if (checkConflicts()) {
      // Convert form data to database format
      const endTime = calculateEndTime(formData.startTime, formData.duration);

      const scheduleData = {
        title: formData.title,
        department_id: formData.department,
        lecturer_id: formData.lecturer,
        type: formData.type,
        // day_of_week: weekDays.indexOf(formData.day),
        day_of_week: weekDays.indexOf(formData.day) + 1,

        start_time: formData.startTime,
        end_time: endTime, 
        room: formData.room,
        capacity: formData.capacity,
        student_count: formData.estimatedStudents
      };
      
      onSave(scheduleData);
      setOpen(false);
      setFormData({
        title: "",
        description: "",
        department: "",
        lecturer: "",
        courseCode: "",
        type: "lecture",
        day: "",
        startTime: "",
        duration: 1,
        room: "",
        capacity: 50,
        estimatedStudents: 30
      });
    }
  };

  const isFormValid = formData.title && formData.department && formData.lecturer && 
                     formData.day && formData.startTime && formData.room;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          Create Schedule
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Schedule Entry</DialogTitle>
          <DialogDescription>
            Add a new class, lab, or session to the timetable. The system will check for conflicts automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Basic Information */}
          <div className="grid gap-4">
            <h4 className="font-medium text-sm">Basic Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Course/Session Title *</Label>

                <Select
                  value={formData.title}
                  onValueChange={(value) => {
                    const selected = mockCourses.find(course => course.title === value);
                    setFormData(prev => ({
                      ...prev,
                      title: value,
                      courseCode: selected?.code || ''
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select course title" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCourses.map(course => (
                      <SelectItem key={course.code} value={course.title}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code</Label>
                <Input
                  id="courseCode"
                  placeholder="e.g., CS301"
                  value={formData.courseCode}
                  // onChange={(e) => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
                  disabled 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional course description or notes"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
              />
            </div>
          </div>

          {/* Department and Lecturer */}
          <div className="grid gap-4">
            <h4 className="font-medium text-sm">Assignment</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Department *</Label>
                <Select value={formData.department} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, department: value, lecturer: "" }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${dept.color}`} />
                          {dept.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Lecturer *</Label>
                <Select 
                  value={formData.lecturer} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, lecturer: value }))}
                  disabled={!formData.department}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select lecturer" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredLecturers.map((lecturer) => (
                      <SelectItem key={lecturer.id} value={lecturer.id}>
                        {lecturer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Schedule Details */}
          <div className="grid gap-4">
            <h4 className="font-medium text-sm">Schedule Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Session Type *</Label>
                <Select value={formData.type} onValueChange={(value: any) => 
                  setFormData(prev => ({ ...prev, type: value }))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {scheduleTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          <span>{type.icon}</span>
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Day *</Label>
                <Select value={formData.day} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, day: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
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
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Time *</Label>
                <Select value={formData.startTime} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, startTime: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
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
              <div className="space-y-2">
                <Label>Duration (hours) *</Label>
                <Select value={formData.duration.toString()} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, duration: parseFloat(value) }))
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
              </div>
            </div>
          </div>

          {/* Room and Capacity */}
          <div className="grid gap-4">
            <h4 className="font-medium text-sm">Venue & Capacity</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="room">Room *</Label>
                <Select
                  value={formData.room}
                  onValueChange={(value) => {
                    const selected = mockRooms.find(r => r.id === value);
                    setFormData((prev) => ({
                      ...prev,
                      room: value,
                      capacity: selected?.capacity || prev.capacity
                    }));
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockRooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name} ({room.capacity})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Room Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  disabled
                />
                <p className="text-xs text-muted-foreground">
                Auto-filled based on selected room
              </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedStudents">Expected Students</Label>
                <Input
                  id="estimatedStudents"
                  type="number"
                  value={formData.estimatedStudents}
                  onChange={(e) => setFormData(prev => ({ ...prev, estimatedStudents: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </div>

          {/* Conflict Detection */}
          {conflicts.length > 0 && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p className="font-medium">Schedule conflicts detected:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {conflicts.map((conflict, index) => (
                      <li key={index} className="text-sm">{conflict}</li>
                    ))}
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Schedule Preview */}
          {isFormValid && (
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Schedule Preview</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  <Calendar className="mr-1 h-3 w-3" />
                  {formData.day}
                </Badge>
                <Badge variant="outline">
                  <Clock className="mr-1 h-3 w-3" />
                  {formData.startTime} ({formData.duration}h)
                </Badge>
                <Badge variant="outline">
                  <MapPin className="mr-1 h-3 w-3" />
                  {formData.room}
                </Badge>
                <Badge variant="outline">
                  <Users className="mr-1 h-3 w-3" />
                  {formData.estimatedStudents}/{formData.capacity}
                </Badge>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isFormValid || conflicts.length > 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Schedule
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}