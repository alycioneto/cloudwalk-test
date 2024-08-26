import { LogReader } from "../services/LogReader";
import * as fs from "fs";
import * as readline from "readline";

jest.mock("fs");
jest.mock("readline");

describe("LogReader", () => {
  let logReader: LogReader;

  beforeEach(() => {
    logReader = new LogReader();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should read lines from a file", async () => {
    const filePath = "/path/to/file.log";
    const mockReadStream = {} as fs.ReadStream;
    const mockInterface = {} as readline.Interface;
    const mockLines = ["line1", "line2", "line3"];
    const filteredLines: string[] = [];

    (fs.createReadStream as jest.Mock).mockReturnValue(mockReadStream);
    (readline.createInterface as jest.Mock).mockReturnValue(mockInterface);
    mockInterface[Symbol.asyncIterator] = async function* () {
      for (const line of mockLines) {
        yield line;
      }
    };

    const result = await logReader.readLines(filePath);

    expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
    expect(readline.createInterface).toHaveBeenCalledWith({
      input: mockReadStream,
    });
    expect(result).toEqual(filteredLines);
  });

  it("should filter out non-game lines", async () => {
    const filePath = "/path/to/file.log";
    const mockReadStream = {} as fs.ReadStream;
    const mockInterface = {} as readline.Interface;
    const mockLines = ["line1", "line2", "InitGame: 0 1"];
    const filteredLines = ["InitGame: 0 1"];

    (fs.createReadStream as jest.Mock).mockReturnValue(mockReadStream);
    (readline.createInterface as jest.Mock).mockReturnValue(mockInterface);
    mockInterface[Symbol.asyncIterator] = async function* () {
      for (const line of mockLines) {
        yield line;
      }
    };

    const result = await logReader.readLines(filePath);

    expect(fs.createReadStream).toHaveBeenCalledWith(filePath);
    expect(readline.createInterface).toHaveBeenCalledWith({
      input: mockReadStream,
    });
    expect(result).toEqual(filteredLines);
  });
});
