import { useEffect, useRef, useState } from 'react';
import { Design } from '@shared/schema';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Image, Type, Box, Square, Edit, Save } from 'lucide-react';

interface ImglyEditorProps {
  design: Design;
  onSave?: (updatedDesign: Design) => void;
  className?: string;
}

export default function ImglyEditor({ design, onSave, className }: ImglyEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editorMode, setEditorMode] = useState<'loading' | 'advanced' | 'basic' | 'error'>('loading');
  const [engineInstance, setEngineInstance] = useState<any>(null);
  const { toast } = useToast();

  // Basic editor state
  const [basicEditorContent, setBasicEditorContent] = useState<{
    title: string;
    description: string;
    backgroundColor: string;
  }>({
    title: design.name || 'Real Estate Property',
    description: 'Add property description here',
    backgroundColor: '#4B4DED'
  });

  // Initialize the editor
  useEffect(() => {
    if (!editorRef.current) return;
    
    const container = editorRef.current;
    let engine: any = null;
    
    // Try to load the advanced editor
    const loadEditor = async () => {
      try {
        setIsLoading(true);
        
        try {
          // Dynamic import of the Creative Engine
          const { default: CreativeEngine, supportsWasm } = await import(
            'https://cdn.img.ly/packages/imgly/cesdk-engine/1.47.0/index.js'
          );
          
          if (!supportsWasm()) {
            console.warn("WebAssembly not supported, falling back to basic editor");
            setEditorMode('basic');
            setIsLoading(false);
            return;
          }
          
          // Configuration with the license
          const config = {
            license: 'mtLT-_GJwMhE7LDnO8KKEma7qSuzWuDxiKuQcxHKmz3fjaXWY2lT3o3Z2VdL5twm',
            userId: 'real-estate-editor-user',
            baseURL: 'https://cdn.img.ly/packages/imgly/cesdk-engine/1.47.0/assets'
          };
          
          // Initialize the engine
          engine = await CreativeEngine.init(config);
          setEngineInstance(engine);
          
          // Append the editor to our container
          container.appendChild(engine.element);
          
          // Add default asset sources
          await engine.addDefaultAssetSources();
          
          // Load a default template
          await engine.scene.loadFromURL(
            'https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene'
          );
          
          // Set up a save handler
          engine.editor.onSave = async () => {
            if (onSave) {
              try {
                // Export the scene as JSON
                const sceneData = await engine.scene.saveToJSON();
                
                // Update the design with new content
                const updatedDesign = {
                  ...design,
                  content: { scene: sceneData }
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
          };
          
          setEditorMode('advanced');
          setIsLoading(false);
        } catch (error) {
          console.error('WebAssembly or memory error, falling back to basic editor:', error);
          setEditorMode('basic');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing Creative Engine:', error);
        toast({
          title: "Editor initialization failed",
          description: "Could not load the image editor. Using simplified editor instead.",
          variant: "destructive"
        });
        setEditorMode('basic');
        setIsLoading(false);
      }
    };
    
    loadEditor();
    
    // Cleanup function
    return () => {
      if (engine) {
        // Remove the element from DOM
        if (engine.element && engine.element.parentNode) {
          engine.element.remove();
        }
        
        // Dispose of the engine
        engine.dispose();
        setEngineInstance(null);
      }
    };
  }, [design.id, onSave, toast]);

  // Basic editor save handler
  const handleBasicSave = () => {
    if (onSave) {
      // Create a simplified content structure for the basic editor
      const updatedDesign = {
        ...design,
        content: {
          objects: [
            {
              type: 'rect',
              width: design.width || 800,
              height: design.height || 600,
              fill: basicEditorContent.backgroundColor,
              left: 0,
              top: 0
            },
            {
              type: 'text',
              text: basicEditorContent.title,
              fontSize: 36,
              fontWeight: 'bold',
              fill: '#FFFFFF',
              left: 50,
              top: 50,
              width: (design.width || 800) - 100
            },
            {
              type: 'text',
              text: basicEditorContent.description,
              fontSize: 18,
              fill: '#FFFFFF',
              left: 50,
              top: 120,
              width: (design.width || 800) - 100
            }
          ]
        }
      };
      
      onSave(updatedDesign);
      
      toast({
        title: "Design saved",
        description: "Your changes have been saved successfully."
      });
    }
  };

  // Render the appropriate editor mode
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
      
      {editorMode === 'advanced' && (
        <div 
          ref={editorRef}
          id="cesdk_container" 
          className="w-full h-[70vh] min-h-[500px] border rounded-md overflow-hidden"
        />
      )}
      
      {editorMode === 'basic' && (
        <div className="w-full h-[70vh] min-h-[500px] border rounded-md overflow-hidden bg-white p-6">
          <div className="flex flex-col h-full">
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Simple Editor Mode</h2>
              <p className="text-sm text-gray-500">
                The advanced editor could not be loaded. You can still create a simple design using this editor.
              </p>
            </div>
            
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Editor controls */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                  <div className="flex items-center">
                    <Type className="h-4 w-4 mr-2 text-gray-400" />
                    <input
                      id="title"
                      type="text"
                      value={basicEditorContent.title}
                      onChange={(e) => setBasicEditorContent(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                  <div className="flex items-start">
                    <Edit className="h-4 w-4 mr-2 mt-2 text-gray-400" />
                    <textarea
                      id="description"
                      value={basicEditorContent.description}
                      onChange={(e) => setBasicEditorContent(prev => ({ ...prev, description: e.target.value }))}
                      rows={5}
                      className="w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="bgColor" className="block text-sm font-medium mb-1">Background Color</label>
                  <div className="flex items-center">
                    <Square className="h-4 w-4 mr-2 text-gray-400" />
                    <input
                      id="bgColor"
                      type="color"
                      value={basicEditorContent.backgroundColor}
                      onChange={(e) => setBasicEditorContent(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="w-12 h-10"
                    />
                    <input
                      type="text"
                      value={basicEditorContent.backgroundColor}
                      onChange={(e) => setBasicEditorContent(prev => ({ ...prev, backgroundColor: e.target.value }))}
                      className="ml-2 w-24 rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>
                
                <Button 
                  onClick={handleBasicSave} 
                  className="mt-4"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Design
                </Button>
              </div>
              
              {/* Preview */}
              <div className="border rounded-md p-4 h-full">
                <div className="h-full w-full relative">
                  <div
                    style={{ 
                      backgroundColor: basicEditorContent.backgroundColor,
                      width: '100%',
                      height: '100%',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      color: '#FFFFFF'
                    }}
                  >
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>
                      {basicEditorContent.title}
                    </h1>
                    <p style={{ fontSize: '14px' }}>
                      {basicEditorContent.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {editorMode === 'error' && (
        <div className="w-full h-[70vh] min-h-[500px] border rounded-md bg-white p-6 flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <Box className="h-16 w-16 mx-auto mb-4" />
              <h2 className="text-xl font-bold">Editor Unavailable</h2>
            </div>
            <p className="mb-4 text-gray-600 max-w-md mx-auto">
              We couldn't load the design editor in your browser. This might be due to WebAssembly 
              compatibility issues or limited memory resources.
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}