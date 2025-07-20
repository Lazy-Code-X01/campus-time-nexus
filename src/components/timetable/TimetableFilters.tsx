import { Filter, Calendar, Users, Building } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

interface TimetableFiltersProps {
  viewMode: "department" | "lecturer" | "room";
  onViewModeChange: (mode: "department" | "lecturer" | "room") => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  selectedLecturer: string;
  onLecturerChange: (lecturer: string) => void;
  selectedWeek: string;
  onWeekChange: (week: string) => void;
  departments: Department[];
  lecturers: Lecturer[];
}

export function TimetableFilters({
  viewMode,
  onViewModeChange,
  selectedDepartment,
  onDepartmentChange,
  selectedLecturer,
  onLecturerChange,
  selectedWeek,
  onWeekChange,
  departments,
  lecturers
}: TimetableFiltersProps) {
  const filteredLecturers = selectedDepartment === "all" 
    ? lecturers 
    : lecturers.filter(l => l.department === selectedDepartment);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          {/* View Mode Selector */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">View By</label>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "department" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("department")}
              >
                <Building className="mr-2 h-4 w-4" />
                Department
              </Button>
              <Button
                variant={viewMode === "lecturer" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("lecturer")}
              >
                <Users className="mr-2 h-4 w-4" />
                Lecturer
              </Button>
              <Button
                variant={viewMode === "room" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("room")}
              >
                <Building className="mr-2 h-4 w-4" />
                Room
              </Button>
            </div>
          </div>

          {/* Department Filter */}
          {(viewMode === "department" || viewMode === "lecturer") && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Department</label>
              <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
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
          )}

          {/* Lecturer Filter */}
          {viewMode === "lecturer" && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Lecturer</label>
              <Select value={selectedLecturer} onValueChange={onLecturerChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select lecturer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Lecturers</SelectItem>
                  {filteredLecturers.map((lecturer) => (
                    <SelectItem key={lecturer.id} value={lecturer.id}>
                      {lecturer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Week Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Week</label>
            <Select value={selectedWeek} onValueChange={onWeekChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select week" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="previous">Previous Week</SelectItem>
                <SelectItem value="current">Current Week</SelectItem>
                <SelectItem value="next">Next Week</SelectItem>
                <SelectItem value="custom">Custom Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium invisible">Actions</label>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDepartmentChange("all");
                onLecturerChange("all");
                onWeekChange("current");
              }}
            >
              <Filter className="mr-2 h-4 w-4" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mt-4">
          {selectedDepartment !== "all" && (
            <Badge variant="secondary" className="gap-2">
              Department: {departments.find(d => d.id === selectedDepartment)?.name}
              <button
                onClick={() => onDepartmentChange("all")}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedLecturer !== "all" && (
            <Badge variant="secondary" className="gap-2">
              Lecturer: {lecturers.find(l => l.id === selectedLecturer)?.name}
              <button
                onClick={() => onLecturerChange("all")}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
          {selectedWeek !== "current" && (
            <Badge variant="secondary" className="gap-2">
              Week: {selectedWeek}
              <button
                onClick={() => onWeekChange("current")}
                className="ml-1 hover:bg-muted rounded-full p-0.5"
              >
                ×
              </button>
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}