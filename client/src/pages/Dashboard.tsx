import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import RecentProjects from "@/components/RecentProjects";
import TemplateCategories from "@/components/TemplateCategories";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusIcon, FilterIcon } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  
  const { data: designs, isLoading, error } = useQuery({
    queryKey: ['/api/designs'],
  });

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load designs. Please try again.",
      variant: "destructive",
    });
  }

  const handleCreateNew = () => {
    navigate("/templates/signboard");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-poppins text-text">Dashboard</h1>
          <p className="text-gray-400 mt-1">Create and manage your design projects</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Button variant="outline" size="sm" className="text-gray-500">
            <FilterIcon className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button onClick={handleCreateNew} size="sm">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create New
          </Button>
        </div>
      </div>

      {/* Recent Projects Section */}
      {isLoading ? (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-xl" />
            ))}
          </div>
        </div>
      ) : (
        <RecentProjects designs={designs || []} />
      )}

      {/* Template Categories Section */}
      <TemplateCategories />

      {/* Removed Tutorials Section */}
    </div>
  );
}
