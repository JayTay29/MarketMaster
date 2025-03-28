import { useEffect, useRef, useState } from 'react';
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
  const [instance, setInstance] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    let cesdk: any = null;
    
    const initEditor = async () => {
      if (!editorRef.current) return;
      
      try {
        // Basic configuration for the CE.SDK
        const config = {
          license: import.meta.env.VITE_IMGLY_LICENSE || '',
          ui: {
            elements: {
              navigation: {
                action: {
                  export: true,
                  save: true,
                  download: true
                }
              },
              panels: {
                inspector: true
              }
            }
          },
          baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-js/1.19.0/assets'
        };
        
        // Create the editor
        cesdk = await CreativeEditorSDK.create(editorRef.current, config);
        setInstance(cesdk);
        
        // Add demo assets
        await cesdk.addDefaultAssetSources();
        await cesdk.addDemoAssetSources({ sceneMode: 'Design' });
        
        // Create a default scene
        await cesdk.createDesignScene();
        
        // Set up save handler
        cesdk.engine.on('document.save', async () => {
          if (onSave) {
            try {
              // Export the design as JSON
              const blob = await cesdk.export('json');
              const sceneData = typeof blob === 'string' ? JSON.parse(blob) : blob;
              
              // Update the design with new content
              const updatedDesign = {
                ...design,
                content: sceneData
              };
              
              onSave(updatedDesign);
              
              toast({
                title: "Design saved",
                description: "Your changes have been saved successfully."
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
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Creative Editor SDK:', error);
        toast({
          title: "Editor initialization failed",
          description: "Could not load the image editor.",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    initEditor();
    
    // Cleanup
    return () => {
      if (cesdk) {
        cesdk.dispose();
      }
    };
  }, [design.id, onSave, toast]);

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