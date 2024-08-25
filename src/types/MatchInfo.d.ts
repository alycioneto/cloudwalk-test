export type MatchInfo = {
  total_kills: number;
  players: string[];
  kills: {
    [key: string]: number;
  };
};
