import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSessionSchema, insertUserStatsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create a new session
  app.post("/api/sessions", async (req, res) => {
    try {
      const sessionData = insertSessionSchema.parse(req.body);
      const session = await storage.createSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Session creation error:", error);
      res.status(400).json({ 
        error: "Invalid session data", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get sessions for a specific date
  app.get("/api/sessions/:date", async (req, res) => {
    try {
      const date = req.params.date;
      const sessions = await storage.getSessionsByDate(date);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sessions" });
    }
  });

  // Get recent sessions
  app.get("/api/sessions/recent/:limit", async (req, res) => {
    try {
      const limit = parseInt(req.params.limit) || 10;
      const sessions = await storage.getRecentSessions(limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent sessions" });
    }
  });

  // Get daily stats
  app.get("/api/stats/daily/:date", async (req, res) => {
    try {
      const date = req.params.date;
      const stats = await storage.getDailyStats(date);
      if (!stats) {
        res.json({ 
          date, 
          focusSessions: 0, 
          breakSessions: 0, 
          totalFocusTime: 0, 
          totalBreakTime: 0 
        });
      } else {
        res.json(stats);
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch daily stats" });
    }
  });

  // Get weekly stats
  app.get("/api/stats/weekly", async (req, res) => {
    try {
      const startDate = req.query.startDate as string;
      const endDate = req.query.endDate as string;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ error: "startDate and endDate are required" });
      }

      const stats = await storage.getWeeklyStats(startDate, endDate);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch weekly stats" });
    }
  });

  // Get user stats
  app.get('/api/user/stats', async (req, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ error: 'Failed to fetch user stats' });
    }
  });

  // Update user stats
  app.patch('/api/user/stats', async (req, res) => {
    try {
      const validatedData = insertUserStatsSchema.parse(req.body);
      const stats = await storage.updateUserStats(validatedData);
      res.json(stats);
    } catch (error) {
      console.error('Error updating user stats:', error);
      res.status(500).json({ error: 'Failed to update user stats' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
