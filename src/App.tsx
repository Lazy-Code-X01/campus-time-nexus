
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { AppLayout } from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Timetables from "./pages/Timetables";
import Analytics from "./pages/Analytics";
import Login from "./pages/auth/Login";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Main Application Routes */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="timetables" element={<Timetables />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="lecturers" element={<div className="p-8 text-center text-muted-foreground">Lecturers page coming soon...</div>} />
              
              {/* Lecturer specific routes */}
              <Route path="my-schedule" element={<div className="p-8 text-center text-muted-foreground">My Schedule page coming soon...</div>} />
              
              {/* Student specific routes */}
              <Route path="my-timetable" element={<div className="p-8 text-center text-muted-foreground">My Timetable page coming soon...</div>} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
