import { useState } from "react";
import { Save, Copy, Trash2, Calendar, Clock, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  description: string;
  type: "weekly" | "daily" | "course";
  department: string;
  created: string;
  lastUsed: string;
  usageCount: number;
}

const mockTemplates: Template[] = [
  {
    id: "1",
    name: "CS Standard Week",
    description: "Standard computer science weekly schedule template",
    type: "weekly",
    department: "Computer Science",
    created: "2024-11-01",
    lastUsed: "2024-11-18",
    usageCount: 12
  },
  {
    id: "2", 
    name: "Math Intensive",
    description: "Mathematics department intensive course schedule",
    type: "weekly",
    department: "Mathematics",
    created: "2024-10-15",
    lastUsed: "2024-11-10",
    usageCount: 8
  },
  {
    id: "3",
    name: "Lab Session",
    description: "Standard 3-hour lab session template",
    type: "course",
    department: "All",
    created: "2024-09-20",
    lastUsed: "2024-11-17",
    usageCount: 25
  }
];

interface TemplateManagerProps {
  onApplyTemplate: (templateId: string) => void;
  onSaveAsTemplate: () => void;
}

export function TemplateManager({ onApplyTemplate, onSaveAsTemplate }: TemplateManagerProps) {
  const [templates, setTemplates] = useState<Template[]>(mockTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [newTemplateType, setNewTemplateType] = useState<"weekly" | "daily" | "course">("weekly");
  const [newTemplateDepartment, setNewTemplateDepartment] = useState("Computer Science");
  const { toast } = useToast();

  const handleSaveTemplate = () => {
    if (!newTemplateName) {
      toast({
        title: "Error",
        description: "Please enter a template name.",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: Template = {
      id: Date.now().toString(),
      name: newTemplateName,
      description: newTemplateDescription,
      type: newTemplateType,
      department: newTemplateDepartment,
      created: new Date().toISOString().split('T')[0],
      lastUsed: new Date().toISOString().split('T')[0],
      usageCount: 0
    };

    setTemplates([...templates, newTemplate]);
    setNewTemplateName("");
    setNewTemplateDescription("");
    onSaveAsTemplate();
    
    toast({
      title: "Template Saved",
      description: `Template "${newTemplateName}" has been saved successfully.`,
    });
  };

  const handleApplyTemplate = (template: Template) => {
    // Update usage stats
    const updatedTemplates = templates.map(t => 
      t.id === template.id 
        ? { ...t, lastUsed: new Date().toISOString().split('T')[0], usageCount: t.usageCount + 1 }
        : t
    );
    setTemplates(updatedTemplates);
    
    onApplyTemplate(template.id);
    toast({
      title: "Template Applied",
      description: `Applied template "${template.name}" to current schedule.`,
    });
  };

  const handleDuplicateTemplate = (template: Template) => {
    const duplicated: Template = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      created: new Date().toISOString().split('T')[0],
      usageCount: 0
    };
    
    setTemplates([...templates, duplicated]);
    toast({
      title: "Template Duplicated",
      description: `Created a copy of "${template.name}".`,
    });
  };

  const handleDeleteTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    setTemplates(templates.filter(t => t.id !== templateId));
    toast({
      title: "Template Deleted",
      description: `Template "${template?.name}" has been deleted.`,
      variant: "destructive",
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "weekly": return "bg-blue-500";
      case "daily": return "bg-green-500";
      case "course": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Schedule Templates
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Save Current as Template
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Schedule Template</DialogTitle>
                <DialogDescription>
                  Save the current schedule as a reusable template.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input
                    id="template-name"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="e.g., CS Weekly Schedule"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea
                    id="template-description"
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    placeholder="Brief description of this template..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-type">Template Type</Label>
                    <Select value={newTemplateType} onValueChange={(value: "weekly" | "daily" | "course") => setNewTemplateType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly Schedule</SelectItem>
                        <SelectItem value="daily">Daily Schedule</SelectItem>
                        <SelectItem value="course">Course Template</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="template-department">Department</Label>
                    <Select value={newTemplateDepartment} onValueChange={setNewTemplateDepartment}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Computer Science">Computer Science</SelectItem>
                        <SelectItem value="Mathematics">Mathematics</SelectItem>
                        <SelectItem value="Physics">Physics</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="All">All Departments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSaveTemplate} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>No templates saved yet.</p>
              <p className="text-sm">Save your current schedule as a template to reuse later.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {templates.map((template) => (
                <div key={template.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {template.description}
                      </p>
                    </div>
                    <Badge className={`${getTypeColor(template.type)} text-white`}>
                      {template.type}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{template.department}</span>
                    <span>•</span>
                    <span>Used {template.usageCount} times</span>
                    <span>•</span>
                    <span>Last used {template.lastUsed}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleApplyTemplate(template)}
                      className="flex-1"
                    >
                      Apply Template
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDuplicateTemplate(template)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteTemplate(template.id)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}