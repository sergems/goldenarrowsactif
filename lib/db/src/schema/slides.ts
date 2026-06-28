import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const slidesTable = pgTable("slides", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  imageUrl: text("image_url").notNull(),
  subtitle: text("subtitle"),
  link: text("link"),
  linkLabel: text("link_label"),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertSlideSchema = createInsertSchema(slidesTable).omit({ id: true, createdAt: true });
export const updateSlideSchema = insertSlideSchema.partial();
export type Slide = typeof slidesTable.$inferSelect;
export type InsertSlide = z.infer<typeof insertSlideSchema>;
