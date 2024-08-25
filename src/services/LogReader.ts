import { Reader } from "@/interfaces/Reader";
import * as fs from "fs";
import * as readline from "readline";

export class LogReader implements Reader {
  public async readLines(filePath: string): Promise<string[]> {
    const lines: string[] = [];

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
    });

    for await (const line of rl) {
      lines.push(line);
    }

    return lines;
  }
}
