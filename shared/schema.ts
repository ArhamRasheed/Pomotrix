import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'focus' or 'break'
  name: text("name"), // optional session name
  duration: integer("duration").notNull(), // in seconds
  completedAt: timestamp("completed_at").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
});

export const dailyStats = pgTable("daily_stats", {
  id: serial("id").primaryKey(),
  date: text("date").notNull().unique(), // YYYY-MM-DD format
  focusSessions: integer("focus_sessions").notNull().default(0),
  breakSessions: integer("break_sessions").notNull().default(0),
  totalFocusTime: integer("total_focus_time").notNull().default(0), // in seconds
  totalBreakTime: integer("total_break_time").notNull().default(0), // in seconds
  xpEarned: integer("xp_earned").notNull().default(0),
});

export const userStats = pgTable("user_stats", {
  id: serial("id").primaryKey(),
  totalXP: integer("total_xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActiveDate: text("last_active_date"),
});

export const insertSessionSchema = createInsertSchema(sessions).pick({
  type: true,
  name: true,
  duration: true,
  completedAt: true,
  date: true,
}).extend({
  completedAt: z.string().transform((val) => new Date(val)),
});

export const insertDailyStatsSchema = createInsertSchema(dailyStats).pick({
  date: true,
  focusSessions: true,
  breakSessions: true,
  totalFocusTime: true,
  totalBreakTime: true,
  xpEarned: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).pick({
  totalXP: true,
  level: true,
  currentStreak: true,
  longestStreak: true,
  lastActiveDate: true,
});

export type Session = typeof sessions.$inferSelect;
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type DailyStats = typeof dailyStats.$inferSelect;
export type InsertDailyStats = z.infer<typeof insertDailyStatsSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
