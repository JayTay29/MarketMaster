import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const designs = pgTable("designs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Untitled Design"),
  category: text("category").notNull(), // "signboard", "brochure", "flyer"
  subcategory: text("subcategory"), // Optional subcategory like "store-front", "event", etc.
  content: jsonb("content").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  thumbnail: text("thumbnail"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(), // Main category name: "signboard", "brochure", "flyer"
  subcategories: jsonb("subcategories").notNull().default(['all']), // List of subcategories
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDesignSchema = createInsertSchema(designs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertDesign = z.infer<typeof insertDesignSchema>;
export type Design = typeof designs.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;
