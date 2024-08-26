import { isGameStart, isKillLine } from "../utils/GameTools";
import * as fs from "fs";
import * as readline from "readline";

export class LogReader {
  public async readLines(filePath: string): Promise<string[]> {
    const lines: string[] = [];

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
    });

    for await (const line of rl) {
      if (isGameStart(line) || isKillLine(line)) {
        lines.push(line);
      }
    }

    return lines;
  }
}
