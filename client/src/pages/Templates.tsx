import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FilterIcon, Search } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import TemplatesGrid from "@/components/TemplatesGrid";
import SubcategoryManager from "@/components/SubcategoryManager";
import { useState, useEffect } from "react";

export default function Templates() {
  const { category } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [tabsForCategory, setTabsForCategory] = useState<string[]>(["all"]);
  
  // Get designs by category
  const { data: designs, isLoading: designsLoading, error: designsError } = useQuery({
    queryKey: [`/api/designs/category/${category || 'signboard'}`],
  });

  // Get category info with subcategories
  const { data: categoryData, isLoading: categoryLoading, error: categoryError } = useQuery({
    queryKey: [`/api/categories/${category || 'signboard'}`],
  });

  // Set current tab and tabs for category when category data loads
  useEffect(() => {
    if (categoryData && Array.isArray(categoryData.subcategories)) {
      setTabsForCategory(categoryData.subcategories);
      
      // Reset to "all" tab when category changes
      setCurrentTab("all");
    } else if (categoryData) {
      // Default to just "all" if no subcategories found
      setTabsForCategory(["all"]);
      setCurrentTab("all");
    }
  }, [categoryData]);

  // Handle errors
  useEffect(() => {
    if (designsError) {
      toast({
        title: "Error",
        description: "Failed to load templates. Please try again.",
        variant: "destructive",
      });
    }
    
    if (categoryError) {
      toast({
        title: "Error",
        description: "Failed to load category information. Please try again.",
        variant: "destructive",
      });
    }
  }, [designsError, categoryError, toast]);

  const handleBack = () => {
    navigate("/");
  };

  const getCategoryTitle = () => {
    switch (category) {
      case "signboard": return "Signboard Templates";
      case "brochure": return "Brochure Templates";
      case "flyer": return "DL Flyer Templates";
      default: return "Templates";
    }
  };

  // Filter designs by search query and selected tab/subcategory
  const filteredDesigns = Array.isArray(designs) 
    ? designs.filter(design => {
        // Filter by search query
        if (searchQuery && design.name && !design.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        
        // Filter by subcategory
        if (currentTab !== "all" && design.subcategory) {
          return design.subcategory === currentTab;
        }
        
        return true;
      })
    : [];

  const isLoading = designsLoading || categoryLoading;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Templates Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleBack}
              className="mr-3 text-gray-400 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold font-poppins text-gray-900">{getCategoryTitle()}</h1>
          </div>
          <p className="text-gray-400 mt-1">Choose a template to get started</p>
        </div>
        <div className="flex items-center">
          <div className="relative mr-3">
            <Input
              type="text"
              placeholder="Search templates"
              className="w-64 pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <FilterIcon className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <SubcategoryManager category={category || "signboard"} />
          </div>
        </div>
      </div>

      {/* Templates Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="justify-start border-0 bg-transparent">
            {tabsForCategory.map(tab => (
              <TabsTrigger 
                key={tab} 
                value={tab}
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2 capitalize"
              >
                {tab.replace('-', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <Skeleton key={i} className="aspect-w-3 aspect-h-4 rounded-xl" />
          ))}
        </div>
      ) : (
        <TemplatesGrid 
          designs={filteredDesigns || []} 
          category={category || "signboard"} 
        />
      )}
    </div>
  );
}
