import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useLocation } from "wouter";
import { Design } from "@shared/schema";
import { useDesignStore } from "@/lib/design-store";
import { Skeleton } from "@/components/ui/skeleton";

interface TemplatesGridProps {
  designs: Design[];
  category: string;
}

// Sample templates for new designs if no designs exist
const sampleTemplates = [
  {
    id: "new-1",
    name: "For Sale Sign",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=533&fit=crop",
    content: {
      objects: [
        {
          type: "text",
          text: "FOR SALE",
          fontSize: 64,
          fontFamily: "Poppins",
          fontWeight: "bold",
          top: 200,
          left: 300,
          width: 500,
          textAlign: "center"
        },
        {
          type: "text",
          text: "4 BED • 3 BATH • 2 CAR GARAGE",
          fontSize: 24,
          fontFamily: "Inter",
          top: 300,
          left: 300,
          width: 500,
          textAlign: "center"
        },
        {
          type: "text",
          text: "MODERN KITCHEN • POOL • RENOVATED",
          fontSize: 20,
          fontFamily: "Inter",
          fontWeight: "medium",
          top: 380,
          left: 300,
          width: 500,
          textAlign: "center",
          fill: "#FF5C5C"
        },
        {
          type: "text",
          text: "JANE SMITH • 555-123-4567",
          fontSize: 30,
          fontFamily: "Poppins",
          fontWeight: "medium",
          top: 600,
          left: 300,
          width: 500,
          textAlign: "center",
          fill: "#4B4DED"
        }
      ]
    }
  },
  {
    id: "new-2",
    name: "Open House",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=533&fit=crop",
    content: {
      objects: [
        {
          type: "text",
          text: "OPEN HOUSE",
          fontSize: 72,
          fontFamily: "Poppins",
          fontWeight: "bold",
          top: 150,
          left: 300,
          width: 500,
          textAlign: "center"
        },
        {
          type: "text",
          text: "SATURDAY & SUNDAY • 1-4PM",
          fontSize: 48,
          fontFamily: "Poppins",
          fontWeight: "bold",
          top: 300,
          left: 300,
          width: 500,
          textAlign: "center",
          fill: "#FF5C5C"
        }
      ]
    }
  },
  {
    id: "new-3",
    name: "Agent Hours",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=533&fit=crop",
    content: {
      objects: [
        {
          type: "text",
          text: "OFFICE HOURS",
          fontSize: 48,
          fontFamily: "Poppins",
          fontWeight: "bold",
          top: 100,
          left: 300,
          width: 500,
          textAlign: "center"
        },
        {
          type: "text",
          text: "MONDAY - FRIDAY: 9AM - 6PM\nSATURDAY: 10AM - 4PM\nSUNDAY: BY APPOINTMENT",
          fontSize: 24,
          fontFamily: "Inter",
          top: 300,
          left: 300,
          width: 500,
          textAlign: "center",
          lineHeight: 1.5
        }
      ]
    }
  },
  {
    id: "new-4",
    name: "Just Listed",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=533&fit=crop",
    content: {
      objects: [
        {
          type: "text",
          text: "JUST LISTED",
          fontSize: 64,
          fontFamily: "Poppins",
          fontWeight: "bold",
          top: 100,
          left: 300,
          width: 500,
          textAlign: "center"
        }
      ]
    }
  }
];

export default function TemplatesGrid({ designs, category }: TemplatesGridProps) {
  const [, navigate] = useLocation();
  const { setCanvasProps, setCanvasObjects } = useDesignStore();

  // Use sample templates if no designs exist
  const templatesForDisplay = designs.length > 0 
    ? designs 
    : sampleTemplates.map(template => ({
        id: 0, // Will create a new design
        name: template.name,
        category: category,
        content: template.content,
        width: 600,
        height: 800,
        thumbnail: template.image,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

  const handleTemplateClick = (design: Design) => {
    // Set up the canvas with this template's properties
    setCanvasProps({
      width: design.width,
      height: design.height,
      category: design.category
    });
    
    // Set the canvas objects
    if (design.content && design.content.objects) {
      setCanvasObjects(design.content.objects);
    }
    
    // Navigate to editor (if design.id is 0, it's a new design based on a template)
    if (design.id === 0) {
      navigate("/editor");
    } else {
      navigate(`/editor/${design.id}`);
    }
  };

  if (!templatesForDisplay || templatesForDisplay.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {templatesForDisplay.map((design) => (
        <Card 
          key={design.id || design.name}
          className="overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-200 hover:-translate-y-1 cursor-pointer"
          onClick={() => handleTemplateClick(design)}
        >
          <AspectRatio ratio={1} className="rounded-t-xl overflow-hidden">
            {design.thumbnail ? (
              <img 
                src={design.thumbnail} 
                alt={design.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">{design.name}</span>
              </div>
            )}
          </AspectRatio>
          <CardContent className="p-3">
            <h3 className="font-medium text-gray-900 text-sm">{design.name}</h3>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
