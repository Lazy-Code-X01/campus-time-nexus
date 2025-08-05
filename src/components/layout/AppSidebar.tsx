
import { Calendar, Users, Home, LogOut } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import pcuLogo from "@/assets/pcu-logo.png";

// Mock user role - this will be replaced with real authentication
const mockUserRole = "admin"; // admin, lecturer, student

// Navigation items based on user roles
const navigationItems = {
  admin: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      group: "Overview"
    },
    {
      title: "Timetables",
      url: "/timetables",
      icon: Calendar,
      group: "Management"
    },
    {
      title: "Lecturers",
      url: "/lecturers",
      icon: Users,
      group: "Management"
    }
  ],
  lecturer: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      group: "Overview"
    },
    {
      title: "My Schedule",
      url: "/my-schedule",
      icon: Calendar,
      group: "Teaching"
    }
  ],
  student: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
      group: "Overview"
    },
    {
      title: "My Timetable",
      url: "/my-timetable",
      icon: Calendar,
      group: "Academic"
    }
  ]
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();

  const items = navigationItems[mockUserRole as keyof typeof navigationItems] || navigationItems.student;

  // Group items by their group property
  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.group]) {
      acc[item.group] = [];
    }
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  const isActive = (path: string) => currentPath === path;

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50";

  return (
    <Sidebar className={`sticky top-0 h-screen ${collapsed ? "w-14" : "w-64"}`}>
      {/* Logo Section */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <img 
            src={pcuLogo} 
            alt="PCU Logo" 
            className="h-8 w-8 flex-shrink-0"
          />
          {!collapsed && (
            <div>
              <h2 className="font-semibold text-sm">PCU Timetable</h2>
              <p className="text-xs text-muted-foreground">Management System</p>
            </div>
          )}
        </div>
      </div>
      
      <SidebarContent className="overflow-y-auto">
        {Object.entries(groupedItems).map(([groupName, groupItems]) => (
          <SidebarGroup key={groupName}>
            {!collapsed && <SidebarGroupLabel>{groupName}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {groupItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={getNavClassName}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className="h-4 w-4 flex-shrink-0" />
                        {!collapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant="ghost"
                onClick={signOut}
                className="w-full justify-start hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                title={collapsed ? "Logout" : undefined}
              >
                <LogOut className="h-4 w-4 flex-shrink-0" />
                {!collapsed && <span>Logout</span>}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
