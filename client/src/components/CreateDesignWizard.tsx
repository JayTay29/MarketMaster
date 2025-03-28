import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, ArrowRight, Building2, Home, Newspaper, FileText } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Design } from "@shared/schema";
import { Property, properties } from "@/lib/mockProperties";
import { useDesignStore } from "@/lib/design-store";
import { Skeleton } from "@/components/ui/skeleton";

interface CreateDesignWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const templateCategories = [
  {
    id: "signboard",
    title: "Real Estate Signboards",
    icon: <Building2 className="h-5 w-5 mr-2" />,
  },
  {
    id: "brochure",
    title: "Property Brochures",
    icon: <FileText className="h-5 w-5 mr-2" />,
  },
  {
    id: "flyer",
    title: "Property Flyers",
    icon: <Newspaper className="h-5 w-5 mr-2" />,
  }
];

export function CreateDesignWizard({ open, onOpenChange }: CreateDesignWizardProps) {
  const [, navigate] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<Design | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  const { setCanvasProps, setCanvasObjects } = useDesignStore();

  // Fetch templates by category
  const { data: categoryTemplates = [], isLoading: templatesLoading } = useQuery({
    queryKey: ['/api/designs/category', selectedCategory],
    queryFn: async () => {
      const response = await fetch(`/api/designs/category?category=${selectedCategory}`);
      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }
      return response.json();
    },
    enabled: selectedCategory !== "",
  });

  // Reset state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCurrentStep(1);
      setSelectedCategory("");
      setSelectedTemplate(null);
      setSelectedProperty(null);
    }
    onOpenChange(open);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep(2);
  };

  const handleTemplateSelect = (template: Design) => {
    setSelectedTemplate(template);
    setCurrentStep(3);
  };
  
  // Type helpers for the content objects
  interface TextObject {
    type: 'text';
    text: string;
    [key: string]: any;
  }
  
  interface CanvasObject {
    type: string;
    [key: string]: any;
  }

  const handlePropertySelect = (property: Property | null) => {
    setSelectedProperty(property);
  };

  const handleCreateDesign = () => {
    if (!selectedTemplate) return;
    
    // Set up the canvas with this template's properties
    setCanvasProps({
      width: selectedTemplate.width,
      height: selectedTemplate.height,
      category: selectedTemplate.category
    });
    
    // Set the canvas objects
    if (selectedTemplate.content && typeof selectedTemplate.content === 'object' && 'objects' in selectedTemplate.content && Array.isArray(selectedTemplate.content.objects)) {
      // If a property is selected, modify template text to include property information
      if (selectedProperty) {
        const modifiedObjects = selectedTemplate.content.objects.map((obj: CanvasObject) => {
          if (obj.type === 'text') {
            // Replace placeholders with property info
            if (obj.text === 'FOR SALE') {
              return obj; // Keep "FOR SALE" text as is
            } else if (obj.text.includes('BED') && obj.text.includes('BATH')) {
              return {
                ...obj,
                text: `${selectedProperty.bedrooms} BED • ${selectedProperty.bathrooms} BATH • ${selectedProperty.squareFeet} SQFT`
              };
            } else if (obj.text.includes('ADDRESS') || obj.text.includes('STREET')) {
              return {
                ...obj,
                text: selectedProperty.address
              };
            }
          }
          return obj;
        });
        
        setCanvasObjects(modifiedObjects);
      } else {
        setCanvasObjects(selectedTemplate.content.objects);
      }
    }
    
    // Navigate to editor
    navigate("/editor");
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create New Design</DialogTitle>
          <DialogDescription>
            Choose a template category, select a design, and add property information to create marketing material.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={`step-${currentStep}`} className="mt-4">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="step-1" disabled={currentStep !== 1} onClick={() => setCurrentStep(1)}>
              Category
            </TabsTrigger>
            <TabsTrigger value="step-2" disabled={currentStep < 2} onClick={() => currentStep >= 2 && setCurrentStep(2)}>
              Template
            </TabsTrigger>
            <TabsTrigger value="step-3" disabled={currentStep < 3} onClick={() => currentStep >= 3 && setCurrentStep(3)}>
              Property
            </TabsTrigger>
          </TabsList>
          
          {/* Step 1: Choose Template Category */}
          <TabsContent value="step-1" className="min-h-[400px]">
            <RadioGroup className="grid grid-cols-1 gap-4 pt-3" value={selectedCategory} onValueChange={handleCategorySelect}>
              {templateCategories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <RadioGroupItem 
                    value={category.id} 
                    id={`category-${category.id}`} 
                    className="peer sr-only" 
                  />
                  <Label
                    htmlFor={`category-${category.id}`}
                    className="flex flex-1 items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <div className="flex items-center">
                      {category.icon}
                      <div>{category.title}</div>
                    </div>
                    <Check className="h-5 w-5 opacity-0 peer-data-[state=checked]:opacity-100" />
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex justify-end mt-6">
              <Button 
                onClick={() => selectedCategory && setCurrentStep(2)} 
                disabled={!selectedCategory}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          {/* Step 2: Choose Template */}
          <TabsContent value="step-2" className="min-h-[400px]">
            {templatesLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
                {categoryTemplates && categoryTemplates.length > 0 ? (
                  categoryTemplates.map((template: Design) => (
                    <Card 
                      key={template.id}
                      className={`overflow-hidden transition-all duration-300 hover:shadow-md border cursor-pointer ${selectedTemplate?.id === template.id ? 'border-primary ring-2 ring-primary' : 'border-gray-200'}`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <AspectRatio ratio={3/4} className="rounded-t-xl overflow-hidden">
                        {template.thumbnail ? (
                          <img 
                            src={template.thumbnail} 
                            alt={template.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-400">{template.name}</span>
                          </div>
                        )}
                      </AspectRatio>
                      <CardContent className="p-3">
                        <h3 className="font-medium text-gray-900 text-sm">{template.name}</h3>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10 text-gray-500">
                    No templates found for this category.
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setCurrentStep(1)}>
                Back
              </Button>
              <Button 
                onClick={() => selectedTemplate && setCurrentStep(3)} 
                disabled={!selectedTemplate}
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          {/* Step 3: Choose Property */}
          <TabsContent value="step-3" className="min-h-[400px]">
            <div className="pt-3">
              <p className="mb-3 text-sm text-gray-500">
                Select a property to include its details in your design (optional)
              </p>
              <RadioGroup className="grid grid-cols-1 gap-4" value={selectedProperty ? String(selectedProperty.id) : ""} onValueChange={(value) => {
                const property = properties.find(p => String(p.id) === value) || null;
                handlePropertySelect(property);
              }}>
                {properties.map((property) => (
                  <div key={property.id} className="flex items-center">
                    <RadioGroupItem 
                      value={String(property.id)} 
                      id={`property-${property.id}`} 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor={`property-${property.id}`}
                      className="flex flex-1 items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                    >
                      <div className="flex items-center gap-4">
                        {property.image && (
                          <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={property.image} 
                              alt={property.address} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <div className="font-medium">{property.address}</div>
                          <div className="text-sm text-gray-500">
                            {property.bedrooms} bed • {property.bathrooms} bath • {property.squareFeet} sqft • ${property.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Check className="h-5 w-5 opacity-0 peer-data-[state=checked]:opacity-100" />
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={() => setCurrentStep(2)}>
                Back
              </Button>
              <Button onClick={handleCreateDesign}>
                Create Design
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}