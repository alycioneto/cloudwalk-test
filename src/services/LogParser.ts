import { MatchInfo } from "@/types/MatchInfo";

export class LogParser {
  private players: Set<string>;
  private kills: Record<string, number>;
  private totalKills: number;

  constructor() {
    this.players = new Set<string>();
    this.kills = {};
    this.totalKills = 0;
  }

  public parse(lines: string[]): MatchInfo {
    lines.forEach((line) => {
      const player = this.extractPlayersFromLine(line);
      if (player) {
        this.players.add(player);
        if (!(player in this.kills)) {
          this.kills[player] = 0;
        }
      }

      const killer = this.extractKillsFromLine(line);
      if (killer) {
        this.kills[killer] = (this.kills[killer] || 0) + 1;
      }

      const worldKill = this.extractWorldKillFromLine(line);
      if (worldKill) {
        this.kills[worldKill] = Math.max((this.kills[worldKill] || 0) - 1, 0);
      }

      this.totalKills += 1;
    });

    return {
      total_kills: this.totalKills,
      players: Array.from(this.players),
      kills: this.kills,
    };
  }

  private extractPlayersFromLine(line: string): string | null {
    const killMatch = line.match(/killed\s+(.+?)\s+by/);
    if (killMatch) {
      return killMatch[1].trim();
    }

    return null;
  }

  private extractKillsFromLine(line: string): string | null {
    const killerMatch = line.match(/\s+(\S+)\s+killed/);
    if (killerMatch) {
      const killer = killerMatch[1].trim();
      if (killer !== "<world>") {
        return killer;
      }
    }

    return null;
  }

  private extractWorldKillFromLine(line: string): string | null {
    const worldKillMatch = line.match(/<world>\s+killed\s+(.+?)\s+by/);
    if (worldKillMatch) {
      return worldKillMatch[1].trim();
    }

    return null;
  }
}

export default LogParser;
