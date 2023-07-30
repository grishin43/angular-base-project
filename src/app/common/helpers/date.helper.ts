import * as moment from "moment";
import {Moment} from "moment";

export class DateHelper {

  public static get fullFormat(): string {
    return 'dd.MM.yyyy HH:mm:ss';
  }

  public static get shortFormat(): string {
    return 'dd.MM.yyyy';
  }

  public static getTimezone(): string | null {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch (e) {
      return null;
    }
  }

  public static mergeDateTime(date: string, time: string): string | undefined {
    if (date && time) {
      const [hours, minutes] = time.split(':');
      const mergedDate: Date = new Date(date);
      mergedDate.setHours(+hours);
      mergedDate.setMinutes(+minutes);
      return moment(mergedDate).toISOString(true);
    }
    return date;
  }

  public static formatTime(timeInMilliseconds: number): string {
    const totalSeconds = Math.floor(timeInMilliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

}
