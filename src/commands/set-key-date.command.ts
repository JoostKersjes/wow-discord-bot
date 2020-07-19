import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class PingCommand extends Command {
  constructor() {
    super('plan-key', {
      aliases: ['plan', 'time'],
      category: 'Public Commands',
      description: {
        content: 'Plan a time for your key',
        usage: 'plan-key WEEKDAY TIME',
        examples: ['time wed 17:30'],
      },
    });
  }

  exec(message: Message) {
    // TODO
    return message.util.send(`NYI`);
  }
}
