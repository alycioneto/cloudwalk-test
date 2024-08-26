import { MeansOfDeath } from "../enums/MeansOfDeath";

export type MatchInfo = {
  total_kills: number;
  players: string[];
  kills: {
    [key: string]: number;
  };
  kills_by_means: {
    [key in MeansOfDeath]?: number;
  };
};
