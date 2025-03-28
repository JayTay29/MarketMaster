import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LayoutGrid, 
  Type as TypeIcon, 
  Image as ImageIcon, 
  Square, 
  Upload 
} from "lucide-react";
import { useDesignStore } from "@/lib/design-store";

// Template thumbnails
const sidebarTemplates = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1513031300226-c8fb12de9ade?w=150&h=200&fit=crop"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=150&h=200&fit=crop"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=150&h=200&fit=crop"
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=150&h=200&fit=crop"
  }
];

// Text presets with font styles
const textPresets = [
  { id: 1, name: "Heading", fontFamily: "Poppins", fontSize: 64, weight: "bold", content: "Heading" },
  { id: 2, name: "Subheading", fontFamily: "Poppins", fontSize: 36, weight: "medium", content: "Subheading" },
  { id: 3, name: "Body", fontFamily: "Inter", fontSize: 24, weight: "regular", content: "Body text" },
  { id: 4, name: "Caption", fontFamily: "Inter", fontSize: 18, weight: "regular", content: "Caption text" }
];

// Element shapes
const shapes = [
  { id: 1, name: "Rectangle", type: "rect" },
  { id: 2, name: "Circle", type: "circle" },
  { id: 3, name: "Triangle", type: "triangle" },
  { id: 4, name: "Line", type: "line" }
];

