import { Calendar, Users, Clock, BookOpen, Settings, BarChart3, Download, Home } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

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
      title: "Courses",
      url: "/courses",
      icon: BookOpen,
      group: "Management"
    },
    {
      title: "Lecturers",
      url: "/lecturers",
      icon: Users,
      group: "Management"
    },
    {
      title: "Departments",
      url: "/departments",
      icon: BarChart3,
      group: "Management"
    },
    {
      title: "Time Slots",
      url: "/time-slots",
      icon: Clock,
      group: "Management"
    },
    {
      title: "Analytics",
      url: "/analytics", 
      icon: BarChart3,
      group: "Analytics"
    },
    {
      title: "Reports",
      url: "/reports",
      icon: Download,
      group: "Analytics"
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings,
      group: "System"
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
    },
    {
      title: "My Courses",
      url: "/my-courses",
      icon: BookOpen,
      group: "Teaching"
    },
    {
      title: "Time Preferences",
      url: "/preferences",
      icon: Clock,
      group: "Settings"
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
    },
    {
      title: "Course Schedule",
      url: "/course-schedule",
      icon: BookOpen,
      group: "Academic"
    },
    {
      title: "Download PDF",
      url: "/download",
      icon: Download,
      group: "Tools"
    }
  ]
};

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

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
    <Sidebar className={collapsed ? "w-14" : "w-64"}>
      <SidebarContent>
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
    </Sidebar>
  );
}