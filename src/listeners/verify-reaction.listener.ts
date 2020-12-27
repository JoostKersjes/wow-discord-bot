import { Listener } from 'discord-akairo';
import { User } from 'discord.js';
import { MessageReaction } from 'discord.js';

export default class VerifyReactionListener extends Listener {
  constructor() {
    super('verify-reaction', {
      emitter: 'client',
      event: 'messageReactionAdd',
      category: 'client',
    });
  }

  exec(reaction: MessageReaction, user: User): void {
    if (this.skipEvent(reaction, user)) {
      return;
    }

    if ('✅' !== reaction.emoji.toString()) {
      return;
    }

    reaction.message.delete();
  }

  skipEvent(reaction: MessageReaction, user: User): boolean {
    const { message } = reaction;

    return (
      user.bot || message.author.id !== this.client.user.id || !message.content.includes('verify')
    );
  }
}
