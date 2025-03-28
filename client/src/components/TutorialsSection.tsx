import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ArrowRight } from "lucide-react";

const tutorials = [
  {
    id: 1,
    title: "Creating Effective Signboards: Tips & Techniques",
    description: "Learn how to design signboards that capture attention and deliver messages effectively.",
    image: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=500&h=280&fit=crop",
    link: "#"
  },
  {
    id: 2,
    title: "Brochure Design Best Practices",
    description: "Master the art of brochure design with these professional tips and industry standards.",
    image: "https://images.unsplash.com/photo-1584717875049-bd59d632f061?w=500&h=280&fit=crop",
    link: "#"
  },
  {
    id: 3,
    title: "Color Theory for Marketing Materials",
    description: "Understand how colors influence perception and learn to create effective color schemes.",
    image: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=500&h=280&fit=crop",
    link: "#"
  }
];

export default function TutorialsSection() {
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold font-poppins">Tutorials & Tips</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tutorials.map((tutorial) => (
          <Card 
            key={tutorial.id}
            className="overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-200"
          >
            <AspectRatio ratio={16/9}>
              <img 
                src={tutorial.image} 
                alt={`${tutorial.title} thumbnail`} 
                className="w-full h-full object-cover"
              />
            </AspectRatio>
            <CardContent className="p-4">
              <h3 className="font-medium text-gray-900">{tutorial.title}</h3>
              <p className="text-gray-400 text-sm mt-2">{tutorial.description}</p>
              <div className="mt-4">
                <a 
                  href={tutorial.link} 
                  className="text-primary font-medium text-sm flex items-center hover:underline"
                >
                  Watch tutorial
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
