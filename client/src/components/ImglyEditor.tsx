import React, { useEffect, useRef, useState } from 'react';
import CreativeEditorSDK from '@cesdk/cesdk-js';
import { Design } from '@shared/schema';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

interface ImglyEditorProps {
  design: Design;
  onSave?: (updatedDesign: Design) => void;
  className?: string;
}

export default function ImglyEditor({ design, onSave, className }: ImglyEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [cesdkInstance, setCesdkInstance] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!editorRef.current) return;
    
    // Only initialize once
    if (cesdkInstance) return;

    setIsLoading(true);

    // Initialize the Creative Editor SDK
    const initializeEditor = async () => {
      try {
        const config = {
          // Set a license file or use environment variable
          license: import.meta.env.VITE_IMGLY_LICENSE || '',
          callbacks: {
            onExport: (blob: Blob) => {
              console.log('Design exported:', blob);
              // You can add additional export handling here
            },
            onSave: async () => {
              if (cesdkInstance) {
                try {
                  // Get the current scene as JSON
                  const scene = await cesdkInstance.scene.exportToJSON();
                  
                  // Transform scene to match our Design content structure
                  const updatedDesign = {
                    ...design,
                    content: {
                      objects: scene.blocks || [],
                      ...scene
                    }
                  };
                  
                  // Call onSave callback if provided
                  if (onSave) {
                    onSave(updatedDesign);
                  }
                  
                  toast({
                    title: "Design saved",
                    description: "Your design has been saved successfully."
                  });
                } catch (error) {
                  console.error('Error saving design:', error);
                  toast({
                    title: "Save failed",
                    description: "There was an error saving your design.",
                    variant: "destructive"
                  });
                }
              }
            }
          },
          ui: {
            elements: {
              navigation: {
                action: {
                  export: true,
                  save: true,
                  download: true,
                  close: true
                }
              },
              panels: {
                inspector: true,
                assetLibrary: true,
                textDesign: true
              },
              libraries: {
                shapes: true,
                stickers: true,
                text: true,
                templates: true,
                uploads: true
              }
            }
          },
          // Any additional configuration
          canvas: {
            width: design.width,
            height: design.height
          }
        };

        // Create the editor instance using the official CreativeEditorSDK.create method
        const instance = await CreativeEditorSDK.create(editorRef.current, config);
        setCesdkInstance(instance);

        // Import the design content if it exists
        if (design.content) {
          try {
            // Convert our content format to CE.SDK format if needed
            const content = typeof design.content === 'string' 
              ? JSON.parse(design.content) 
              : design.content;
              
            // Load the scene
            if (content.objects && Array.isArray(content.objects)) {
              // If our format has objects array, we need to convert it
              await instance.scene.importFromJSON({
                blocks: content.objects,
                ...content
              });
            } else {
              // Otherwise try to load directly
              await instance.scene.importFromJSON(content);
            }
          } catch (error) {
            console.error('Error loading design content:', error);
            toast({
              title: "Load error",
              description: "Could not load the design content.",
              variant: "destructive"
            });
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing CE.SDK:', error);
        toast({
          title: "Editor initialization failed",
          description: "Could not load the image editor.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };

    initializeEditor();

    // Cleanup function
    return () => {
      if (cesdkInstance) {
        cesdkInstance.dispose();
        setCesdkInstance(null);
      }
    };
  }, [design.id]); // Only re-initialize if design.id changes

  return (
    <div className={cn("w-full h-full", className)}>
      {isLoading && (
        <div className="w-full h-full flex items-center justify-center">
          <div className="space-y-4 w-full">
            <Skeleton className="h-[60vh] w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      )}
      <div 
        ref={editorRef} 
        className={cn(
          "w-full h-[70vh] min-h-[500px] border rounded-md", 
          isLoading ? "hidden" : "block"
        )}
      />
    </div>
  );
}