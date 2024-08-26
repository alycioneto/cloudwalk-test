import { GameLogProcessor } from "./GameLogProcessor";
import { MatchInfo } from "../types/MatchInfo";

export class MatchReports {
  private gameLogProcessor: GameLogProcessor;

  constructor(gameLogProcessor: GameLogProcessor) {
    this.gameLogProcessor = gameLogProcessor;
  }

  public generateReports(lines: string[]): void {
    const games = this.gameLogProcessor.process(lines);
    const matchReports = this.getMatchReports(games);
    const playerRanking = this.getPlayerRanking(games);
    const deathCausesRanking = this.getDeathCausesRanking(games);

    this.printMatchReports(matchReports);
    this.printPlayerRanking(playerRanking);
    this.printDeathCausesRanking(deathCausesRanking);
  }

  private getMatchReports(
    games: Record<string, MatchInfo>,
  ): Record<string, any> {
    const reports: Record<string, any> = {};

    Object.entries(games).forEach(([gameId, matchInfo]) => {
      const sortedPlayers = Array.from(matchInfo.players).sort((a, b) => {
        const killsA = matchInfo.kills[a] || 0;
        const killsB = matchInfo.kills[b] || 0;
        return killsB - killsA;
      });

      reports[gameId] = {
        total_kills: matchInfo.total_kills,
        players: sortedPlayers.map((player) => ({
          name: player,
          kills: matchInfo.kills[player] || 0,
        })),
      };
    });

    return reports;
  }

  private getPlayerRanking(
    games: Record<string, MatchInfo>,
  ): { player: string; kills: number }[] {
    const playerKills: Record<string, number> = {};

    Object.values(games).forEach((matchInfo) => {
      Object.entries(matchInfo.kills).forEach(([player, kills]) => {
        if (!playerKills[player]) {
          playerKills[player] = 0;
        }
        playerKills[player] += kills;
      });
    });

    return Object.entries(playerKills)
      .sort((a, b) => b[1] - a[1])
      .map(([player, kills]) => ({ player, kills }));
  }

  private getDeathCausesRanking(
    games: Record<string, MatchInfo>,
  ): { cause: string; count: number }[] {
    const deathCauses: Record<string, number> = {};

    Object.values(games).forEach((matchInfo) => {
      Object.entries(matchInfo.kills_by_means).forEach(([cause, count]) => {
        if (!deathCauses[cause]) {
          deathCauses[cause] = 0;
        }
        deathCauses[cause] += count;
      });
    });

    return Object.entries(deathCauses)
      .sort((a, b) => b[1] - a[1])
      .map(([cause, count]) => ({ cause, count }));
  }

  private printMatchReports(reports: Record<string, any>): void {
    console.log("Match Reports:");
    Object.entries(reports).forEach(([gameId, report]) => {
      console.log(`\n${gameId}:`);
      console.log(`Total Kills: ${report.total_kills}`);

      console.log("Player".padEnd(30) + "Kills");
      console.log("-".repeat(40));

      report.players.forEach((player: { name: string; kills: number }) => {
        console.log(
          player.name.padEnd(30) + player.kills.toString().padStart(10),
        );
      });
    });
  }

  private printPlayerRanking(
    ranking: { player: string; kills: number }[],
  ): void {
    console.log("\nAll Matches Player Ranking:");
    ranking.forEach(({ player, kills }, index) => {
      console.log(`${index + 1}. ${player}: ${kills} kills`);
    });
  }

  private printDeathCausesRanking(
    ranking: { cause: string; count: number }[],
  ): void {
    console.log("\nDeath Causes Ranking:");
    ranking.forEach(({ cause, count }, index) => {
      console.log(`${index + 1}. ${cause}: ${count} deaths`);
    });
  }
}
