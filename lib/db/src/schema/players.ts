import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const playersTable = pgTable("players", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  position: text("position").notNull(), // Goalkeeper, Defender, Midfielder, Forward
  number: integer("number").notNull(),
  nationality: text("nationality").notNull(),
  age: integer("age"),
  photoUrl: text("photo_url"),
  bio: text("bio"),
  appearances: integer("appearances").notNull().default(0),
  goals: integer("goals").notNull().default(0),
  assists: integer("assists").notNull().default(0),
  instagram: text("instagram"),
  facebook: text("facebook"),
  twitter: text("twitter"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPlayerSchema = createInsertSchema(playersTable).omit({ id: true, createdAt: true });
export type InsertPlayer = z.infer<typeof insertPlayerSchema>;
export type Player = typeof playersTable.$inferSelect;
