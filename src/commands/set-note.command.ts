import { ArgumentOptions, Command } from 'discord-akairo';
import { DMChannel, Message, NewsChannel, TextChannel } from 'discord.js';
import { Keystone } from '../models';

const allowedArguments: ArgumentOptions[] = [{ id: 'description', match: 'content' }];

export default class SetNoteCommand extends Command {
  constructor() {
    super('set-note', {
      aliases: ['set-note', 'note'],
      args: allowedArguments,
      category: 'Public Commands',
      description: {
        content: 'Set a note for your key',
        usage: 'set-note NOTE',
        examples: ['set-note Planning on timing this', 'note Pushing after'],
      },
      cooldown: 10000,
      ratelimit: 3,
    });
  }

  exec(message: Message, args: { description: string | null }): void {
    const { channel } = message;

    if (!this.isTextChannel(channel)) {
      return;
    }

    const keystone = Keystone.getMostRecentForUser(message.author, channel);

    if (!keystone) {
      return;
    }

    const note = args.description ? args.description.substring(0, 255) : null;

    keystone.setUserDescription(note);

    const keystoneMessage = channel.messages.cache.find(
      message => message.id === keystone.messageId,
    );

    keystoneMessage.edit(null, keystone.buildMessage());

    keystone.saveAsFile(keystoneMessage);

    message.delete();
  }

  private isTextChannel(channel: TextChannel | DMChannel | NewsChannel): channel is TextChannel {
    return channel.type === 'text';
  }
}
