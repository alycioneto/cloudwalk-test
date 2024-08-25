import { LogParser } from "./services/LogParser";
import { Reader } from "./interfaces/Reader";
import { LogReader } from "./services/LogReader";
import { Parser } from "./interfaces/Parser";

const logReader: Reader = new LogReader();
const logParser: Parser = new LogParser();

(async () => {
  const lines = await logReader.readLines("data/logs.txt");
  const matchInfo = logParser.parse(lines);
  console.log(matchInfo);
})();
