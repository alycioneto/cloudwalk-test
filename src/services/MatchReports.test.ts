import { GameLogProcessor } from "./GameLogProcessor";
import { MatchReports } from "./MatchReports";

describe("MatchReports", () => {
  let gameLogProcessor: GameLogProcessor;
  let matchReports: MatchReports;

  beforeEach(() => {
    gameLogProcessor = new GameLogProcessor();
    matchReports = new MatchReports(gameLogProcessor);
  });

  it("Should ranking players", () => {
    const lines = [
      "InitGame: 0 1",
      "ClientUserinfoChanged: 2",
      "Kill: 1022 2 22: <world> killed player1 by MOD_TRIGGER_HURT",
      "Kill: 2 3 6: player1 killed player2 by MOD_RAILGUN",
      "Kill: 2 3 6: player1 killed player2 by MOD_RAILGUN",
      "Kill: 2 3 6: player1 killed player2 by MOD_RAILGUN",
      "ShutdownGame: 12",
      "InitGame: 0 2",
      "ClientUserinfoChanged: 3",
      "Kill: 3 4 7: player3 killed player4 by MOD_ROCKET",
      "Kill: 4 3 8: player4 killed player3 by MOD_SHOTGUN",
      "Kill: 1022 2 22: <world> killed player3 by MOD_TRIGGER_HURT",
      "Kill: 1022 2 22: <world> killed player3 by MOD_TRIGGER_HURT",
      "ShutdownGame: 24",
    ];

    const games = gameLogProcessor.process(lines);

    const matchReportsResult = matchReports["getMatchReports"](games);
    const playerRankingResult = matchReports["getPlayerRanking"](games);

    expect(matchReportsResult).toEqual({
      game_1: {
        total_kills: 4,
        players: [
          { name: "player1", kills: 2 },
          { name: "player2", kills: 0 },
        ],
      },
      game_2: {
        total_kills: 4,
        players: [
          { name: "player4", kills: 1 },
          { name: "player3", kills: -1 },
        ],
      },
    });

    expect(playerRankingResult).toEqual([
      { player: "player1", kills: 2 },
      { player: "player4", kills: 1 },
      { player: "player2", kills: 0 },
      { player: "player3", kills: -1 },
    ]);
  });

  it("Should ranking death causes", () => {
    const lines = [
      "InitGame: 0 1",
      "ClientUserinfoChanged: 2",
      "Kill: 1022 2 22: <world> killed player1 by MOD_TRIGGER_HURT",
      "Kill: 2 3 6: player1 killed player2 by MOD_RAILGUN",
      "Kill: 2 3 6: player1 killed player2 by MOD_RAILGUN",
      "Kill: 2 3 6: player1 killed player2 by MOD_RAILGUN",
      "ShutdownGame: 12",
      "InitGame: 0 2",
      "ClientUserinfoChanged: 3",
      "Kill: 3 4 7: player3 killed player4 by MOD_ROCKET",
      "Kill: 4 3 8: player4 killed player3 by MOD_SHOTGUN",
      "Kill: 1022 2 22: <world> killed player3 by MOD_TRIGGER_HURT",
      "Kill: 1022 2 22: <world> killed player3 by MOD_TRIGGER_HURT",
      "ShutdownGame: 24",
    ];

    const games = gameLogProcessor.process(lines);

    const matchReportsResult = matchReports["getMatchReports"](games);
    const deathCausesRankingResult =
      matchReports["getDeathCausesRanking"](games);

    expect(matchReportsResult).toEqual({
      game_1: {
        total_kills: 4,
        players: [
          { name: "player1", kills: 2 },
          { name: "player2", kills: 0 },
        ],
      },
      game_2: {
        total_kills: 4,
        players: [
          { name: "player4", kills: 1 },
          { name: "player3", kills: -1 },
        ],
      },
    });

    expect(deathCausesRankingResult).toEqual([
      { cause: "MOD_TRIGGER_HURT", count: 3 },
      { cause: "MOD_RAILGUN", count: 3 },
      { cause: "MOD_ROCKET", count: 1 },
      { cause: "MOD_SHOTGUN", count: 1 },
    ]);
  });
});
