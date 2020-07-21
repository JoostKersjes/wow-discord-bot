import { startOfWeek, isAfter, subDays, getDay, parse, addDays } from 'date-fns';

export class Day {
  getDate(): Date {
    const today = new Date();
    const dayNumber = getDay(today);

    let dayInterval = this.id - dayNumber;
    if (dayInterval < 0) {
      dayInterval + 7;
    }

    return addDays(today, dayInterval);
  }

  private constructor(readonly id: number, readonly name: string) {}

  static euRotationWeek(): Day[] {
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

  static byDayNumber(dayNumber: number) {
    return this.euRotationWeek().find(day => day.id === dayNumber);
  }

  static remainingRotationDays(): Day[] {
    const today = new Date();
    const dayNumber = getDay(today);
    const rotation = this.euRotationWeek();

    return rotation.slice(rotation.findIndex(day => day.id === dayNumber));
  }

  static byString(string: string | null): Day {
    string = string.toLowerCase();
    const today = new Date();

    if ('today' === string || null === string) {
      return this.byDayNumber(getDay(today));
    }

    if ('tomorrow' === string) {
      return this.byDayNumber(getDay(today) + 1);
    }

    const days = this.remainingRotationDays().filter(day => {
      return day.name.toLowerCase().includes(string.toLowerCase());
    });

    return days.shift();
  }

  private lastReset(): Date {
    const currentDate = new Date();

    const wednesday = startOfWeek(currentDate, { weekStartsOn: 3 });
    wednesday.setHours(9);

    if (isAfter(currentDate, wednesday)) {
      return wednesday;
    }

    return subDays(wednesday, 7);
  }
}
