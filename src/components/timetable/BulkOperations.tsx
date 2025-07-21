import { useState } from "react";
import { Upload, Download, Copy, Trash2, Calendar, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface BulkOperationsProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkMove: (targetDate: string) => void;
  onBulkDuplicate: () => void;
  onImport: (data: any) => void;
  onExport: (format: string) => void;
}

export function BulkOperations({
  selectedCount,
  onBulkDelete,
  onBulkMove,
  onBulkDuplicate,
  onImport,
  onExport
}: BulkOperationsProps) {
  const [moveTarget, setMoveTarget] = useState("");
  const [importFormat, setImportFormat] = useState("csv");
  const [exportFormat, setExportFormat] = useState("pdf");
  const { toast } = useToast();

  const handleExport = () => {
    onExport(exportFormat);
    toast({
      title: "Export Started",
      description: `Exporting timetable as ${exportFormat.toUpperCase()}...`,
    });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Mock import functionality
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          onImport({ file: file.name, data });
          toast({
            title: "Import Successful",
            description: `Imported ${file.name} successfully.`,
          });
        } catch (error) {
          toast({
            title: "Import Failed",
            description: "Failed to import file. Please check the format.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
  };

  const handleBulkMove = () => {
    if (moveTarget) {
      onBulkMove(moveTarget);
      toast({
        title: "Schedules Moved",
        description: `${selectedCount} schedules moved to ${moveTarget}.`,
      });
    }
  };

  const handleBulkDuplicate = () => {
    onBulkDuplicate();
    toast({
      title: "Schedules Duplicated",
      description: `${selectedCount} schedules duplicated successfully.`,
    });
  };

  const handleBulkDelete = () => {
    onBulkDelete();
    toast({
      title: "Schedules Deleted",
      description: `${selectedCount} schedules deleted successfully.`,
      variant: "destructive",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Bulk Operations</span>
          {selectedCount > 0 && (
            <Badge variant="outline">
              {selectedCount} selected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Import/Export Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Import & Export</h4>
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Import Timetable Data</DialogTitle>
                  <DialogDescription>
                    Upload a CSV or Excel file to import schedule data.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="import-format">File Format</Label>
                    <Select value={importFormat} onValueChange={setImportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Choose File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept={importFormat === "csv" ? ".csv" : importFormat === "xlsx" ? ".xlsx" : ".json"}
                      onChange={handleImport}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Timetable</DialogTitle>
                  <DialogDescription>
                    Choose the format for exporting your timetable data.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="export-format">Export Format</Label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF Report</SelectItem>
                        <SelectItem value="csv">CSV Data</SelectItem>
                        <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                        <SelectItem value="ical">iCalendar (.ics)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleExport} className="w-full">
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export {exportFormat.toUpperCase()}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator />

        {/* Bulk Actions Section */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Bulk Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={selectedCount === 0}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Move ({selectedCount})
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Move Selected Schedules</DialogTitle>
                  <DialogDescription>
                    Move {selectedCount} selected schedules to a different week.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="move-target">Target Week</Label>
                    <Select value={moveTarget} onValueChange={setMoveTarget}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select target week" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="next-week">Next Week</SelectItem>
                        <SelectItem value="week-after">Week After Next</SelectItem>
                        <SelectItem value="next-month">Next Month</SelectItem>
                        <SelectItem value="custom">Custom Date...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleBulkMove} disabled={!moveTarget} className="w-full">
                    Move Schedules
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBulkDuplicate}
              disabled={selectedCount === 0}
            >
              <Copy className="mr-2 h-4 w-4" />
              Duplicate ({selectedCount})
            </Button>

            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleBulkDelete}
              disabled={selectedCount === 0}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedCount})
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}