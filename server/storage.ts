import { sessions, dailyStats, userStats, type Session, type InsertSession, type DailyStats, type InsertDailyStats, type UserStats, type InsertUserStats } from "@shared/schema";

export interface IStorage {
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getSessionsByDate(date: string): Promise<Session[]>;
  getRecentSessions(limit: number): Promise<Session[]>;
  
  // Daily stats methods
  getDailyStats(date: string): Promise<DailyStats | undefined>;
  updateDailyStats(stats: InsertDailyStats): Promise<DailyStats>;
  getWeeklyStats(startDate: string, endDate: string): Promise<DailyStats[]>;
  
  // User stats methods
  getUserStats(): Promise<UserStats>;
  updateUserStats(stats: InsertUserStats): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private sessions: Map<number, Session>;
  private dailyStats: Map<string, DailyStats>;
  private userStats: UserStats;
  private currentSessionId: number;
  private currentStatsId: number;

  constructor() {
    this.sessions = new Map();
    this.dailyStats = new Map();
    this.userStats = {
      id: 1,
      totalXP: 0,
      level: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
    };
    this.currentSessionId = 1;
    this.currentStatsId = 1;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const session: Session = { 
      ...insertSession, 
      id,
      name: insertSession.name || null
    };
    this.sessions.set(id, session);
    
    // Update daily stats
    await this.updateDailyStatsAfterSession(session);
    
    return session;
  }

  async getSessionsByDate(date: string): Promise<Session[]> {
    return Array.from(this.sessions.values()).filter(
      (session) => session.date === date
    );
  }

  async getRecentSessions(limit: number): Promise<Session[]> {
    return Array.from(this.sessions.values())
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, limit);
  }

  async getDailyStats(date: string): Promise<DailyStats | undefined> {
    return this.dailyStats.get(date);
  }

  async updateDailyStats(stats: InsertDailyStats): Promise<DailyStats> {
    const existing = this.dailyStats.get(stats.date);
    if (existing) {
      const updated: DailyStats = { 
        ...existing, 
        ...stats,
        focusSessions: stats.focusSessions ?? existing.focusSessions,
        breakSessions: stats.breakSessions ?? existing.breakSessions,
        totalFocusTime: stats.totalFocusTime ?? existing.totalFocusTime,
        totalBreakTime: stats.totalBreakTime ?? existing.totalBreakTime,
        xpEarned: stats.xpEarned ?? existing.xpEarned
      };
      this.dailyStats.set(stats.date, updated);
      return updated;
    } else {
      const id = this.currentStatsId++;
      const newStats: DailyStats = { 
        id, 
        date: stats.date,
        focusSessions: stats.focusSessions ?? 0,
        breakSessions: stats.breakSessions ?? 0,
        totalFocusTime: stats.totalFocusTime ?? 0,
        totalBreakTime: stats.totalBreakTime ?? 0,
        xpEarned: stats.xpEarned ?? 0
      };
      this.dailyStats.set(stats.date, newStats);
      return newStats;
    }
  }

  async getWeeklyStats(startDate: string, endDate: string): Promise<DailyStats[]> {
    const stats = Array.from(this.dailyStats.values()).filter(
      (stat) => stat.date >= startDate && stat.date <= endDate
    );
    return stats.sort((a, b) => a.date.localeCompare(b.date));
  }

  async getUserStats(): Promise<UserStats> {
    return this.userStats;
  }

  async updateUserStats(stats: InsertUserStats): Promise<UserStats> {
    this.userStats = {
      ...this.userStats,
      ...stats
    };
    return this.userStats;
  }

  private async updateDailyStatsAfterSession(session: Session): Promise<void> {
    const existing = await this.getDailyStats(session.date);
    
    // Calculate XP earned (20 XP per focus session, 5 XP per break)
    const xpEarned = session.type === 'focus' ? 20 : 5;
    
    if (existing) {
      const updated: InsertDailyStats = {
        date: session.date,
        focusSessions: session.type === 'focus' ? existing.focusSessions + 1 : existing.focusSessions,
        breakSessions: session.type === 'break' ? existing.breakSessions + 1 : existing.breakSessions,
        totalFocusTime: session.type === 'focus' ? existing.totalFocusTime + session.duration : existing.totalFocusTime,
        totalBreakTime: session.type === 'break' ? existing.totalBreakTime + session.duration : existing.totalBreakTime,
        xpEarned: existing.xpEarned + xpEarned
      };
      await this.updateDailyStats(updated);
    } else {
      const newStats: InsertDailyStats = {
        date: session.date,
        focusSessions: session.type === 'focus' ? 1 : 0,
        breakSessions: session.type === 'break' ? 1 : 0,
        totalFocusTime: session.type === 'focus' ? session.duration : 0,
        totalBreakTime: session.type === 'break' ? session.duration : 0,
        xpEarned: xpEarned
      };
      await this.updateDailyStats(newStats);
    }
    
    // Update user stats
    await this.updateUserStatsAfterSession(session);
  }

  private async updateUserStatsAfterSession(session: Session): Promise<void> {
    const xpEarned = session.type === 'focus' ? 20 : 5;
    const newTotalXP = this.userStats.totalXP + xpEarned;
    
    // Calculate new level (every 100 XP = 1 level)
    const newLevel = Math.floor(newTotalXP / 100) + 1;
    
    // Update streak
    const today = session.date;
    const yesterday = new Date(new Date(today).getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    let newStreak = this.userStats.currentStreak;
    if (this.userStats.lastActiveDate === yesterday) {
      newStreak = this.userStats.currentStreak + 1;
    } else if (this.userStats.lastActiveDate !== today) {
      newStreak = 1; // Reset streak if there's a gap
    }
    
    const newLongestStreak = Math.max(newStreak, this.userStats.longestStreak);
    
    await this.updateUserStats({
      totalXP: newTotalXP,
      level: newLevel,
      currentStreak: newStreak,
      longestStreak: newLongestStreak,
      lastActiveDate: today
    });
  }
}

export const storage = new MemStorage();
