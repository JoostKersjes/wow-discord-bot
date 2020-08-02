import { Message, MessageEmbed } from 'discord.js';
import { Command } from 'discord-akairo';
import { Dungeon } from '../models';

export default class DungeonsCommand extends Command {
  constructor() {
    super('dungeons', {
      aliases: ['dungeons', 'dungs'],
      category: 'Public Commands',
      description: {
        content: 'Displays a list of dungeons for the current M+ season',
        usage: 'dungeons',
        examples: ['dungeons'],
      },
      cooldown: 10000,
      ratelimit: 3,
    });
  }

  exec(message: Message): void {
    message.util.send(null, this.buildMessage());
  }

  private buildMessage(): MessageEmbed {
    const embed = new MessageEmbed();

    const dungeons = Dungeon.currentKeystoneDungeons();
    dungeons.forEach(dungeon => {
      embed.addField(dungeon.name, dungeon.aliases.join(', '), true);
    });

    return embed;
  }
}
