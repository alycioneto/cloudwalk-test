import { MeansOfDeath } from "../enums/MeansOfDeath";
import { MatchInfo } from "../types/MatchInfo";
import {
  extractKilledPlayerFromLine,
  extractKillerFromLine,
  extractMeansOfDeathFromLine,
  extractPlayerKilledByWorld,
  isGameStart,
  isKillLine,
} from "../utils/GameTools";

export class GameLogProcessor {
  private players: Set<string>;
  private kills: Record<string, number>;
  private totalKills: number;
  private currentGameId: number;
  private games: Record<string, MatchInfo>;
  private killsByMeans: Record<MeansOfDeath, number>;

  constructor() {
    this.players = new Set<string>();
    this.kills = {};
    this.totalKills = 0;
    this.currentGameId = 0;
    this.games = {};
    this.killsByMeans = {} as Record<MeansOfDeath, number>;
  }

  public process(lines: string[]): Record<string, MatchInfo> {
    lines.forEach((line) => {
      if (isGameStart(line)) {
        this.startGame();
      } else if (isKillLine(line)) {
        this.processKills(line);
      }
    });

    this.saveCurrentGame();
    return this.games;
  }

  private processKills(line: string) {
    this.registerKilledPlayer(line);
    this.recordPlayerKill(line);
    this.recordWorldKill(line);
    this.recordMeansOfDeath(line);
  }

  private registerKilledPlayer(line: string) {
    const killedPlayer = extractKilledPlayerFromLine(line);
    if (killedPlayer) {
      this.players.add(killedPlayer);
      if (!(killedPlayer in this.kills)) {
        this.kills[killedPlayer] = 0;
      }
    }
  }

  private recordPlayerKill(line: string) {
    const killer = extractKillerFromLine(line);
    if (killer) {
      this.players.add(killer);
      if (!(killer in this.kills)) {
        this.kills[killer] = 0;
      }
      this.kills[killer]++;
      this.totalKills++;
    }
  }

  private recordWorldKill(line: string) {
    const worldKill = extractPlayerKilledByWorld(line);
    if (worldKill) {
      this.kills[worldKill]--;
      this.totalKills++;
    }
  }

  private recordMeansOfDeath(line: string) {
    const meansOfDeath = extractMeansOfDeathFromLine(line);
    if (meansOfDeath) {
      if (!(meansOfDeath in this.killsByMeans)) {
        this.killsByMeans[meansOfDeath] = 0;
      }
      this.killsByMeans[meansOfDeath]++;
    }
  }

  private startGame() {
    if (this.currentGameId > 0) {
      this.saveCurrentGame();
      this.reset();
    }
    this.currentGameId += 1;
  }

  private reset() {
    this.players.clear();
    this.kills = {};
    this.totalKills = 0;
    this.killsByMeans = {} as Record<MeansOfDeath, number>;
  }

  private saveCurrentGame() {
    const gameKey = `game_${this.currentGameId}`;
    this.games[gameKey] = {
      total_kills: this.totalKills,
      players: Array.from(this.players),
      kills: this.kills,
      kills_by_means: this.killsByMeans,
    };
  }
}
