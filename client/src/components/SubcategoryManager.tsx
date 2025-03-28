import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Edit, Plus, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

interface SubcategoryManagerProps {
  category: string;
}

export default function SubcategoryManager({ category }: SubcategoryManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [newSubcategory, setNewSubcategory] = useState("");
  const [editingSubcategory, setEditingSubcategory] = useState<{ index: number; oldValue: string; newValue: string } | null>(null);

  // Fetch category data
  const { data: categoryData, isLoading, error } = useQuery({
    queryKey: [`/api/categories/${category}`]
  });
  
  // Handle error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load subcategories. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Update subcategories when category data changes
  useEffect(() => {
    if (categoryData && Array.isArray(categoryData.subcategories)) {
      setSubcategories(categoryData.subcategories);
    } else if (categoryData) {
      // Default to just "all" if no subcategories found
      setSubcategories(["all"]);
    }
  }, [categoryData]);

  // Update subcategories mutation
  const updateSubcategoriesMutation = useMutation({
    mutationFn: async (newSubcategories: string[]) => {
      return apiRequest(`/api/categories/${category}`, "PATCH", { 
        subcategories: newSubcategories 
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Subcategories updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/categories/${category}`] });
      setIsOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update subcategories",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    // Always ensure 'all' is in the list and is first
    let updatedSubcategories = [...subcategories];
    if (!updatedSubcategories.includes('all')) {
      updatedSubcategories.unshift('all');
    } else if (updatedSubcategories.indexOf('all') !== 0) {
      updatedSubcategories = [
        'all',
        ...updatedSubcategories.filter(subcat => subcat !== 'all')
      ];
    }
    
    updateSubcategoriesMutation.mutate(updatedSubcategories);
  };

  const handleAddSubcategory = () => {
    if (!newSubcategory.trim()) return;
    
    // Check for duplicates (case insensitive)
    const normalizedNew = newSubcategory.trim().toLowerCase();
    if (subcategories.some(s => s.toLowerCase() === normalizedNew)) {
      toast({
        title: "Error",
        description: "Subcategory already exists",
        variant: "destructive",
      });
      return;
    }
    
    // Format for subcategory: lowercase, hyphen for spaces
    const formattedSubcategory = newSubcategory.trim().toLowerCase().replace(/\s+/g, '-');
    setSubcategories([...subcategories, formattedSubcategory]);
    setNewSubcategory("");
  };

  const handleRemoveSubcategory = (index: number) => {
    // Don't allow removing the 'all' subcategory
    if (subcategories[index] === 'all') {
      toast({
        title: "Error",
        description: "Cannot remove the 'all' subcategory",
        variant: "destructive",
      });
      return;
    }
    
    const newSubcategories = [...subcategories];
    newSubcategories.splice(index, 1);
    setSubcategories(newSubcategories);
  };

  const startEditingSubcategory = (index: number) => {
    // Don't allow editing the 'all' subcategory
    if (subcategories[index] === 'all') {
      toast({
        title: "Error",
        description: "Cannot rename the 'all' subcategory",
        variant: "destructive",
      });
      return;
    }
    
    setEditingSubcategory({
      index,
      oldValue: subcategories[index],
      newValue: subcategories[index]
    });
  };

  const updateEditingValue = (value: string) => {
    if (editingSubcategory) {
      setEditingSubcategory({
        ...editingSubcategory,
        newValue: value
      });
    }
  };

  const saveEditedSubcategory = () => {
    if (!editingSubcategory) return;
    
    // Format the subcategory: lowercase, hyphen for spaces
    const formattedValue = editingSubcategory.newValue.trim().toLowerCase().replace(/\s+/g, '-');
    
    // Check if it's the same as before
    if (formattedValue === editingSubcategory.oldValue) {
      setEditingSubcategory(null);
      return;
    }
    
    // Check for duplicates (case insensitive)
    if (subcategories.some(s => s.toLowerCase() === formattedValue.toLowerCase() && 
                               s !== editingSubcategory.oldValue)) {
      toast({
        title: "Error",
        description: "Subcategory already exists",
        variant: "destructive",
      });
      return;
    }
    
    const newSubcategories = [...subcategories];
    newSubcategories[editingSubcategory.index] = formattedValue;
    setSubcategories(newSubcategories);
    setEditingSubcategory(null);
  };

  const renderSubcategories = () => {
    return subcategories.map((subcategory, index) => (
      <div key={index} className="flex items-center gap-2 mb-2">
        {editingSubcategory && editingSubcategory.index === index ? (
          <div className="flex-1 flex gap-2">
            <Input 
              value={editingSubcategory.newValue}
              onChange={(e) => updateEditingValue(e.target.value)}
              className="flex-1"
            />
            <Button size="sm" variant="default" onClick={saveEditedSubcategory}>
              <Save className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <Badge variant={subcategory === 'all' ? "default" : "outline"} className="capitalize">
              {subcategory.replace('-', ' ')}
            </Badge>
            <div className="flex-1"></div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => startEditingSubcategory(index)}
              disabled={subcategory === 'all'}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={() => handleRemoveSubcategory(index)}
              disabled={subcategory === 'all'}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    ));
  };

  if (isLoading) {
    return <div>Loading subcategories...</div>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Manage Subcategories</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage {category.charAt(0).toUpperCase() + category.slice(1)} Subcategories</DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Subcategories</CardTitle>
              <CardDescription>
                Edit or remove existing subcategories
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderSubcategories()}
            </CardContent>
          </Card>
          
          <div className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Add New Subcategory</CardTitle>
                <CardDescription>
                  Create a new subcategory for {category} templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Input 
                    placeholder="New subcategory name"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                  />
                  <Button onClick={handleAddSubcategory} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="text-xs text-muted-foreground">
                Subcategory names will be formatted as lowercase with hyphens
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={updateSubcategoriesMutation.isPending}
          >
            {updateSubcategoriesMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}