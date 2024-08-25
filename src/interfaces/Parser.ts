import { MatchInfo } from "@/types/MatchInfo";

export interface Parser {
  parse(line: string[]): MatchInfo;
}
