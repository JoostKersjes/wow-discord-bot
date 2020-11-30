import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

export default class HelpCommand extends Command {
  constructor() {
    super('help', {
      aliases: ['help', 'h'],
      category: 'Public Commands',
      description: {
        content: 'Shows helpful usage notes for all commands',
        usage: 'help',
        examples: ['help'],
      },
      prefix: '!',
      cooldown: 10000,
      ratelimit: 3,
    });
  }

  exec(message: Message): void {
    message.util.send(null, this.buildMessage());
  }

  private buildMessage(): MessageEmbed {
    return new MessageEmbed().setDescription(this.buildEmbedDescription());
  }

  private buildEmbedDescription(): string {
    let description = '';

    description += `**${this.prefix}help**: Shows this helpful message :)\n\n`;

    description += `**${this.prefix}key**: Creates a new Keystone\n`;
    description += `Aliases: _${this.prefix}m+, ${this.prefix}keystone_\n`;
    description += `Arguments:\n`;
    description += `- _dungeon:_ The dungeon of your keystone. See ${this.prefix}dungeons for the options.\n`;
    description += `- _level:_ The level of the keystone. Numerical value. Examples: "6", "15"\n`;
    description += `- _[role:]_ The role you are playing. See ${this.prefix}roles for the options. Defaults to "dps".\n`;
    description += `Usage: **${this.prefix}key halls 12 tank**\n`;
    description += `Note: The creator of a keystone can add a 🗑️ reaction to delete it.\n`;
    description += '\n';

    description += `**${this.prefix}dungeons**: Shows all current Keystone dungeons\n`;
    description += `Aliases: _${this.prefix}dungs_\n`;
    description += '\n';

    description += `**${this.prefix}roles**: Explains the three roles\n`;
    description += '\n';

    description += `**${this.prefix}set-note**: Set a note for your most recently create keystone\n`;
    description += `Aliases: _${this.prefix}note_\n`;
    description += `Arguments:\n`;
    description += `- _note:_ The note you want to set. Can use **bold** text and emoji.\n`;
    description += `Usage: **${this.prefix}note Want to do this in time please :smiley_cat:**\n`;
    description += '\n';

    description += `**${this.prefix}set-time**: Set a time for your most recently create keystone\n`;
    description += `Aliases: _${this.prefix}time, ${this.prefix}when_\n`;
    description += `Arguments:\n`;
    description += `- _time:_ Hours and minutes, 24-hour notation. Examples: "17:05", "8:30"\n`;
    description += `- _[day:]_ Day of the week. Only accepts days before next reset. Defaults to "today". Examples: "thursday", "thu", "today", "tomorrow"\n`;
    description += `Usage: **${this.prefix}time 19:20 tomorrow**\n`;
    description += '\n';

    return description;
  }
}
