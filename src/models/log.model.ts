import { join } from 'path';
import { Keystone } from './keystone.model';
import { LogLevels } from './types';
import { formatISO } from 'date-fns';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

export class Log {
  private static logDirectory = join(__dirname, '..', 'logs');

  static error(message: string) {
    console.error(message);
    this.writeLogToFile(message, 'ERROR');
  }

  static warning(message: string) {
    console.warn(message);
    this.writeLogToFile(message, 'WARNING');
  }

  static notice(message: string) {
    console.log(message);
    this.writeLogToFile(message, 'NOTICE');
  }

  static debug(message: string) {
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
