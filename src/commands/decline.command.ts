import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class DeclineCommand extends Command {
  constructor() {
    super('decline', {
      aliases: ['decline', 'kick', 'uninvite'],
      category: 'Public Commands',
      description: {
        content: 'Decline a user from your key',
        usage: 'decline USER',
        examples: ['decline @Dundunn#4577'],
      },
    });
  }

  exec(message: Message) {
    // TODO
    return message.util.send(`NYI`);
  }
}
