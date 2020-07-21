import { Command, ArgumentOptions } from 'discord-akairo';
import { Message, TextChannel, NewsChannel, DMChannel } from 'discord.js';
import { Keystone } from '../models';

const allowedArguments: ArgumentOptions[] = [{ id: 'number', type: 'number' }];

export default class DeclineCommand extends Command {
  constructor() {
    super('decline', {
      aliases: ['decline', 'kick', 'uninvite'],
      args: allowedArguments,
      category: 'Public Commands',
      description: {
        content: 'Decline a user from your key',
        usage: 'decline USERNAME',
        examples: ['decline Dundunn'],
      },
    });
  }

  exec(message: Message, args: any) {
    const { channel } = message;

    if (!this.isTextChannel(channel)) {
      return;
    }

    const keystone = Keystone.getMostRecentForUser(message.author, channel);

    if (!keystone) {
      message.delete();

      return;
    }

    const number = this.validateMemberNumber(args.number);

    if (null === number) {
      message.delete();

      return;
    }

    const members = keystone.group.members;
    const selected = members[number - 1];

    channel.guild.members.fetch(selected.userId).then(guildMember => {
      if (selected.leader || !selected.userId) {
        return;
      }

      const role = keystone.group.cancelSignUp(guildMember.user);

      const message = channel.messages.cache.find(message => message.id === keystone.messageId);

      message.edit(null, keystone.buildMessage());

      message.react(role.emoji);

      keystone.saveAsFile(message);
    });

    message.delete();
  }

  private isTextChannel(channel: TextChannel | DMChannel | NewsChannel): channel is TextChannel {
    return channel.type === 'text';
  }

  private validateMemberNumber(memberNumberArgument: number | null): number | null {
    if (memberNumberArgument === null) {
      return null;
    }

    return memberNumberArgument > 5 ? null : Math.max(1, memberNumberArgument);
  }
}
