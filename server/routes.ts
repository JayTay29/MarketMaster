import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDesignSchema, insertCategorySchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // get all designs
  app.get("/api/designs", async (req, res) => {
    try {
      const designs = await storage.getAllDesigns();
      res.json(designs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch designs" });
    }
  });

  // get designs by category
  app.get("/api/designs/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const designs = await storage.getDesignsByCategory(category);
      res.json(designs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch designs by category" });
    }
  });
  
  // get designs by category as a query param (fallback for the wizard)
  app.get("/api/designs/category", async (req, res) => {
    try {
      const category = req.query.category as string;
      
      if (!category) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      const designs = await storage.getDesignsByCategory(category);
      res.json(designs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch designs by category" });
    }
  });

  // get design by id
  app.get("/api/designs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const design = await storage.getDesign(parseInt(id));
      
      if (!design) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      res.json(design);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch design" });
    }
  });

  // create a new design
  app.post("/api/designs", async (req, res) => {
    try {
      const designData = insertDesignSchema.parse(req.body);
      const design = await storage.createDesign(designData);
      res.status(201).json(design);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid design data", 
          errors: fromZodError(err).message 
        });
      }
      res.status(500).json({ message: "Failed to create design" });
    }
  });

  // update a design
  app.patch("/api/designs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updated = await storage.updateDesign(parseInt(id), updateData);
      
      if (!updated) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Failed to update design" });
    }
  });

  // delete a design
  app.delete("/api/designs/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteDesign(parseInt(id));
      
      if (!deleted) {
        return res.status(404).json({ message: "Design not found" });
      }
      
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ message: "Failed to delete design" });
    }
  });

  // Category management API endpoints
  
  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get category by name
  app.get("/api/categories/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const category = await storage.getCategory(name);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Create a new category
  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid category data", 
          errors: fromZodError(err).message 
        });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Update category subcategories
  app.patch("/api/categories/:name", async (req, res) => {
    try {
      const { name } = req.params;
      const { subcategories } = req.body;
      
      if (!Array.isArray(subcategories)) {
        return res.status(400).json({ message: "Subcategories must be an array" });
      }
      
      const updated = await storage.updateCategory(name, subcategories);
      
      if (!updated) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  // Get designs by category and subcategory
  app.get("/api/designs/category/:category/subcategory/:subcategory", async (req, res) => {
    try {
      const { category, subcategory } = req.params;
      const designs = await storage.getDesignsByCategoryAndSubcategory(category, subcategory);
      res.json(designs);
    } catch (err) {
      res.status(500).json({ message: "Failed to fetch designs by subcategory" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
