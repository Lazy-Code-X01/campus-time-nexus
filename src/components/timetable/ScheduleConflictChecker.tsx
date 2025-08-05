import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import { Badge } from "../ui/badge";

type Conflict = Database["public"]["Tables"]["schedule_conflicts"]["Row"];
type Schedule = Database["public"]["Tables"]["schedules"]["Row"];

interface ConflictWithSchedule extends Conflict {
  original_schedule?: Schedule;
  conflicting_schedule?: Schedule;
}

interface Props {
  conflicts: ConflictWithSchedule[];
  onResolveConflict?: (conflictId: string) => void;
}

export function ScheduleConflictChecker({ conflicts, onResolveConflict }: Props) {
  return (
    <div className="space-y-4">
      {conflicts.map((conflict) => (
        // <Card key={conflict.id} className="border-destructive">
        //   <CardHeader className="bg-destructive/10">
        //     <div className="flex justify-between items-center">
        //       <CardTitle className="text-destructive text-sm flex items-center gap-2">
        //         <AlertTriangle className="h-4 w-4" />
        //         {conflict.conflict_type} Conflict
        //       </CardTitle>
        //       <span className="text-xs text-muted-foreground">
        //         Severity: <strong>{conflict.severity}</strong>
        //       </span>
        //     </div>
        //   </CardHeader>
        //   <CardContent className="grid grid-cols-2 gap-4 text-sm">
        //     <div>
        //       <p className="font-medium">Original Schedule:</p>
        //       <p>{conflict.original_schedule?.title}</p>
        //       <p>{conflict.original_schedule?.start_time} - {conflict.original_schedule?.end_time}</p>
        //       <p>Lecturer: {conflict.original_schedule?.lecturer_id}</p>
        //       <p>Room: {conflict.original_schedule?.room}</p>
        //     </div>
        //     <div>
        //       <p className="font-medium">Conflicting Schedule:</p>
        //       <p>{conflict.conflicting_schedule?.title}</p>
        //       <p>{conflict.conflicting_schedule?.start_time} - {conflict.conflicting_schedule?.end_time}</p>
        //       <p>Lecturer: {conflict.conflicting_schedule?.lecturer_id}</p>
        //       <p>Room: {conflict.conflicting_schedule?.room}</p>
        //     </div>
        //     {conflict.resolution_notes && (
        //       <div className="col-span-2">
        //         <p className="text-xs mt-2 text-muted-foreground">
        //           Note: {conflict.resolution_notes}
        //         </p>
        //       </div>
        //     )}
        //   </CardContent>
        // </Card>
        <Card key={conflict.id} className="border border-destructive/50 bg-destructive/5 mb-4 shadow-sm">
  <CardHeader className="border-b flex flex-col gap-1">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <AlertTriangle className="text-destructive" size={18} />
        <span className="font-semibold capitalize text-destructive">
          {conflict.conflict_type.replace("_", " ")} Conflict
        </span>
      </div>
      <Badge variant="destructive" className="text-xs capitalize">
        Severity: {conflict.severity}
      </Badge>
    </div>
  </CardHeader>

  <CardContent className="grid grid-cols-2 gap-6 pt-4 pb-6">
    {/* Original Schedule */}
    <div>
      <h4 className="font-medium text-sm mb-1">Original Schedule</h4>
      <p className="text-sm text-muted-foreground mb-1">{conflict.original_schedule.title}</p>
      <p className="text-sm text-muted-foreground">
        {conflict.original_schedule.start_time} - {conflict.original_schedule.end_time}
      </p>
      <p className="text-sm text-muted-foreground">
        Lecturer: {conflict.original_schedule.lecturer_id}
      </p>
      <p className="text-sm text-muted-foreground">
        Room: {conflict.original_schedule.room}
      </p>
    </div>

    {/* Conflicting Schedule */}
    <div>
      <h4 className="font-medium text-sm mb-1">Conflicting Schedule</h4>
      <p className="text-sm text-muted-foreground mb-1">{conflict.conflicting_schedule.title}</p>
      <p className="text-sm text-muted-foreground">
        {conflict.conflicting_schedule.start_time} - {conflict.conflicting_schedule.end_time}
      </p>
      <p className="text-sm text-muted-foreground">
        Lecturer: {conflict.conflicting_schedule.lecturer_id}
      </p>
      <p className="text-sm text-muted-foreground">
        Room: {conflict.conflicting_schedule.room}
      </p>
    </div>
  </CardContent>
</Card>

      ))}
    </div>
  );
}
