import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLecturers } from "@/hooks/useLecturers";
import { useDepartments } from "@/hooks/useDepartments";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select";
import { PlusCircle, Users, Mail, GraduationCap, Trash2, UserCheck } from "lucide-react";

export default function Lecturers() {
  const { lecturers, addLecturer, deleteLecturer } = useLecturers();
  const { departments } = useDepartments();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getDepartmentName = (deptId: string) => {
    const dept = departments.find(d => d.id === deptId);
    return dept?.name || "Unknown Department";
  };

  const handleSubmit = async () => {
    if (!name || !email || !departmentId) return;
    try {
      await addLecturer({ name, email, department_id: departmentId });
      setName(""); 
      setEmail(""); 
      setDepartmentId("");
      setIsDialogOpen(false);
    } catch (err) {
      console.error("Error adding lecturer:", err);
    }
  };

  const isFormValid = name.trim() && email.trim() && departmentId;

  return (
    // <div className="container px-4 py-8 space-y-8">
       <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {/* <GraduationCap className="h-8 w-8 text-primary" /> */}
            <h1 className="text-3xl font-bold tracking-tight">Lecturers</h1>
          </div>
          {/* <p className="text-muted-foreground">Manage your institution's lecturers and their departments</p> */}
        </div>

        {/* Add Lecturer Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Lecturer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Add New Lecturer
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name"
                  placeholder="Enter lecturer's full name" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="lecturer@university.edu" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select onValueChange={setDepartmentId} value={departmentId}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Choose department..." />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="gap-2"
              >
                <UserCheck className="h-4 w-4" />
                Add Lecturer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
    <div className="flex flex-wrap gap-4 w-full">
      <Card className="flex-1 min-w-[200px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Total Lecturers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{lecturers.length}</div>
        </CardContent>
      </Card>

      <Card className="flex-1 min-w-[200px]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Departments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{departments.length}</div>
        </CardContent>
      </Card>
    </div>

      {/* Lecturer List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">All Lecturers</h2>
        </div>

        {lecturers.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="space-y-3">
              <Users className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="text-lg font-medium">No lecturers yet</h3>
              <p className="text-muted-foreground">Add your first lecturer to get started</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lecturers.map(lecturer => (
              <Card key={lecturer.id} className="group hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <span className="truncate">{lecturer.name}</span>
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => deleteLecturer(lecturer.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{lecturer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      {getDepartmentName(lecturer.department_id)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
