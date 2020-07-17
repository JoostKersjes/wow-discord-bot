import { Command } from 'discord-akairo';
import { Message } from 'discord.js';

export default class PingCommand extends Command {
  constructor() {
    super('ping', {
      aliases: ['ping'],
      category: 'Public Commands',
      description: {
        content: 'Check the latency to the Discord API',
        usage: 'ping',
        examples: ['ping'],
      },
    });
  }

  exec(message: Message) {
    return message.util.send(`Pong! \`${this.client.ws.ping}ms\``);
  }
}
