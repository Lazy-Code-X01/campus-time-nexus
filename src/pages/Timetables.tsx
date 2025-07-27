import { useEffect, useState,useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import logo from "@/assets/pcu-logo.png";


import {  Download, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TimetableGrid } from "@/components/timetable/TimetableGrid";
import { TimetableFilters } from "@/components/timetable/TimetableFilters";
import { CreateScheduleDialog } from "@/components/timetable/CreateScheduleDialog";
import { ScheduleConflictChecker } from "@/components/timetable/ScheduleConflictChecker";
import { useDepartments } from "@/hooks/useDepartments";
import { useLecturers } from "@/hooks/useLecturers";
import { useSchedules } from "@/hooks/useSchedules";
import { useScheduleConflicts } from "@/hooks/useScheduleConflicts";


export default function Timetables() {
  const { departments } = useDepartments();
  const { lecturers } = useLecturers();
  const { schedules, createSchedule, updateSchedule, deleteSchedule } = useSchedules();
  const [viewMode, setViewMode] = useState<"department" | "lecturer" | "room">("department");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");
  const [selectedLecturer, setSelectedLecturer] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState("all");
  const [selectedWeek, setSelectedWeek] = useState<string>("current");
  const [showConflicts, setShowConflicts] = useState(true);
  const [selectedSchedules, setSelectedSchedules] = useState<number>(0);
  const [conflictsOpen, setConflictsOpen] = useState(false);

  const { conflicts, error, refetch } = useScheduleConflicts();

  useEffect(() => {
    refetch();
  }, [schedules]);



  const timetableRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    if (!timetableRef.current) return;

    const canvas = await html2canvas(timetableRef.current, { scale: 3 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Load logo as image
    const logoImage = new Image();
    logoImage.src = logo; // this is the imported asset

    logoImage.onload = () => {
      const padding = 10;
      const headerHeight = 40;

      // Add logo and titles
      pdf.addImage(logoImage, "PNG", padding, padding, 25, 25);
      pdf.setFontSize(18);
      pdf.setFont("helvetica", "bold");
      pdf.text("Precious Cornerstone University", pageWidth / 2, padding + 10, { align: "center" });

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text("Weekly Timetable", pageWidth / 2, padding + 20, { align: "center" });

      // Add timetable image

    const contentY = headerHeight + padding;
    const imgWidth = pageWidth - padding * 2;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pageContentHeight = pageHeight - contentY - padding;

    let renderedHeight = 0;
    let pageIndex = 0;

    while (renderedHeight < canvas.height) {
      // Create a temporary canvas for each slice
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      sliceCanvas.height = Math.min(canvas.height - renderedHeight, (pageContentHeight * canvas.height) / imgHeight);

      const ctx = sliceCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(
          canvas,
          0,
          renderedHeight,
          canvas.width,
          sliceCanvas.height,
          0,
          0,
          canvas.width,
          sliceCanvas.height
        );
      }

      const sliceImgData = sliceCanvas.toDataURL("image/png");
      const sliceImgHeight = (sliceCanvas.height * imgWidth) / canvas.width;

      if (pageIndex > 0) {
        pdf.addPage("a4", "landscape");
      }

      pdf.addImage(sliceImgData, "PNG", padding, contentY, imgWidth, sliceImgHeight);
      renderedHeight += sliceCanvas.height;
      pageIndex++;
    }

    pdf.save("PCU-Timetable.pdf");

        };
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

  const mockRooms = [
    { id: "A101", name: "Lecture Hall A101", capacity: 120 },
    { id: "B205", name: "Seminar Room B205", capacity: 30 },
    { id: "C301", name: "Computer Lab C301", capacity: 40 },
    { id: "D105", name: "Physics Lab D105", capacity: 25 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Timetables</h1>
        </div>
        <div className="flex gap-2">
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
        rooms={mockRooms}
        selectedRoom={selectedRoom}
        onRoomChange={setSelectedRoom}
      />

      {/* Conflict Detection */}
      {showConflicts && conflicts.length > 0 && (
        <Collapsible open={conflictsOpen} onOpenChange={setConflictsOpen}>
          <Card>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Schedule Conflicts</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">{conflicts.length}</Badge>
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
                  conflicts={conflicts}
                  // onResolveConflict={handleResolveConflict}
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
          
          <div ref={timetableRef}>
            <TimetableGrid 
              viewMode={viewMode}
              selectedDepartment={selectedDepartment}
              selectedLecturer={selectedLecturer}
              departments={departments}
              selectedRoom={selectedRoom}
              lecturers={lecturers}
              schedules={schedules}
              onUpdateEvent={updateSchedule}
              onDeleteEvent={deleteSchedule}
              />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}