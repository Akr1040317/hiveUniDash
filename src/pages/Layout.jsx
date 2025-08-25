
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  Bug, 
  Zap, 
  Calendar,
  ChevronDown,
  LogOut
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Content",
    url: createPageUrl("Content"),
    icon: FileText,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: BarChart3,
  },
  {
    title: "Bug Tracker",
    url: createPageUrl("Bugs"),
    icon: Bug,
  },
  {
    title: "Roadmap",
    url: createPageUrl("Features"),
    icon: Zap,
  },
  {
    title: "Calendar",
    url: createPageUrl("Calendar"),
    icon: Calendar,
  }
];

export default function Layout({ children, currentPageName, currentRegion, user, onSignOut }) {
  const location = useLocation();
  const [localRegion, setLocalRegion] = useState(currentRegion || "us");

  useEffect(() => {
    // Apply dark theme globally
    document.documentElement.classList.add('dark');
    
    // Update local region when prop changes
    if (currentRegion) {
      setLocalRegion(currentRegion);
    }
  }, [currentRegion]);

  const handleRegionChange = (region) => {
    setLocalRegion(region);
    localStorage.setItem('hive_region', region);
    window.location.reload();
  };

  const handleLogout = () => {
    onSignOut();
  };

  const regionInfo = {
    us: {
      name: "United States",
      subtitle: "Scripps Bee",
      color: "bg-blue-400"
    },
    dubai: {
      name: "UAE Prepcenter",
      subtitle: "UAE Bee",
      color: "bg-amber-400"
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-900 text-gray-200">
        <Sidebar className="border-r border-gray-700/50 bg-gray-900">
          <SidebarHeader className="border-b border-gray-700/50 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🐝</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Hive</h2>
                <p className="text-sm text-gray-400">Team Dashboard</p>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-auto py-2 bg-gray-800 border-gray-700 hover:bg-gray-700">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${regionInfo[localRegion].color}`} />
                    <div className="text-left">
                      <div className="font-semibold text-white text-sm">{regionInfo[localRegion].name}</div>
                      <div className="text-xs text-gray-400">{regionInfo[localRegion].subtitle}</div>
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 bg-gray-800 border-gray-700 text-white">
                <DropdownMenuItem onClick={() => handleRegionChange("us")} className="focus:bg-gray-700">
                  United States
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRegionChange("dubai")} className="focus:bg-gray-700">
                  Dubai
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarHeader>
          
          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`group transition-all duration-200 rounded-lg p-0 ${
                          location.pathname === item.url 
                          ? 'bg-amber-500/10 text-amber-400' 
                          : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-3 py-2.5">
                          <item.icon className={`w-5 h-5 transition-colors ${
                            location.pathname === item.url ? 'text-amber-400' : 'text-gray-500 group-hover:text-white'
                          }`} />
                          <span className="font-medium text-sm">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-700/50 p-4">
            {user && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback className="bg-amber-500 text-white font-bold">
                      {user.full_name?.[0] || user.email?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {user.full_name || user.email}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">{user.role}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-500"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col bg-gray-900/95">
          <header className="bg-gray-900 border-b border-gray-700/50 px-6 py-4 md:hidden">
            <div className="flex items-center justify-between">
              <SidebarTrigger className="hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-lg font-semibold text-white">Hive Dashboard</h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
