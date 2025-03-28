import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { Design } from "@shared/schema";

interface RecentProjectsProps {
  designs: Design[];
}

export default function RecentProjects({ designs }: RecentProjectsProps) {
  const [, navigate] = useLocation();

  // Only show the most recent 4 designs
  const recentDesigns = designs.slice(0, 4);
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "signboard": return "Signboard";
      case "brochure": return "Brochure";
      case "flyer": return "DL Flyer";
      default: return category;
    }
  };
  
  const getRelativeTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleEditDesign = (id: number) => {
    navigate(`/editor/${id}`);
  };

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold font-poppins">Recent Projects</h2>
        <a href="#" className="text-primary text-sm font-medium hover:underline">View all</a>
      </div>
      
      {recentDesigns.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-400">No recent projects. Create a new design to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recentDesigns.map((design) => (
            <Card 
              key={design.id} 
              className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-200"
            >
              <div className="relative">
                <AspectRatio ratio={16/9}>
                  {/* Use a placeholder color if no thumbnail */}
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    {design.thumbnail ? (
                      <img 
                        src={design.thumbnail} 
                        alt={`${design.name} thumbnail`} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-medium">{design.name}</span>
                    )}
                  </div>
                </AspectRatio>
                <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-all flex items-center justify-center">
                  <Button 
                    variant="secondary" 
                    onClick={() => handleEditDesign(design.id)}
                    className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 hover:bg-gray-50"
                  >
                    Edit Design
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{design.name}</h3>
                <p className="text-gray-400 text-sm">Modified {getRelativeTime(design.updatedAt)}</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="outline" className="text-xs font-medium bg-gray-100 text-gray-500 hover:bg-gray-100">
                    {getCategoryLabel(design.category)}
                  </Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
