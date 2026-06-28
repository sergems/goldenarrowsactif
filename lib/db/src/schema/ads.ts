import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

const PAGES = ["fixtures", "results", "table"] as const;
const SIDES = ["left", "right"] as const;
const POSITIONS = [1, 2, 3] as const;

export const AD_SLOTS = PAGES.flatMap(page =>
  SIDES.flatMap(side =>
    POSITIONS.map(n => `${page}-${side}-${n}` as const)
  )
) as unknown as readonly string[];

export const adsTable = pgTable("ads", {
  id: serial("id").primaryKey(),
  slot: text("slot").notNull().unique(),
  imageUrl: text("image_url"),
  linkUrl: text("link_url"),
  altText: text("alt_text"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Ad = typeof adsTable.$inferSelect;
