import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Main Application Routes */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            {/* Placeholder routes - will be implemented in later phases */}
            <Route path="timetables" element={<div className="p-8 text-center text-muted-foreground">Timetables page coming soon...</div>} />
            <Route path="courses" element={<div className="p-8 text-center text-muted-foreground">Courses page coming soon...</div>} />
            <Route path="lecturers" element={<div className="p-8 text-center text-muted-foreground">Lecturers page coming soon...</div>} />
            <Route path="departments" element={<div className="p-8 text-center text-muted-foreground">Departments page coming soon...</div>} />
            <Route path="time-slots" element={<div className="p-8 text-center text-muted-foreground">Time Slots page coming soon...</div>} />
            <Route path="reports" element={<div className="p-8 text-center text-muted-foreground">Reports page coming soon...</div>} />
            <Route path="settings" element={<div className="p-8 text-center text-muted-foreground">Settings page coming soon...</div>} />
            
            {/* Lecturer specific routes */}
            <Route path="my-schedule" element={<div className="p-8 text-center text-muted-foreground">My Schedule page coming soon...</div>} />
            <Route path="my-courses" element={<div className="p-8 text-center text-muted-foreground">My Courses page coming soon...</div>} />
            <Route path="preferences" element={<div className="p-8 text-center text-muted-foreground">Preferences page coming soon...</div>} />
            
            {/* Student specific routes */}
            <Route path="my-timetable" element={<div className="p-8 text-center text-muted-foreground">My Timetable page coming soon...</div>} />
            <Route path="course-schedule" element={<div className="p-8 text-center text-muted-foreground">Course Schedule page coming soon...</div>} />
            <Route path="download" element={<div className="p-8 text-center text-muted-foreground">Download page coming soon...</div>} />
          </Route>
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
