import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { formatISO } from 'date-fns';
import { LogLevels } from './types';

export class Log {
  private static logDirectory = join(__dirname, '..', 'logs');

  static error(message: string): void {
    console.error(message);
    this.writeLogToFile(message, 'ERROR');
  }

  static warning(message: string): void {
    console.warn(message);
    this.writeLogToFile(message, 'WARNING');
  }

  static notice(message: string): void {
    console.log(message);
    this.writeLogToFile(message, 'NOTICE');
  }

  static debug(message: string): void {
    this.writeLogToFile(message, 'DEBUG');
  }

  private static writeLogToFile(message: string, level: LogLevels) {
    const now = new Date();
    const filePath = join(this.logDirectory, `${formatISO(now, { representation: 'date' })}.log`);
    const line = `${formatISO(now)} | [${level}] ${message}\n`;

    if (!existsSync(filePath)) {
      mkdirSync(this.logDirectory, { recursive: true });
    }

    try {
      writeFileSync(filePath, line, { flag: 'a' });
    } catch (error) {
      console.error(error.message);
    }
  }
}
