import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Images, 
  FolderOpen, 
} from "lucide-react";
import { ReactNode } from "react";

import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarInset
} from "@/components/ui/sidebar";

interface NavbarProps {
  children?: ReactNode;
}

export default function Navbar({ children }: NavbarProps) {
  const [location] = useLocation();

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex items-center pb-4">
            <Link href="/">
              <div className="flex items-center space-x-2 px-2 cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h1 className="text-xl font-semibold font-poppins text-gray-900">DesignPlatform</h1>
              </div>
            </Link>
            <div className="ml-auto">
              <SidebarTrigger />
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/">
                  <SidebarMenuButton 
                    asChild
                    data-active={location === "/"} 
                  >
                    <div className="flex items-center">
                      <LayoutDashboard className="h-5 w-5 mr-3" />
                      <span>Dashboard</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <Link href="/templates/signboard">
                  <SidebarMenuButton 
                    asChild
                    data-active={location.includes("/templates")}
                  >
                    <div className="flex items-center">
                      <Images className="h-5 w-5 mr-3" />
                      <span>Templates</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <Link href="/projects">
                  <SidebarMenuButton 
                    asChild
                    data-active={location.includes("/projects")}
                  >
                    <div className="flex items-center">
                      <FolderOpen className="h-5 w-5 mr-3" />
                      <span>Projects</span>
                    </div>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarRail />
        
        {/* Main Content Area */}
        <SidebarInset className="overflow-auto">
          {/* Mobile Header */}
          <div className="flex items-center h-14 border-b border-gray-200 px-4 md:hidden">
            <SidebarTrigger />
            <Link href="/">
              <div className="flex items-center ml-3">
                <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            </Link>
          </div>
          
          {/* Main content */}
          <div className="p-6">
            {children}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
