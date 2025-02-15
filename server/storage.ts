import { scores, type Score, type InsertScore } from "@shared/schema";

export interface IStorage {
  createScore(score: InsertScore): Promise<Score>;
  getScoresBySong(songId: string): Promise<Score[]>;
}

export class MemStorage implements IStorage {
  private scores: Map<number, Score>;
  private currentId: number;

  constructor() {
    this.scores = new Map();
    this.currentId = 1;
  }

  async createScore(insertScore: InsertScore): Promise<Score> {
    const id = this.currentId++;
    const score: Score = { ...insertScore, id };
    this.scores.set(id, score);
    return score;
  }

  async getScoresBySong(songId: string): Promise<Score[]> {
    return Array.from(this.scores.values()).filter(
      (score) => score.songId === songId
    );
  }
}

export const storage = new MemStorage();