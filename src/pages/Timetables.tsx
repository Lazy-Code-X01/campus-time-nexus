import { useState } from "react";
import { Calendar, Filter, Download, Users, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { TimetableFilters } from "@/components/timetable/TimetableFilters";
import { CreateScheduleDialog } from "@/components/timetable/CreateScheduleDialog";
import { ScheduleConflictChecker, mockConflicts } from "@/components/timetable/ScheduleConflictChecker";
import { AdvancedFilters } from "@/components/timetable/AdvancedFilters";
import { useDepartments } from "@/hooks/useDepartments";
import { useLecturers } from "@/hooks/useLecturers";
import { useSchedules } from "@/hooks/useSchedules";

export default function Timetables() {
  const { departments } = useDepartments();
  const { lecturers } = useLecturers();
  const { schedules, createSchedule, updateSchedule, deleteSchedule } = useSchedules();
  const [viewMode] = useState<"department">("department"); // Fixed to department view
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedLecturer, setSelectedLecturer] = useState<string>("all");
  const [selectedWeek, setSelectedWeek] = useState<string>("current");
  const [showConflicts, setShowConflicts] = useState(true);
  const [selectedSchedules, setSelectedSchedules] = useState<number>(0);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [conflictsOpen, setConflictsOpen] = useState(false);

  const handleExportPDF = () => {
    // TODO: Implement PDF export functionality
    console.log("Exporting timetable as PDF...");
  };

  const handleSaveSchedule = async (scheduleData: any) => {
    try {
      await createSchedule(scheduleData);
    } catch (error) {
      console.error("Failed to save schedule:", error);
    }
  };

  const handleResolveConflict = (conflictId: string, resolution: string) => {
    console.log("Resolving conflict:", conflictId, resolution);
    // TODO: Implement conflict resolution
  };

  // Advanced features handlers
  const handleSearchChange = (query: string) => {
    console.log("Search query:", query);
  };

  const handleBulkOperations = {
    delete: () => console.log("Bulk delete"),
    move: (target: string) => console.log("Bulk move to:", target),
    duplicate: () => console.log("Bulk duplicate"),
    import: (data: any) => console.log("Import data:", data),
    export: (format: string) => console.log("Export as:", format)
  };

  const handleTemplateOperations = {
    apply: (templateId: string) => console.log("Apply template:", templateId),
    save: () => console.log("Save as template")
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetables</h1>
          {/* <p className="text-muted-foreground">
            View and manage course schedules across departments and lecturers.
          </p> */}
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
          <CreateScheduleDialog
            departments={departments}
            lecturers={lecturers}
            onSave={handleSaveSchedule}
          />
        </div>
      </div>

      {/* Filters */}
      <TimetableFilters
        selectedDepartment={selectedDepartment}
        onDepartmentChange={setSelectedDepartment}
        selectedLecturer={selectedLecturer}
        onLecturerChange={setSelectedLecturer}
        selectedWeek={selectedWeek}
        onWeekChange={setSelectedWeek}
      />

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <AdvancedFilters
          onSearchChange={handleSearchChange}
          onRoomFilter={(room) => console.log("Room filter:", room)}
          onTimeSlotFilter={(slot) => console.log("Time slot filter:", slot)}
          onCapacityFilter={(capacity) => console.log("Capacity filter:", capacity)}
          onAvailabilityFilter={(available) => console.log("Availability filter:", available)}
        />
      )}


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
        <Collapsible open={conflictsOpen} onOpenChange={setConflictsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Schedule Conflicts</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{mockConflicts.length}</Badge>
                    {conflictsOpen ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <ScheduleConflictChecker 
                  conflicts={mockConflicts}
                  onResolveConflict={handleResolveConflict}
                />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>
      )}

      {/* Timetable Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {selectedDepartment !== "all" 
                ? `${departments.find(d => d.id === selectedDepartment)?.name} Schedule`
                : selectedLecturer !== "all"
                ? `${lecturers.find(l => l.id === selectedLecturer)?.name} Schedule`
                : "Weekly Timetable"}
            </CardTitle>
            <div className="flex gap-2">
              <Badge variant="outline">Week of Nov 18-22, 2024</Badge>
              {selectedDepartment !== "all" && (
                <Badge 
                  style={{ backgroundColor: departments.find(d => d.id === selectedDepartment)?.color }}
                  className="text-white"
                >
                  {departments.find(d => d.id === selectedDepartment)?.name}
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
            departments={departments}
            lecturers={lecturers}
            schedules={schedules}
            onUpdateEvent={updateSchedule}
            onDeleteEvent={deleteSchedule}
          />
        </CardContent>
      </Card>
    </div>
  );
}