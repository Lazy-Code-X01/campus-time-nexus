
import { Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDepartments } from "@/hooks/useDepartments";
import { useLecturers } from "@/hooks/useLecturers";

interface TimetableFiltersProps {
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  selectedLecturer: string;
  onLecturerChange: (lecturer: string) => void;
  selectedWeek: string;
  onWeekChange: (week: string) => void;
}

export function TimetableFilters({
  selectedDepartment,
  onDepartmentChange,
  selectedLecturer,
  onLecturerChange,
  selectedWeek,
  onWeekChange
}: TimetableFiltersProps) {
  const { departments, loading: departmentsLoading } = useDepartments();
  const { lecturers, loading: lecturersLoading } = useLecturers(selectedDepartment);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
          {/* Department Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Department</label>
            <Select 
              value={selectedDepartment} 
              onValueChange={onDepartmentChange}
              disabled={departmentsLoading}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: dept.color }}
                      />
                      {dept.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lecturer Filter */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Lecturer</label>
            <Select 
              value={selectedLecturer} 
              onValueChange={onLecturerChange}
              disabled={lecturersLoading}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select lecturer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lecturers</SelectItem>
                {lecturers.map((lecturer) => (
                  <SelectItem key={lecturer.id} value={lecturer.id}>
                    {lecturer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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
