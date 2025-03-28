import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Share2, Download, Undo, Redo } from "lucide-react";
import ImglyEditor from "@/components/ImglyEditor";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useDesignStore } from "@/lib/design-store";
import { Design } from "@shared/schema";

export default function Editor() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [designName, setDesignName] = useState<string>("Untitled Design");
  const [canvasMode, setCanvasMode] = useState<'loading' | 'editing' | 'saving'>('loading');
  const { setCanvasObjects, canvasProps, setCanvasProps, selectedElement, canvasObjects } = useDesignStore();

  // Fetch design data if editing an existing design
  const { data: design, isLoading } = useQuery({
    queryKey: ['/api/designs', id],
    enabled: !!id,
  });

  // Save design mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      const designData = {
        name: designName,
        category: canvasProps.category || "signboard",
        content: { objects: canvasObjects, background: "#ffffff" },
        width: canvasProps.width,
        height: canvasProps.height,
        thumbnail: "" // In a real app, we'd generate a thumbnail
      };

      if (id) {
        // Update existing design
        return apiRequest("PATCH", `/api/designs/${id}`, designData);
      } else {
        // Create new design
        return apiRequest("POST", "/api/designs", designData);
      }
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Design saved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/designs'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save design: ${error}`,
        variant: "destructive",
      });
    }
  });

  // Initialize canvas with design data or default values
  useEffect(() => {
    if (design && typeof design === 'object' && 'name' in design) {
      setDesignName(design.name);
      setCanvasProps({
        width: design.width || 800,
        height: design.height || 600,
        category: design.category || 'signboard'
      });
      if (design.content && typeof design.content === 'object' && 'objects' in design.content) {
        setCanvasObjects(Array.isArray(design.content.objects) ? design.content.objects : []);
      } else {
        setCanvasObjects([]);
      }
      setCanvasMode('editing');
    } else if (!isLoading && !id) {
      // New design with default values
      setCanvasMode('editing');
    }
  }, [design, isLoading, id, setCanvasProps, setCanvasObjects]);

  const handleSave = () => {
    setCanvasMode('saving');
    saveMutation.mutate();
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDesignName(e.target.value);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Editor Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBack}
            className="mr-3 text-gray-400 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="mr-6">
            <Input
              type="text"
              value={designName}
              onChange={handleNameChange}
              className="font-medium text-gray-900 border-none hover:border-b focus:border-b focus:border-primary"
            />
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="text-gray-900" disabled>
              <Undo className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="text-gray-900 opacity-50" disabled>
              <Redo className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            size="sm" 
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Editor Content - img.ly CE.SDK Editor */}
      <div className="flex-grow flex flex-col h-full">
        {isLoading && (
          <div className="flex-grow flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="text-lg font-semibold">Loading design...</div>
            </div>
          </div>
        )}
        
        {!isLoading && design && (
          <ImglyEditor 
            design={design} 
            onSave={(updatedDesign) => {
              // Update local state
              setDesignName(updatedDesign.name);
              if (updatedDesign.content) {
                if (typeof updatedDesign.content === 'object' && 'objects' in updatedDesign.content) {
                  setCanvasObjects(updatedDesign.content.objects || []);
                }
              }
              
              // Save to server
              setCanvasMode('saving');
              saveMutation.mutate();
            }}
            className="flex-grow"
          />
        )}
        
        {!isLoading && !design && !id && (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center">
              <div className="text-lg font-semibold">Create a new design</div>
              <div className="mt-4">
                <Button 
                  onClick={() => {
                    // Create a default design for new designs
                    const defaultDesign: Design = {
                      id: 0, // This will be assigned by the server
                      name: designName,
                      category: canvasProps.category || "signboard",
                      subcategory: "all",
                      content: { objects: [] },
                      width: canvasProps.width || 800,
                      height: canvasProps.height || 600,
                      thumbnail: null,
                      createdAt: new Date(),
                      updatedAt: new Date(),
                    };
                    
                    // Create the design 
                    saveMutation.mutate();
                  }}
                >
                  Start with blank canvas
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
