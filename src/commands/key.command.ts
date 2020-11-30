import { Command, ArgumentOptions } from 'discord-akairo';
import { Message } from 'discord.js';
import { Keystone, Dungeon, InstanceRole } from '../models';

const allowedArguments: ArgumentOptions[] = [
  { id: 'dungeon', type: 'string' },
  { id: 'level', type: 'number' },
  { id: 'role', type: 'string', default: 'dps' },
];

interface Arguments {
  dungeon: string | null;
  level: number | null;
  role: string;
}

export default class KeyCommand extends Command {
  constructor() {
    super('key', {
      aliases: ['key', 'm+', 'keystone'],
      args: allowedArguments,
      category: 'Public Commands',
      description: {
        content: 'Create a new M+ Keystone event',
        usage: 'key DUNGEON LEVEL [ROLE]',
        examples: ['key nw 5 tank', 'm+ wake 3', 'keystone theatre 8 healer'],
      },
      cooldown: 10000,
      ratelimit: 3,
    });
  }

  exec(message: Message, args: Arguments): Promise<Message> {
    const dungeon = this.findDungeon(args.dungeon);

    if (!dungeon) {
      return this.getArgumentErrorMessage(message, 'dungeon', args.dungeon);
    }

    const level = this.validateKeystoneLevel(args.level);

    if (!level) {
      return this.getArgumentErrorMessage(message, 'level', args.level);
    }

    const role = this.findRole(args.role);

    if (!role) {
      return this.getArgumentErrorMessage(message, 'role', args.role);
    }

    const keystone = Keystone.withData(message.author, role, dungeon, level);

    const messagePromise = message.util.send(null, keystone.buildMessage());

    messagePromise.then(async (response: Message) => {
      keystone.messageId = response.id;
      keystone.saveAsFile(response);

      keystone.getAvailableRoles().forEach(role => {
        response.react(role.emoji);
      });

      await response.react('❌');
    });

    message.delete();
  }

  private findDungeon(dungeonArgument: string | null): Dungeon | null {
    if (null === dungeonArgument) {
      return null;
    }

    return Dungeon.currentKeystoneDungeons().find(dungeon => dungeon.hasAlias(dungeonArgument));
  }

  private validateKeystoneLevel(levelArgument: number | null): number | null {
    if (levelArgument === null) {
      return null;
    }

    return levelArgument > 30 ? null : Math.max(2, levelArgument);
  }

  private findRole(roleArgument: string): InstanceRole {
    return InstanceRole.byAlias(roleArgument);
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
