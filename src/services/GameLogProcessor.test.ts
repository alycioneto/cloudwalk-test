import { MeansOfDeath } from "./../enums/MeansOfDeath";
import { GameLogProcessor } from "../services/GameLogProcessor";
import { MatchInfo } from "../types/MatchInfo";

describe("GameLogProcessor", () => {
  let gameLogProcessor: GameLogProcessor;

  beforeEach(() => {
    gameLogProcessor = new GameLogProcessor();
  });

  it("should process game log lines and return game information", () => {
    const lines = [
      "ClientUserinfoChanged: 2",
      "Kill: 3 4 5: player1 killed player2 by MOD_RAILGUN",
      "Kill: 6 7 8: player3 killed player1 by MOD_ROCKET",
      "Kill: 9 10 11: player2 killed player3 by MOD_SHOTGUN",
      "ShutdownGame: 12",
    ];

    const expectedGames: Record<string, MatchInfo> = {
      game_0: {
        total_kills: 3,
        players: ["player2", "player1", "player3"],
        kills: {
          player1: 1,
          player2: 1,
          player3: 1,
        },
        kills_by_means: {
          [MeansOfDeath.MOD_RAILGUN]: 1,
          [MeansOfDeath.MOD_ROCKET]: 1,
          [MeansOfDeath.MOD_SHOTGUN]: 1,
        },
      },
    };

    const result = gameLogProcessor.process(lines);

    expect(result).toEqual(expectedGames);
  });

  it("should handle player killed by the world correctly", () => {
    const lines = [
      "0:00 InitGame: ",
      "ClientUserinfoChanged: 2",
      "21:07 Kill: 1022 2 22: <world> killed player1 by MOD_TRIGGER_HURT",
      "ShutdownGame: 12",
    ];

    const expectedGames: Record<string, MatchInfo> = {
      game_1: {
        total_kills: 1,
        players: ["player1"],
        kills: {
          player1: -1,
        },
        kills_by_means: {
          [MeansOfDeath.MOD_TRIGGER_HURT]: 1,
        },
      },
    };

    const result = gameLogProcessor.process(lines);

    expect(result).toEqual(expectedGames);
  });

  it("Should handle a game without deaths", () => {
    const lines = ["0:00 InitGame: "];

    const expectedGames: Record<string, MatchInfo> = {
      game_1: {
        total_kills: 0,
        players: [],
        kills: {},
        kills_by_means: {},
      },
    };

    const result = gameLogProcessor.process(lines);

    expect(result).toEqual(expectedGames);
  });

  it("should remove a death when killed by world", () => {
    const lines = [
      "0:00 InitGame: ",
      "ClientUserinfoChanged: 2",
      "21:07 Kill: 3 4 5: player1 killed player2 by MOD_RAILGUN",
      "21:07 Kill: 6 7 8: player3 killed player1 by MOD_ROCKET",
      "21:07 Kill: 9 10 11: player2 killed player3 by MOD_SHOTGUN",
      "21:07 Kill: 1022 2 22: <world> killed player1 by MOD_TRIGGER_HURT",
      "ShutdownGame: 12",
    ];

    const expectedGames: Record<string, MatchInfo> = {
      game_1: {
        total_kills: 4,
        players: ["player2", "player1", "player3"],
        kills: {
          player1: 0,
          player2: 1,
          player3: 1,
        },
        kills_by_means: {
          [MeansOfDeath.MOD_RAILGUN]: 1,
          [MeansOfDeath.MOD_ROCKET]: 1,
          [MeansOfDeath.MOD_SHOTGUN]: 1,
          [MeansOfDeath.MOD_TRIGGER_HURT]: 1,
        },
      },
    };

    const result = gameLogProcessor.process(lines);

    expect(result).toEqual(expectedGames);
  });

  it("Should process two matches", () => {
    const lines = [
      "InitGame: 0 1",
      "ClientUserinfoChanged: 2",
      "Kill: 1022 2 22: <world> killed player1 by MOD_TRIGGER_HURT",
      "Kill: 2 3 6: player1 killed player2 by MOD_RAILGUN",
      "InitGame: 0 2",
      "ClientUserinfoChanged: 3",
      "Kill: 3 4 7: player3 killed player4 by MOD_ROCKET",
      "Kill: 4 3 8: player4 killed player3 by MOD_SHOTGUN",
    ];

    const expectedGames: Record<string, MatchInfo> = {
      game_1: {
        total_kills: 2,
        players: ["player1", "player2"],
        kills: {
          player1: 0,
          player2: 0,
        },
        kills_by_means: {
          [MeansOfDeath.MOD_TRIGGER_HURT]: 1,
          [MeansOfDeath.MOD_RAILGUN]: 1,
        },
      },
      game_2: {
        total_kills: 2,
        players: ["player4", "player3"],
        kills: {
          player3: 1,
          player4: 1,
        },
        kills_by_means: {
          [MeansOfDeath.MOD_ROCKET]: 1,
          [MeansOfDeath.MOD_SHOTGUN]: 1,
        },
      },
    };

    const result = gameLogProcessor.process(lines);

    expect(result).toEqual(expectedGames);
  });
});
