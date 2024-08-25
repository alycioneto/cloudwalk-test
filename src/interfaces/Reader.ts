export interface Reader {
  readAndParseLines(filePath: string): Promise<string[]>;
}
