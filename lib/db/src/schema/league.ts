import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const leagueTableTable = pgTable("league_table", {
  id: serial("id").primaryKey(),
  season: integer("season").notNull().default(0),
  position: integer("position").notNull(),
  team: text("team").notNull(),
  logoUrl: text("logo_url"),
  played: integer("played").notNull().default(0),
  won: integer("won").notNull().default(0),
  drawn: integer("drawn").notNull().default(0),
  lost: integer("lost").notNull().default(0),
  goalsFor: integer("goals_for").notNull().default(0),
  goalsAgainst: integer("goals_against").notNull().default(0),
  goalDifference: integer("goal_difference").notNull().default(0),
  points: integer("points").notNull().default(0),
  isGoldenArrows: boolean("is_golden_arrows").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertLeagueTableSchema = createInsertSchema(leagueTableTable).omit({ id: true });
export type InsertLeagueTable = z.infer<typeof insertLeagueTableSchema>;
export type LeagueTable = typeof leagueTableTable.$inferSelect;
