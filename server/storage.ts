import { designs, type Design, type InsertDesign, type User, type InsertUser, users } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Design management
  getAllDesigns(): Promise<Design[]>;
  getDesignsByCategory(category: string): Promise<Design[]>;
  getDesign(id: number): Promise<Design | undefined>;
  createDesign(design: InsertDesign): Promise<Design>;
  updateDesign(id: number, design: Partial<InsertDesign>): Promise<Design | undefined>;
  deleteDesign(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private designsData: Map<number, Design>;
  private userCurrentId: number;
  private designCurrentId: number;

  constructor() {
    this.users = new Map();
    this.designsData = new Map();
    this.userCurrentId = 1;
    this.designCurrentId = 1;
    
    // Add sample designs
    this.initializeSampleDesigns();
  }

  private initializeSampleDesigns() {
    const categories = ["signboard", "brochure", "flyer"];
    const names = [
      "Grand Opening", 
      "Summer Sale", 
      "Fitness Club", 
      "Cafe Promo", 
      "Business Hours",
      "Menu Board"
    ];
    
    for (let i = 0; i < 6; i++) {
      const category = categories[i % categories.length];
      this.createDesign({
        name: names[i],
        category,
        content: { 
          objects: [
            {
              type: "text",
              text: names[i].toUpperCase(),
              fontSize: 64,
              fontFamily: "Poppins",
              top: 200,
              left: 300,
              textAlign: "center",
              width: 400
            }
          ],
          background: "#ffffff"
        },
        width: 600,
        height: 800,
        thumbnail: ""
      });
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllDesigns(): Promise<Design[]> {
    return Array.from(this.designsData.values());
  }

  async getDesignsByCategory(category: string): Promise<Design[]> {
    return Array.from(this.designsData.values()).filter(
      design => design.category === category
    );
  }

  async getDesign(id: number): Promise<Design | undefined> {
    return this.designsData.get(id);
  }

  async createDesign(insertDesign: InsertDesign): Promise<Design> {
    const id = this.designCurrentId++;
    const now = new Date();
    
    const design: Design = {
      ...insertDesign,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.designsData.set(id, design);
    return design;
  }

  async updateDesign(id: number, updateData: Partial<InsertDesign>): Promise<Design | undefined> {
    const existing = this.designsData.get(id);
    
    if (!existing) {
      return undefined;
    }
    
    const updated: Design = {
      ...existing,
      ...updateData,
      updatedAt: new Date()
    };
    
    this.designsData.set(id, updated);
    return updated;
  }

  async deleteDesign(id: number): Promise<boolean> {
    return this.designsData.delete(id);
  }
}

export const storage = new MemStorage();
