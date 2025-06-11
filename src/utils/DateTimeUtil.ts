import { DateTime } from "luxon";
import { eachDayOfInterval, isWeekend, format, parseISO } from "date-fns";

export class DateTimeUtils {
  getISONow(): string {
    return DateTime.local().toISO() as string;
  }

  getCurrentDate(): Date {
    return DateTime.now().toJSDate();
  }

  getISOCurrentTime(): string {
    return DateTime.now().toISOTime() as string;
  }

  eachDayOfInterval(start: Date, end: Date): Date[] {
    const interval = { start, end };
    return eachDayOfInterval(interval);
  }

  isWeekend(date: Date): boolean {
    return isWeekend(date);
  }

  format(date: Date, formatString: string): string {
    return format(date, formatString);
  }

  parseToISO(dateString: string): string {
    const parsedDate = DateTime.fromISO(dateString, { zone: "Africa/Lagos" });

    if (!parsedDate.isValid) {
      return "";
    }

    return parsedDate.toISO() as string;
  }

  getDayOfTheWeek(date: string): string {
    return format(parseISO(date), "EEEE");
  }
}

export default new DateTimeUtils();
