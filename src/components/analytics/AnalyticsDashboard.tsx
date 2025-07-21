import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, MapPin, Clock, BookOpen, AlertTriangle } from "lucide-react";

// Mock analytics data
const roomUtilizationData = [
  { room: "A101", utilization: 85, capacity: 120, hoursUsed: 42 },
  { room: "B205", utilization: 72, capacity: 30, hoursUsed: 36 },  
  { room: "C301", utilization: 94, capacity: 40, hoursUsed: 47 },
  { room: "D105", utilization: 68, capacity: 25, hoursUsed: 34 },
  { room: "E102", utilization: 91, capacity: 80, hoursUsed: 45 }
];

const departmentScheduleData = [
  { department: "Computer Science", classes: 28, hours: 84, conflicts: 2 },
  { department: "Mathematics", classes: 22, hours: 66, conflicts: 1 },
  { department: "Physics", classes: 18, hours: 54, conflicts: 3 },
  { department: "Engineering", classes: 24, hours: 72, conflicts: 1 }
];

const weeklyTrendsData = [
  { week: "Week 1", totalHours: 276, conflicts: 3, utilization: 78 },
  { week: "Week 2", totalHours: 284, conflicts: 2, utilization: 81 },
  { week: "Week 3", totalHours: 292, conflicts: 4, utilization: 83 },
  { week: "Week 4", totalHours: 288, conflicts: 1, utilization: 82 }
];

const lecturerWorkloadData = [
  { name: "Dr. Sarah Johnson", hours: 18, classes: 6, departments: ["CS"], load: "Optimal" },
  { name: "Prof. Michael Chen", hours: 22, classes: 8, departments: ["Math"], load: "High" },
  { name: "Dr. Emily Davis", hours: 16, classes: 5, departments: ["Physics"], load: "Optimal" },
  { name: "Prof. James Wilson", hours: 20, classes: 7, departments: ["Eng"], load: "Optimal" }
];

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("current-month");
  const [selectedMetric, setSelectedMetric] = useState("utilization");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h2>
          <p className="text-muted-foreground">
            Comprehensive insights into timetable performance and resource utilization.
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-week">Current Week</SelectItem>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="current-semester">Current Semester</SelectItem>
              <SelectItem value="academic-year">Academic Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Utilization</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92</div>
            <p className="text-xs text-muted-foreground">
              Across all departments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Lecturers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              Average 19 hours/week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conflicts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">7</div>
            <p className="text-xs text-muted-foreground">
              2 resolved this week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Room Utilization Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Room Utilization Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roomUtilizationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="room" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="utilization" fill="hsl(var(--primary))" name="Utilization %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Classes by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={departmentScheduleData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="classes"
                  label={({ department, classes }) => `${department}: ${classes}`}
                >
                  {departmentScheduleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Scheduling Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyTrendsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="totalHours" 
                  stroke="hsl(var(--primary))" 
                  name="Total Hours"
                />
                <Line 
                  type="monotone" 
                  dataKey="utilization" 
                  stroke="hsl(var(--secondary))" 
                  name="Utilization %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Lecturer Workload */}
        <Card>
          <CardHeader>
            <CardTitle>Lecturer Workload Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lecturerWorkloadData.map((lecturer) => (
                <div key={lecturer.name} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <p className="font-medium">{lecturer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lecturer.hours}h/week • {lecturer.classes} classes
                    </p>
                  </div>
                  <Badge 
                    variant={lecturer.load === "High" ? "destructive" : lecturer.load === "Low" ? "secondary" : "default"}
                  >
                    {lecturer.load}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Room Details */}
        <Card>
          <CardHeader>
            <CardTitle>Room Performance Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roomUtilizationData.map((room) => (
                <div key={room.room} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <p className="font-medium">{room.room}</p>
                    <p className="text-sm text-muted-foreground">
                      Capacity: {room.capacity} • Used: {room.hoursUsed}h/week
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{room.utilization}%</p>
                    <p className="text-xs text-muted-foreground">utilization</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentScheduleData.map((dept) => (
                <div key={dept.department} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <p className="font-medium">{dept.department}</p>
                    <p className="text-sm text-muted-foreground">
                      {dept.classes} classes • {dept.hours} hours/week
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {dept.conflicts > 0 && (
                      <Badge variant="destructive">
                        {dept.conflicts} conflicts
                      </Badge>
                    )}
                    <Badge variant="secondary">
                      Active
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}