export default function EditorSidebar() {
  const [currentTab, setCurrentTab] = useState("templates");
  const { addCanvasObject } = useDesignStore();

  const addText = (preset: typeof textPresets[0]) => {
    addCanvasObject({
      type: "text",
      text: preset.content,
      fontSize: preset.fontSize,
      fontFamily: preset.fontFamily,
      fontWeight: preset.weight,
      top: 200,
      left: 300,
      width: 400,
      textAlign: "center"
    });
  };

  const addShape = (shape: typeof shapes[0]) => {
    // Properties for each shape
    let shapeProps: any = {
      top: 200,
      left: 300,
      fill: "#F3F4F6",
      stroke: "#D1D5DB",
      strokeWidth: 1
    };
    
    // Specific properties for each shape type
    switch (shape.type) {
      case "rect":
        shapeProps = { ...shapeProps, width: 200, height: 150 };
        break;
      case "circle":
        shapeProps = { ...shapeProps, radius: 75 };
        break;
      case "triangle":
        shapeProps = { ...shapeProps, width: 200, height: 150 };
        break;
      case "line":
        shapeProps = { ...shapeProps, x1: 0, y1: 0, x2: 200, y2: 0, stroke: "#D1D5DB", strokeWidth: 3 };
        break;
    }
    
    addCanvasObject({
      type: shape.type,
      ...shapeProps
    });
  };

  return (
    <div className="w-64 border-r border-gray-200 flex flex-col bg-white">
      <Tabs defaultValue="templates" value={currentTab} onValueChange={setCurrentTab}>
        <div className="p-4 border-b border-gray-200">
          <TabsList className="grid grid-cols-1 gap-1">
            <TabButton 
              value="templates" 
              isActive={currentTab === "templates"} 
              icon={<LayoutGrid className="h-5 w-5" />} 
              label="Templates" 
            />
            <TabButton 
              value="text" 
              isActive={currentTab === "text"} 
              icon={<TypeIcon className="h-5 w-5" />} 
              label="Text" 
            />
            <TabButton 
              value="images" 
              isActive={currentTab === "images"} 
              icon={<ImageIcon className="h-5 w-5" />} 
              label="Images" 
            />
            <TabButton 
              value="elements" 
              isActive={currentTab === "elements"} 
              icon={<Square className="h-5 w-5" />} 
              label="Elements" 
            />
            <TabButton 
              value="uploads" 
              isActive={currentTab === "uploads"} 
              icon={<Upload className="h-5 w-5" />} 
              label="Uploads" 
            />
          </TabsList>
        </div>

        <div className="overflow-y-auto flex-grow p-4">
          <TabsContent value="templates" className="mt-0">
            <h3 className="font-medium text-gray-900 mb-3">Signboard Templates</h3>
            <div className="grid grid-cols-2 gap-3">
              {sidebarTemplates.map((template) => (
                <div 
                  key={template.id}
                  className="rounded-lg overflow-hidden cursor-pointer border border-gray-200 hover:border-primary transition-colors"
                >
                  <img 
                    src={template.image} 
                    alt="Template thumbnail" 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="text" className="mt-0">
            <h3 className="font-medium text-gray-900 mb-3">Add Text</h3>
            <div className="flex flex-col space-y-3">
              {textPresets.map((preset) => (
                <div 
                  key={preset.id}
                  className="p-3 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-colors"
                  onClick={() => addText(preset)}
                >
                  <div 
                    className="truncate" 
                    style={{ 
                      fontFamily: preset.fontFamily, 
                      fontSize: `${Math.min(preset.fontSize / 2, 24)}px`,
                      fontWeight: preset.weight === "bold" ? 700 : preset.weight === "medium" ? 500 : 400 
                    }}
                  >
                    {preset.content}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {preset.fontFamily}, {preset.fontSize}px, {preset.weight}
                  </div>
                </div>
              ))}
              <Button 
                variant="outline" 
                className="w-full mt-2"
                onClick={() => addText(textPresets[2])} // Add default body text
              >
                Add Custom Text
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="elements" className="mt-0">
            <h3 className="font-medium text-gray-900 mb-3">Shapes</h3>
            <div className="grid grid-cols-2 gap-3">
              {shapes.map((shape) => (
                <div 
                  key={shape.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary cursor-pointer transition-colors flex items-center justify-center"
                  onClick={() => addShape(shape)}
                >
                  {shape.type === "rect" && (
                    <div className="w-16 h-12 bg-gray-100 border border-gray-300"></div>
                  )}
                  {shape.type === "circle" && (
                    <div className="w-12 h-12 bg-gray-100 border border-gray-300 rounded-full"></div>
                  )}
                  {shape.type === "triangle" && (
                    <div className="w-0 h-0 border-left-12 border-right-12 border-bottom-16 border-transparent border-b-gray-300"></div>
                  )}
                  {shape.type === "line" && (
                    <div className="w-16 h-1 bg-gray-300"></div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="images" className="mt-0">
            <h3 className="font-medium text-gray-900 mb-3">Stock Images</h3>
            <div className="grid grid-cols-2 gap-3">
              {/* Would connect to a stock image API in a real app */}
              <div className="rounded-lg overflow-hidden cursor-pointer border border-gray-200 hover:border-primary transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=150&h=150&fit=crop" 
                  alt="Stock image" 
                  className="w-full aspect-square object-cover" 
                />
              </div>
              <div className="rounded-lg overflow-hidden cursor-pointer border border-gray-200 hover:border-primary transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1557264322-b44d383a2906?w=150&h=150&fit=crop" 
                  alt="Stock image" 
                  className="w-full aspect-square object-cover" 
                />
              </div>
              <div className="rounded-lg overflow-hidden cursor-pointer border border-gray-200 hover:border-primary transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1560253546-4132ca9f4ee6?w=150&h=150&fit=crop" 
                  alt="Stock image" 
                  className="w-full aspect-square object-cover" 
                />
              </div>
              <div className="rounded-lg overflow-hidden cursor-pointer border border-gray-200 hover:border-primary transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=150&h=150&fit=crop" 
                  alt="Stock image" 
                  className="w-full aspect-square object-cover" 
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="uploads" className="mt-0">
            <h3 className="font-medium text-gray-900 mb-3">Your Uploads</h3>
            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
              <Upload className="h-8 w-8 mx-auto text-gray-400" />
              <p className="text-gray-500 mt-2">Drag and drop files here</p>
              <Button variant="outline" size="sm" className="mt-3">
                Upload Files
              </Button>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

interface TabButtonProps {
  value: string;
  isActive: boolean;
  icon: React.ReactNode;
  label: string;
}

function TabButton({ value, isActive, icon, label }: TabButtonProps) {
  return (
    <TabsTrigger
      value={value}
      className={`flex items-center space-x-3 p-2 rounded-lg text-left ${
        isActive ? "bg-gray-100 text-gray-900" : "text-gray-400 hover:text-gray-900 hover:bg-gray-50"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </TabsTrigger>
  );
}
