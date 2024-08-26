import { MeansOfDeath } from "../enums/MeansOfDeath";
export function isGameStart(line: string): boolean {
  return line.includes("InitGame");
}

export function isKillLine(line: string): boolean {
  return line.includes("killed");
}

export function extractKilledPlayerFromLine(line: string): string | null {
  const killedMatch = line.match(/killed\s+(.+?)\s+by/);
  if (killedMatch) {
    return killedMatch[1].trim();
  }

  return null;
}

export function extractKillerFromLine(line: string): string | null {
  const killerMatch = line.match(/\s+(\S+)\s+killed/);
  if (killerMatch) {
    const killer = killerMatch[1].trim();
    if (killer !== "<world>") {
      return killer;
    }
  }

  return null;
}

export function extractPlayerKilledByWorld(line: string): string | null {
  const playerKilled = line.match(/<world>\s+killed\s+(.+?)\s+by/);
  if (playerKilled) {
    return playerKilled[1].trim();
  }

  return null;
}

export function extractMeansOfDeathFromLine(line: string): MeansOfDeath | null {
  const meansOfDeathPattern = /by (\w+)$/;
  const match = line.match(meansOfDeathPattern);
  if (match && match[1]) {
    return match[1] as unknown as MeansOfDeath;
  }
  return null;
}
