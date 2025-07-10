import { sessions, dailyStats, type Session, type InsertSession, type DailyStats, type InsertDailyStats } from "@shared/schema";

export interface IStorage {
  // Session methods
  createSession(session: InsertSession): Promise<Session>;
  getSessionsByDate(date: string): Promise<Session[]>;
  getRecentSessions(limit: number): Promise<Session[]>;
  
  // Daily stats methods
  getDailyStats(date: string): Promise<DailyStats | undefined>;
  updateDailyStats(stats: InsertDailyStats): Promise<DailyStats>;
  getWeeklyStats(startDate: string, endDate: string): Promise<DailyStats[]>;
}

export class MemStorage implements IStorage {
  private sessions: Map<number, Session>;
  private dailyStats: Map<string, DailyStats>;
  private currentSessionId: number;
  private currentStatsId: number;

  constructor() {
    this.sessions = new Map();
    this.dailyStats = new Map();
    this.currentSessionId = 1;
    this.currentStatsId = 1;
  }

  async createSession(insertSession: InsertSession): Promise<Session> {
    const id = this.currentSessionId++;
    const session: Session = { ...insertSession, id };
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
      const updated: DailyStats = { ...existing, ...stats };
      this.dailyStats.set(stats.date, updated);
      return updated;
    } else {
      const id = this.currentStatsId++;
      const newStats: DailyStats = { id, ...stats };
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

  private async updateDailyStatsAfterSession(session: Session): Promise<void> {
    const existing = await this.getDailyStats(session.date);
    
    if (existing) {
      const updated: InsertDailyStats = {
        date: session.date,
        focusSessions: session.type === 'focus' ? existing.focusSessions + 1 : existing.focusSessions,
        breakSessions: session.type === 'break' ? existing.breakSessions + 1 : existing.breakSessions,
        totalFocusTime: session.type === 'focus' ? existing.totalFocusTime + session.duration : existing.totalFocusTime,
        totalBreakTime: session.type === 'break' ? existing.totalBreakTime + session.duration : existing.totalBreakTime,
      };
      await this.updateDailyStats(updated);
    } else {
      const newStats: InsertDailyStats = {
        date: session.date,
        focusSessions: session.type === 'focus' ? 1 : 0,
        breakSessions: session.type === 'break' ? 1 : 0,
        totalFocusTime: session.type === 'focus' ? session.duration : 0,
        totalBreakTime: session.type === 'break' ? session.duration : 0,
      };
      await this.updateDailyStats(newStats);
    }
  }
}

export const storage = new MemStorage();
