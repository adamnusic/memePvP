import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertScoreSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  app.post('/api/scores', async (req, res) => {
    try {
      const scoreData = insertScoreSchema.parse(req.body);
      const score = await storage.createScore(scoreData);
      res.json(score);
    } catch (error) {
      res.status(400).json({ error: "Invalid score data" });
    }
  });

  app.get('/api/scores/:songId', async (req, res) => {
    const scores = await storage.getScoresBySong(req.params.songId);
    res.json(scores);
  });

  const httpServer = createServer(app);
  return httpServer;
}
