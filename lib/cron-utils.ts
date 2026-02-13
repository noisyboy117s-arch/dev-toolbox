export interface CronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export function generateCron(parts: CronParts): string {
  return `${parts.minute} ${parts.hour} ${parts.dayOfMonth} ${parts.month} ${parts.dayOfWeek}`;
}

export function parseCron(cron: string): CronParts {
  const [minute, hour, dayOfMonth, month, dayOfWeek] = cron.split(' ');
  return { minute, hour, dayOfMonth, month, dayOfWeek };
}
