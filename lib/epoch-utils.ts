export function epochToDate(epoch: number): Date {
  // Check if seconds or milliseconds
  if (epoch < 10000000000) {
    return new Date(epoch * 1000);
  }
  return new Date(epoch);
}

export function dateToEpoch(date: Date, ms: boolean = false): number {
  const time = date.getTime();
  return ms ? time : Math.floor(time / 1000);
}

export function formatEpochDate(date: Date): string {
  return date.toUTCString();
}
