import { Command } from 'discord-akairo';
import { Message, MessageEmbed } from 'discord.js';

import { InstanceRole } from '../models';

export default class RolesCommand extends Command {
  constructor() {
    super('roles', {
      aliases: ['roles'],
      category: 'Public Commands',
      description: {
        content: 'Displays the three roles',
        usage: 'roles',
        examples: ['roles'],
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

    const roles = InstanceRole.list();
    roles.forEach(role => {
      embed.addField(role.name.toUpperCase(), role.aliases.join(', '));
    });

    return embed;
  }
}
