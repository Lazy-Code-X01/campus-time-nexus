import { useState } from "react";
import { Calendar, Filter, Download, Users, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { TimetableFilters } from "@/components/timetable/TimetableFilters";
import { CreateScheduleDialog } from "@/components/timetable/CreateScheduleDialog";
import { ScheduleConflictChecker, mockConflicts } from "@/components/timetable/ScheduleConflictChecker";

// Mock data for demonstration
const mockDepartments = [
  { id: "cs", name: "Computer Science", color: "bg-blue-500" },
  { id: "math", name: "Mathematics", color: "bg-green-500" },
  { id: "physics", name: "Physics", color: "bg-purple-500" },
  { id: "eng", name: "Engineering", color: "bg-orange-500" }
];

const mockLecturers = [
  { id: "1", name: "Dr. Sarah Johnson", department: "cs" },
  { id: "2", name: "Prof. Michael Chen", department: "math" },
  { id: "3", name: "Dr. Emily Davis", department: "physics" },
  { id: "4", name: "Prof. James Wilson", department: "eng" }
];

export default function Timetables() {
  const [viewMode, setViewMode] = useState<"department" | "lecturer" | "room">("department");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedLecturer, setSelectedLecturer] = useState<string>("all");
  const [selectedWeek, setSelectedWeek] = useState<string>("current");
  const [showConflicts, setShowConflicts] = useState(true);

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    console.log("Exporting timetable as PDF...");
  };

  const handleSaveSchedule = (scheduleData: any) => {
    console.log("Saving new schedule:", scheduleData);
    // TODO: Implement save functionality
  };

  const handleResolveConflict = (conflictId: string, resolution: string) => {
    console.log("Resolving conflict:", conflictId, resolution);
    // TODO: Implement conflict resolution
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetables</h1>
          <p className="text-muted-foreground">
            View and manage course schedules across departments and lecturers.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <CreateScheduleDialog
            departments={mockDepartments}
            lecturers={mockLecturers}
            onSave={handleSaveSchedule}
          />
        </div>
      </div>

      {/* Filters */}
      <TimetableFilters
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        selectedLecturer={selectedLecturer}
        onLecturerChange={setSelectedLecturer}
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
        departments={mockDepartments}
        lecturers={mockLecturers}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Utilization</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Average capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
            <Filter className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
            <p className="text-xs text-muted-foreground">Need resolution</p>
          </CardContent>
        </Card>
      </div>

      {/* Conflict Detection */}
      {showConflicts && mockConflicts.length > 0 && (
        <ScheduleConflictChecker 
          conflicts={mockConflicts}
          onResolveConflict={handleResolveConflict}
        />
      )}

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {viewMode === "department" && selectedDepartment !== "all" 
                ? `${mockDepartments.find(d => d.id === selectedDepartment)?.name} Schedule`
                : viewMode === "lecturer" && selectedLecturer !== "all"
                ? `${mockLecturers.find(l => l.id === selectedLecturer)?.name} Schedule`
                : "Weekly Timetable"}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">Week of Nov 18-22, 2024</Badge>
              {viewMode === "department" && selectedDepartment !== "all" && (
                <Badge 
                  className={`${mockDepartments.find(d => d.id === selectedDepartment)?.color} text-white`}
                >
                  {mockDepartments.find(d => d.id === selectedDepartment)?.name}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <TimetableGrid 
            viewMode={viewMode}
            selectedDepartment={selectedDepartment}
            selectedLecturer={selectedLecturer}
            departments={mockDepartments}
            lecturers={mockLecturers}
          />
        </CardContent>
      </Card>
    </div>
  );
}