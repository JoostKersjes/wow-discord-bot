import { Command } from 'discord-akairo';
import { User } from 'discord.js';
import { Message, TextChannel } from 'discord.js';

export default class PromoteCommand extends Command {
  constructor() {
    super('promote', {
      aliases: ['promote', 'member'],
      category: 'Public Commands',
      description: {
        content: 'Request a character to b',
        usage: '!promote CHARACTER',
        examples: ['!promote Rundunn', '!member Dundunn'],
      },
      cooldown: 10000,
      ratelimit: 3,
    });
  }

  exec(message: Message): void {
    const name = this.getNameArgument(message);

    if (!this.isValidCharacterName(name)) {
      return;
    }

    const roles = [];
    if (0 === roles.length) {
      this.addRoleToUser(message.author);
    }

    this.createPromotionRequestNotification(message.author, name);
  }

  createPromotionRequestNotification(user: User, characterName: string): void {
    const requestsChannel = this.getPromotionRequestsChannel();

    requestsChannel.send(`${user} requested a promotion for:\n> ${characterName}`).then(message => {
      message.react(':white_check_mark:');
    });
  }

  getNameArgument(message: Message): string {
    throw new Error('Method not implemented.');
  }

  isValidCharacterName(name: string): boolean {
    throw new Error('Method not implemented.');
  }

  addRoleToUser(author: User): void {
    throw new Error('Method not implemented.');
  }

  getPromotionRequestsChannel(): TextChannel {
    throw new Error('Method not implemented.');
  }
}
