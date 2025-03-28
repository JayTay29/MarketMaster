
import { Link, useLocation } from "wouter";
import { LayoutDashboard, FolderKanban, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();

  const isEditorPage = location.startsWith("/editor");

  // Hide navbar on editor page to maximize space
  if (isEditorPage) {
    return null;
  }

  return (
    <nav className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="p-4 border-b border-gray-200">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h1 className="text-xl font-semibold font-poppins text-gray-900">Marketing Centre</h1>
          </div>
        </Link>
      </div>
      
      <div className="flex flex-col space-y-1 p-4">
        <NavLink 
          href="/" 
          label="Dashboard" 
          icon={<LayoutDashboard className="h-5 w-5" />}
          isActive={location === "/"} 
        />
        <NavLink 
          href="/projects" 
          label="Projects" 
          icon={<FolderKanban className="h-5 w-5" />}
          isActive={location.includes("/projects")} 
        />
        <NavLink 
          href="/templates/signboard" 
          label="Templates" 
          icon={<LayoutTemplate className="h-5 w-5" />}
          isActive={location.includes("/templates")} 
        />
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

function NavLink({ href, label, icon, isActive }: NavLinkProps) {
  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer transition-colors",
        isActive 
          ? "bg-primary text-white" 
          : "text-gray-600 hover:bg-gray-100"
      )}>
        {icon}
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
}
