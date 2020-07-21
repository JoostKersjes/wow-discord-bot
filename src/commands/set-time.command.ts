import { Command, ArgumentOptions } from 'discord-akairo';
import { Message, TextChannel, DMChannel, NewsChannel } from 'discord.js';
import { Keystone, Day } from '../models';
import { parse } from 'date-fns';

const allowedArguments: ArgumentOptions[] = [
  { id: 'time', type: 'string' },
  { id: 'day', type: 'string', default: 'today' },
];

export default class SetTimeCommand extends Command {
  constructor() {
    super('set-time', {
      aliases: ['set-time', 'time', 'when'],
      args: allowedArguments,
      category: 'Public Commands',
      description: {
        content: 'Plan a time for your key',
        usage: 'set-time TIME [WEEKDAY]',
        examples: ['set-time 17:30 wed ', 'time 9:00 tomorrow'],
      },
      cooldown: 10000,
      ratelimit: 3,
    });
  }

  exec(message: Message, args: any) {
    const { channel } = message;

    if (!this.isTextChannel(channel)) {
      return;
    }

    const time = this.parseTimeArgument(args.time);

    if (!time) {
      return this.getArgumentErrorMessage(message, 'time', args.time);
    }

    const day = Day.byString(args.day);

    if (!day) {
      return this.getArgumentErrorMessage(message, 'day', args.day);
    }

    const keystone = Keystone.getMostRecentForUser(message.author, channel);

    if (!keystone) {
      return;
    }

    const date = day.getDate();

    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());

    keystone.setStartTime(date);

    const keystoneMessage = channel.messages.cache.find(
      message => message.id === keystone.messageId,
    );

    keystoneMessage.edit(null, keystone.buildMessage());

    keystone.saveAsFile(keystoneMessage);

    message.delete();
  }

  private parseTimeArgument(time: string | null): Date | null {
    if (time === null) {
      return null;
    }

    return parse(time, 'kk:mm', new Date());
  }

  private isTextChannel(channel: TextChannel | DMChannel | NewsChannel): channel is TextChannel {
    return channel.type === 'text';
  }

  private getArgumentErrorMessage(
    message: Message,
    argumentKey: string,
    argumentValue: string | number | null,
  ) {
    const argument = allowedArguments.find(arg => arg.id === argumentKey);

    let response = `Argument \`${argument?.id}\` has an invalid value`;
    if (argumentValue !== null) {
      response += `: \`${argumentValue}\``;
    }

    return message.util.send(response);
  }
}
