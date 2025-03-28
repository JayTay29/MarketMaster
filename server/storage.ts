import { designs, categories, type Design, type InsertDesign, type User, type InsertUser, users, type Category, type InsertCategory } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Design management
  getAllDesigns(): Promise<Design[]>;
  getDesignsByCategory(category: string): Promise<Design[]>;
  getDesignsByCategoryAndSubcategory(category: string, subcategory: string): Promise<Design[]>;
  getDesign(id: number): Promise<Design | undefined>;
  createDesign(design: InsertDesign): Promise<Design>;
  updateDesign(id: number, design: Partial<InsertDesign>): Promise<Design | undefined>;
  deleteDesign(id: number): Promise<boolean>;
  
  // Category management
  getAllCategories(): Promise<Category[]>;
  getCategory(name: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(name: string, subcategories: string[]): Promise<Category | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private designsData: Map<number, Design>;
  private categoriesData: Map<string, Category>;
  private userCurrentId: number;
  private designCurrentId: number;
  private categoryCurrentId: number;

  constructor() {
    this.users = new Map();
    this.designsData = new Map();
    this.categoriesData = new Map();
    this.userCurrentId = 1;
    this.designCurrentId = 1;
    this.categoryCurrentId = 1;
    
    // Initialize default categories with subcategories
    this.initializeCategories();
    
    // Add sample designs
    this.initializeSampleDesigns();
  }
  
  private initializeCategories() {
    // Default categories and subcategories
    const defaultCategories = [
      {
        id: this.categoryCurrentId++,
        name: "signboard",
        subcategories: ["all", "store-front", "event", "promotion", "directional"]
      },
      {
        id: this.categoryCurrentId++,
        name: "brochure",
        subcategories: ["all", "business", "marketing", "event", "travel"]
      },
      {
        id: this.categoryCurrentId++,
        name: "flyer",
        subcategories: ["all", "event", "promotional", "business", "service"]
      }
    ];
    
    // Add to database
    defaultCategories.forEach(category => {
      this.categoriesData.set(category.name, category);
    });
  }

  private initializeSampleDesigns() {
    // Create real estate specific templates by category
    this.createRealEstateSignboards();
    this.createRealEstateBrochures();
    this.createRealEstateFlyers();
  }
  
  private createRealEstateSignboards() {
    // Signboard templates
    const signboardTemplates = [
      {
        name: "Premium For Sale",
        category: "signboard",
        content: {
          objects: [
            {
              type: "rect",
              width: 800,
              height: 120,
              left: 400,
              top: 60,
              fill: "#4B4DED",
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "FOR SALE",
              fontSize: 80,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 60,
              left: 400,
              textAlign: "center",
              fill: "#FFFFFF",
              width: 600
            },
            {
              type: "text",
              text: "ADDRESS GOES HERE",
              fontSize: 60,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 250,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "text",
              text: "4 BED • 3 BATH • 2500 SQFT",
              fontSize: 40,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 350,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "text",
              text: "CALL: (310) 555-1234",
              fontSize: 50,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 450,
              left: 400,
              textAlign: "center",
              fill: "#4B4DED",
              width: 700
            },
            {
              type: "rect",
              width: 800,
              height: 100,
              left: 400,
              top: 550,
              fill: "#4B4DED",
              rx: 0,
              ry: 0
            }
          ],
          background: "#ffffff"
        },
        width: 800,
        height: 600,
        thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=200&fit=crop"
      },
      {
        name: "Modern Open House",
        category: "signboard",
        content: {
          objects: [
            {
              type: "rect",
              width: 800,
              height: 600,
              left: 400,
              top: 300,
              fill: "#FFFFFF",
              stroke: "#4B4DED",
              strokeWidth: 10,
              rx: 10,
              ry: 10
            },
            {
              type: "text",
              text: "OPEN HOUSE",
              fontSize: 70,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 120,
              left: 400,
              textAlign: "center",
              fill: "#4B4DED",
              width: 700
            },
            {
              type: "text",
              text: "SUNDAY 1-4 PM",
              fontSize: 50,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 200,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "text",
              text: "ADDRESS GOES HERE",
              fontSize: 50,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 300,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "text",
              text: "3 BED • 2 BATH • 1800 SQFT",
              fontSize: 40,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 380,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "text",
              text: "PRICE: $950,000",
              fontSize: 50,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 450,
              left: 400,
              textAlign: "center",
              fill: "#FF5C5C",
              width: 700
            }
          ],
          background: "#ffffff"
        },
        width: 800,
        height: 600,
        thumbnail: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=300&h=200&fit=crop"
      },
      {
        name: "Elegant Listing",
        category: "signboard",
        content: {
          objects: [
            {
              type: "rect",
              width: 800,
              height: 150,
              left: 400,
              top: 75,
              fill: "#00C4CC",
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "LUXURY PROPERTY",
              fontSize: 70,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 75,
              left: 400,
              textAlign: "center",
              fill: "#FFFFFF",
              width: 700
            },
            {
              type: "text",
              text: "ADDRESS GOES HERE",
              fontSize: 50,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 200,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "text",
              text: "5 BED • 4 BATH • 3500 SQFT",
              fontSize: 40,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 270,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "rect",
              width: 350,
              height: 80,
              left: 400,
              top: 400,
              fill: "#00C4CC",
              rx: 40,
              ry: 40
            },
            {
              type: "text",
              text: "FOR SALE",
              fontSize: 50,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 400,
              left: 400,
              textAlign: "center",
              fill: "#FFFFFF",
              width: 300
            },
            {
              type: "text",
              text: "REALTY EXPERTS",
              fontSize: 40,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 500,
              left: 400,
              textAlign: "center",
              fill: "#00C4CC",
              width: 700
            }
          ],
          background: "#ffffff"
        },
        width: 800,
        height: 600,
        thumbnail: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=300&h=200&fit=crop"
      }
    ];
    
    // Add to database
    signboardTemplates.forEach(template => {
      this.createDesign(template);
    });
  }
  
  private createRealEstateBrochures() {
    // Brochure templates
    const brochureTemplates = [
      {
        name: "Property Profile",
        category: "brochure",
        content: {
          objects: [
            {
              type: "rect",
              width: 800,
              height: 1000,
              left: 400,
              top: 500,
              fill: "#FFFFFF",
              stroke: "#EEEEEE",
              strokeWidth: 2,
              rx: 0,
              ry: 0
            },
            {
              type: "rect",
              width: 800,
              height: 250,
              left: 400,
              top: 125,
              fill: "#4B4DED",
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "PROPERTY PROFILE",
              fontSize: 70,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 125,
              left: 400,
              textAlign: "center",
              fill: "#FFFFFF",
              width: 700
            },
            {
              type: "text",
              text: "ADDRESS GOES HERE",
              fontSize: 50,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 300,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "text",
              text: "4 BED • 3 BATH • 2500 SQFT",
              fontSize: 35,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 370,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "rect",
              width: 700,
              height: 400,
              left: 400,
              top: 600,
              fill: "#F5F5F5",
              rx: 10,
              ry: 10
            },
            {
              type: "text",
              text: "PROPERTY FEATURES",
              fontSize: 40,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 480,
              left: 400,
              textAlign: "center",
              fill: "#4B4DED",
              width: 700
            },
            {
              type: "text",
              text: "• Open concept floor plan\n• Gourmet kitchen with island\n• Master suite with walk-in closet\n• Spacious backyard\n• 2-car garage\n• Energy efficient appliances",
              fontSize: 30,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 600,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 600,
              lineHeight: 1.5
            },
            {
              type: "text",
              text: "CONTACT: (310) 555-1234 | AGENT@REALTY.COM",
              fontSize: 25,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 900,
              left: 400,
              textAlign: "center",
              fill: "#4B4DED",
              width: 700
            }
          ],
          background: "#ffffff"
        },
        width: 800,
        height: 1000,
        thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=350&fit=crop"
      },
      {
        name: "Luxury Home",
        category: "brochure",
        content: {
          objects: [
            {
              type: "rect",
              width: 800,
              height: 1000,
              left: 400,
              top: 500,
              fill: "#FFFFFF",
              stroke: "#CCCCCC",
              strokeWidth: 1,
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "LUXURY LISTING",
              fontSize: 70,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 100,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "text",
              text: "ADDRESS GOES HERE",
              fontSize: 40,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 190,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "rect",
              width: 700,
              height: 350,
              left: 400,
              top: 350,
              fill: "#EEEEEE",
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "5 BED • 4 BATH • 3500 SQFT",
              fontSize: 35,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 550,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "text",
              text: "PRICE: $2,350,000",
              fontSize: 50,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 630,
              left: 400,
              textAlign: "center",
              fill: "#00C4CC",
              width: 700
            },
            {
              type: "text",
              text: "FEATURES",
              fontSize: 40,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 720,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 700
            },
            {
              type: "text",
              text: "• Private pool and spa\n• Wine cellar\n• Smart home technology\n• Chef's kitchen\n• Home theater",
              fontSize: 30,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 800,
              left: 400,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 600,
              lineHeight: 1.5
            },
            {
              type: "rect",
              width: 800,
              height: 80,
              left: 400,
              top: 960,
              fill: "#00C4CC",
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "CONTACT: LUXURY@REALTY.COM",
              fontSize: 30,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 960,
              left: 400,
              textAlign: "center",
              fill: "#FFFFFF",
              width: 700
            }
          ],
          background: "#ffffff"
        },
        width: 800,
        height: 1000,
        thumbnail: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=300&h=350&fit=crop"
      }
    ];
    
    // Add to database
    brochureTemplates.forEach(template => {
      this.createDesign(template);
    });
  }
  
  private createRealEstateFlyers() {
    // Flyer templates
    const flyerTemplates = [
      {
        name: "Open House Flyer",
        category: "flyer",
        content: {
          objects: [
            {
              type: "rect",
              width: 600,
              height: 800,
              left: 300,
              top: 400,
              fill: "#FFFFFF",
              stroke: "#EEEEEE",
              strokeWidth: 2,
              rx: 0,
              ry: 0
            },
            {
              type: "rect",
              width: 600,
              height: 120,
              left: 300,
              top: 60,
              fill: "#FF5C5C",
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "OPEN HOUSE",
              fontSize: 70,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 60,
              left: 300,
              textAlign: "center",
              fill: "#FFFFFF",
              width: 500
            },
            {
              type: "text",
              text: "SUNDAY, MARCH 28 • 1-4 PM",
              fontSize: 30,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 150,
              left: 300,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 500
            },
            {
              type: "rect",
              width: 500,
              height: 300,
              left: 300,
              top: 300,
              fill: "#F5F5F5",
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "ADDRESS GOES HERE",
              fontSize: 40,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 200,
              left: 300,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 500
            },
            {
              type: "text",
              text: "3 BED • 2 BATH • 1800 SQFT",
              fontSize: 30,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 530,
              left: 300,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 500
            },
            {
              type: "text",
              text: "PRICE: $950,000",
              fontSize: 40,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 590,
              left: 300,
              textAlign: "center",
              fill: "#FF5C5C",
              width: 500
            },
            {
              type: "text",
              text: "FEATURES: Updated kitchen, hardwood floors, large backyard, attached garage, close to schools and shopping",
              fontSize: 20,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 650,
              left: 300,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 500,
              lineHeight: 1.3
            },
            {
              type: "text",
              text: "CONTACT: JANE SMITH • (310) 555-1234",
              fontSize: 25,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 750,
              left: 300,
              textAlign: "center",
              fill: "#FF5C5C",
              width: 500
            }
          ],
          background: "#ffffff"
        },
        width: 600,
        height: 800,
        thumbnail: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=300&h=350&fit=crop"
      },
      {
        name: "Just Listed",
        category: "flyer",
        content: {
          objects: [
            {
              type: "rect",
              width: 600,
              height: 800,
              left: 300,
              top: 400,
              fill: "#FFFFFF",
              stroke: "#4B4DED",
              strokeWidth: 4,
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "JUST LISTED",
              fontSize: 70,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 70,
              left: 300,
              textAlign: "center",
              fill: "#4B4DED",
              width: 500
            },
            {
              type: "rect",
              width: 500,
              height: 300,
              left: 300,
              top: 250,
              fill: "#F5F5F5",
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "ADDRESS GOES HERE",
              fontSize: 35,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 150,
              left: 300,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 500
            },
            {
              type: "text",
              text: "2 BED • 2 BATH • 1200 SQFT",
              fontSize: 30,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 450,
              left: 300,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 500
            },
            {
              type: "rect",
              width: 500,
              height: 60,
              left: 300,
              top: 510,
              fill: "#4B4DED",
              rx: 30,
              ry: 30
            },
            {
              type: "text",
              text: "$850,000",
              fontSize: 40,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 510,
              left: 300,
              textAlign: "center",
              fill: "#FFFFFF",
              width: 500
            },
            {
              type: "text",
              text: "PROPERTY HIGHLIGHTS",
              fontSize: 30,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 590,
              left: 300,
              textAlign: "center",
              fill: "#4B4DED",
              width: 500
            },
            {
              type: "text",
              text: "• Modern design with city views\n• Updated kitchen with stainless appliances\n• In-unit washer and dryer\n• Secure building with pool and gym",
              fontSize: 20,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 650,
              left: 300,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 500,
              lineHeight: 1.3
            },
            {
              type: "text",
              text: "MARK JOHNSON REALTY • (310) 555-5678",
              fontSize: 20,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 750,
              left: 300,
              textAlign: "center",
              fill: "#4B4DED",
              width: 500
            }
          ],
          background: "#ffffff"
        },
        width: 600,
        height: 800,
        thumbnail: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=300&h=350&fit=crop"
      },
      {
        name: "Exclusive Property",
        category: "flyer",
        content: {
          objects: [
            {
              type: "rect",
              width: 600,
              height: 800,
              left: 300,
              top: 400,
              fill: "#FFFFFF",
              stroke: "#000000",
              strokeWidth: 1,
              rx: 0,
              ry: 0
            },
            {
              type: "rect",
              width: 600,
              height: 100,
              left: 300,
              top: 50,
              fill: "#00C4CC",
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "EXCLUSIVE LISTING",
              fontSize: 50,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 50,
              left: 300,
              textAlign: "center",
              fill: "#FFFFFF",
              width: 500
            },
            {
              type: "rect",
              width: 500,
              height: 280,
              left: 300,
              top: 230,
              fill: "#F5F5F5",
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "ADDRESS GOES HERE",
              fontSize: 35,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 140,
              left: 300,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 500
            },
            {
              type: "text",
              text: "5 BED • 4.5 BATH • 4200 SQFT",
              fontSize: 25,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 400,
              left: 300,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 500
            },
            {
              type: "text",
              text: "$4,500,000",
              fontSize: 40,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 450,
              left: 300,
              textAlign: "center",
              fill: "#00C4CC",
              width: 500
            },
            {
              type: "text",
              text: "LUXURY AMENITIES",
              fontSize: 30,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 520,
              left: 300,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 500
            },
            {
              type: "text",
              text: "• Gated estate on 1 acre\n• Infinity pool and spa\n• Home theater and wine cellar\n• Chef's kitchen with double islands\n• 4-car garage with EV charging",
              fontSize: 20,
              fontFamily: "Arial",
              fontWeight: "normal",
              top: 590,
              left: 300,
              textAlign: "center",
              fill: "#2D2D2D",
              width: 500,
              lineHeight: 1.3
            },
            {
              type: "rect",
              width: 600,
              height: 60,
              left: 300,
              top: 770,
              fill: "#00C4CC",
              rx: 0,
              ry: 0
            },
            {
              type: "text",
              text: "ELITE PROPERTIES GROUP • (424) 555-9876",
              fontSize: 20,
              fontFamily: "Arial",
              fontWeight: "bold",
              top: 770,
              left: 300,
              textAlign: "center",
              fill: "#FFFFFF",
              width: 500
            }
          ],
          background: "#ffffff"
        },
        width: 600,
        height: 800,
        thumbnail: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=350&fit=crop"
      }
    ];
    
    // Add to database
    flyerTemplates.forEach(template => {
      this.createDesign(template);
    });
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
    
    // Ensure required fields have values
    const design: Design = {
      id,
      name: insertDesign.name || '',
      category: insertDesign.category,
      subcategory: insertDesign.subcategory || null,
      content: insertDesign.content,
      width: insertDesign.width,
      height: insertDesign.height,
      thumbnail: insertDesign.thumbnail || null,
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
    
    // Ensure we have all required fields
    const updated: Design = {
      ...existing,
      ...updateData,
      // Ensure required fields are present
      id: id,
      name: updateData.name || existing.name,
      category: updateData.category || existing.category,
      subcategory: updateData.subcategory !== undefined ? updateData.subcategory : existing.subcategory,
      content: updateData.content || existing.content,
      width: updateData.width || existing.width,
      height: updateData.height || existing.height,
      thumbnail: updateData.thumbnail !== undefined ? updateData.thumbnail : existing.thumbnail,
      createdAt: existing.createdAt,
      updatedAt: new Date()
    };
    
    this.designsData.set(id, updated);
    return updated;
  }

  async deleteDesign(id: number): Promise<boolean> {
    return this.designsData.delete(id);
  }
  
  // Category management functions
  async getDesignsByCategoryAndSubcategory(category: string, subcategory: string): Promise<Design[]> {
    const designs = Array.from(this.designsData.values())
      .filter(design => design.category === category);
      
    if (subcategory && subcategory !== "all") {
      return designs.filter(design => design.subcategory === subcategory);
    }
    
    return designs;
  }
  
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categoriesData.values());
  }
  
  async getCategory(name: string): Promise<Category | undefined> {
    return this.categoriesData.get(name);
  }
  
  async createCategory(category: InsertCategory): Promise<Category> {
    // Ensure required fields have values
    const newCategory: Category = {
      id: this.categoryCurrentId++,
      name: category.name,
      // Default to just "all" if no subcategories provided
      subcategories: category.subcategories || ["all"]
    };
    
    this.categoriesData.set(category.name, newCategory);
    return newCategory;
  }
  
  async updateCategory(name: string, subcategories: string[]): Promise<Category | undefined> {
    const category = this.categoriesData.get(name);
    
    if (!category) {
      return undefined;
    }
    
    // Always include 'all' in subcategories
    if (!subcategories.includes('all')) {
      subcategories.unshift('all');
    }
    
    const updated: Category = {
      ...category,
      subcategories
    };
    
    this.categoriesData.set(name, updated);
    return updated;
  }
}

export const storage = new MemStorage();
