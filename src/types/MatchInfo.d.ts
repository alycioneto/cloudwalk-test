type MatchInfo<User extends string> = {
  total_kills: number;
  players: User[];
  kills: {
    [key in User]: number;
  };
};
