import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { HelpCircle, BellIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [location] = useLocation();

  const isEditorPage = location.startsWith("/editor");

  // Hide navbar on editor page to maximize space
  if (isEditorPage) {
    return null;
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-10">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h1 className="text-xl font-semibold font-poppins text-gray-900">DesignPlatform</h1>
          </div>
        </Link>
        
        <div className="hidden md:flex space-x-6">
          <NavLink href="/" label="Dashboard" isActive={location === "/"} />
          <NavLink href="/templates/signboard" label="Templates" isActive={location.includes("/templates")} />
          <NavLink href="/projects" label="Projects" isActive={location.includes("/projects")} />
          <NavLink href="/elements" label="Elements" isActive={location.includes("/elements")} />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="icon">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="outline" size="icon">
          <BellIcon className="h-5 w-5" />
        </Button>
        <Avatar>
          <AvatarFallback className="bg-primary text-white">JS</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  label: string;
  isActive: boolean;
}

function NavLink({ href, label, isActive }: NavLinkProps) {
  return (
    <Link href={href}>
      <a className={cn(
        "px-1 py-2 text-sm font-medium font-inter transition-colors",
        isActive 
          ? "text-primary border-b-2 border-primary" 
          : "text-gray-400 hover:text-gray-900"
      )}>
        {label}
      </a>
    </Link>
  );
}
