import { useLocation } from "wouter";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const templateCategories = [
  {
    id: "signboard",
    title: "Real Estate Signboards",
    count: 42,
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&h=400&fit=crop"
  },
  {
    id: "brochure",
    title: "Property Brochures",
    count: 67,
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop"
  },
  {
    id: "flyer",
    title: "Property Flyers", 
    count: 53,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop"
  }
];

export default function TemplateCategories() {
  const [, navigate] = useLocation();
  
  const handleCategoryClick = (categoryId: string) => {
    navigate(`/templates/${categoryId}`);
  };
  
  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold font-poppins">Template Categories</h2>
        <a href="#" className="text-primary text-sm font-medium hover:underline">Browse all templates</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {templateCategories.map((category) => (
          <div 
            key={category.id}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 hover:-translate-y-1"
            onClick={() => handleCategoryClick(category.id)}
          >
            <AspectRatio ratio={16/9} className="relative">
              <img 
                src={category.image} 
                alt={`${category.title} category`} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-70"></div>
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="text-white text-xl font-medium font-poppins">{category.title}</h3>
                <p className="text-white text-opacity-80 text-sm mt-1">{category.count} templates</p>
              </div>
            </AspectRatio>
          </div>
        ))}
      </div>
    </div>
  );
}
