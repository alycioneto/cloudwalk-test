import { GameLogProcessor } from "./services/GameLogProcessor";
import { LogReader } from "./services/LogReader";
import { MatchReports } from "./services/MatchReports";

const logReader = new LogReader();
const logParser = new GameLogProcessor();
const matchReports = new MatchReports(logParser);

(async () => {
  const lines = await logReader.readLines("data/logs.txt");
  matchReports.generateReports(lines);
})();
