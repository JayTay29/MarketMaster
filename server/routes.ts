import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertDesignSchema } from "@shared/schema";
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

  const httpServer = createServer(app);

  return httpServer;
}
