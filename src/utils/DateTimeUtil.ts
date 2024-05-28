import { DateTime } from "luxon"

export class DateTimeUtils {
  getISONow(): string {
    return DateTime.local().toISO() as string
  }

  getCurrentDate(): Date {
    return DateTime.now().toJSDate()
  }

  getISOCurrentTime(): string {
    return DateTime.now().toISOTime() as string
  }
}

export default new DateTimeUtils()
