import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Share2, Download, Undo, Redo } from "lucide-react";
import EditorSidebar from "@/components/EditorSidebar";
import EditorCanvas from "@/components/EditorCanvas";
import EditorProperties from "@/components/EditorProperties";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useDesignStore } from "@/lib/design-store";

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
    if (design) {
      setDesignName(design.name);
      setCanvasProps({
        width: design.width,
        height: design.height,
        category: design.category
      });
      if (design.content && typeof design.content === 'object' && 'objects' in design.content) {
        setCanvasObjects(design.content.objects || []);
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

      {/* Editor Content */}
      <div className="flex-grow flex h-full">
        {/* Left Sidebar */}
        <EditorSidebar />

        {/* Canvas Area */}
        <div className="flex-grow relative">
          <div className="absolute inset-0 overflow-auto bg-gray-50 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2720%27%20height%3D%2720%27%20viewBox%3D%270%200%2020%2020%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27%23000000%27%20fill-opacity%3D%270.05%27%20fill-rule%3D%27evenodd%27%3E%3Ccircle%20cx%3D%273%27%20cy%3D%273%27%20r%3D%271%27%2F%3E%3Ccircle%20cx%3D%2713%27%20cy%3D%2713%27%20r%3D%271%27%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] flex items-center justify-center">
            <EditorCanvas 
              width={canvasProps.width} 
              height={canvasProps.height} 
              isLoading={canvasMode === 'loading'}
            />
          </div>
        </div>

        {/* Right Sidebar - Properties Panel */}
        <EditorProperties />
      </div>
    </div>
  );
}
