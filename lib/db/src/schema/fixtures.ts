import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const fixturesTable = pgTable("fixtures", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // ISO date string
  time: text("time"),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  competition: text("competition").notNull().default("DStv Premiership"),
  venue: text("venue").notNull(),
  ticketUrl: text("ticket_url"),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertFixtureSchema = createInsertSchema(fixturesTable).omit({ id: true, createdAt: true });
export type InsertFixture = z.infer<typeof insertFixtureSchema>;
export type Fixture = typeof fixturesTable.$inferSelect;
