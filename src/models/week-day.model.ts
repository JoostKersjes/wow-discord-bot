import { getDay, addDays } from 'date-fns';

export class WeekDay {
  getDate(): Date {
    const today = new Date();
    const dayNumber = getDay(today);

    let dayInterval = this.dayNumber - dayNumber;
    if (dayInterval < 0) {
      dayInterval += 7;
    }

    return addDays(today, dayInterval);
  }

  private constructor(readonly dayNumber: number, readonly name: string) {}

  static euRotationWeek(): WeekDay[] {
    // EU servers reset at wednesday 07:00 UTC
    return [
      new this(3, 'wednesday'),
      new this(4, 'thursday'),
      new this(5, 'friday'),
      new this(6, 'saturday'),
      new this(0, 'sunday'),
      new this(1, 'monday'),
      new this(2, 'tuesday'),
    ];
  }

  static byDayNumber(dayNumber: number): WeekDay {
    return this.euRotationWeek().find(weekDay => weekDay.dayNumber === dayNumber);
  }

  static remainingRotationDays(): WeekDay[] {
    const now = new Date();
    const dayNumber = getDay(now);
    const rotation = this.euRotationWeek();

    return rotation.slice(rotation.findIndex(weekDay => weekDay.dayNumber === dayNumber));
  }

  static byString(string: string | null): WeekDay {
    string = string.toLowerCase();

    const now = new Date();

    if ('today' === string || null === string) {
      return this.byDayNumber(getDay(now));
    }

    if ('tomorrow' === string) {
      return this.byDayNumber(getDay(now) + 1);
    }

    const weekDays = this.remainingRotationDays().filter(weekDay => {
      return weekDay.name.toLowerCase().includes(string.toLowerCase());
    });

    return weekDays.shift();
  }
}
