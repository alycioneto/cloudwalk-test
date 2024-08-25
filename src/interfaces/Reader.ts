export interface Reader {
  readLines(filePath: string): Promise<string[]>;
}
