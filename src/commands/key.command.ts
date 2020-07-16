import { Command } from 'discord-akairo';
import { Message } from 'discord.js';
import { MessageEmbed } from 'discord.js';

import { Dungeons } from '../datasets';
import { IKeystone, IDungeon } from '../types';
import { IGroupMember } from '../types/group-member.type';
import { User } from 'discord.js';

const groupOwner = '🚩';

const args = [
  { id: 'dungeon', type: 'string' },
  { id: 'level', type: 'number' },
  { id: 'role', type: 'string', default: 'dps' },
];

export default class KeyCommand extends Command {
  constructor() {
    super('key', {
      aliases: ['key', 'm+', 'keystone'],
      args: args,
      category: 'Public Commands',
      description: {
        content: 'Create a new M+ Keystone event',
        usage: 'key DUNGEON LEVEL [ROLE]',
        examples: [
          'key ad 15 tank'
        ],
      }
    });
  }

  exec(message: Message, args: any) {
    const dungeon = this.findDungeon(args.dungeon);

    if (!dungeon) {
      return this.getArgumentErrorMessage(message, 'dungeon', args.dungeon);
    }

    const level = this.validateKeystoneLevel(args.level);

    if (!level) {
      return this.getArgumentErrorMessage(message, 'level', args.level);
    }

    const keystone = new Keystone(message.author, dungeon, level);

    const promise = message.util.send(null, this.buildMessage(keystone));

    promise.then(async (response: Message) => {
      await response.react('💚');
      await response.react('⚔️');
      await response.react('❌');
    });

    return promise;
  }

  private validateKeystoneLevel(levelArgument: number): number | null {
    return isNaN(levelArgument) || levelArgument >= 40 ? null : levelArgument;
  }

  private buildMessage(keystone: IKeystone): MessageEmbed {
    return new MessageEmbed()
      .setTitle(keystone.getName())
      .setColor(keystone.isFullGroup() ? '#444444' : '#00ff00')
      .setFooter('Last edited')
      .setTimestamp(new Date())
      .setDescription(keystone.getDescription());
  }

  private getArgumentErrorMessage(message: Message, argumentKey: string, argumentValue: string | number | null) {
    const argument = args.find(arg => arg.id === argumentKey);

    return message.util.send(`Argument \`${argument?.id}\` has an invalid value: \`${argumentValue}\``);
  }

  private findDungeon(dungeonArgument: string): IDungeon {
    return Dungeons.find(dungeon => dungeon.aliases.includes(dungeonArgument));
  }
}

class Keystone implements IKeystone {
  group: IGroupMember[] = [];

  constructor(
    readonly owner: User,
    readonly dungeon: IDungeon,
    readonly level: number
  ) { }

  isFullGroup(): boolean {
    return this.group.length === 5;
  }

  getName(): string {
    return `+${this.level} ${this.dungeon.name}`;
  }

  getDescription(): string {
    let description = this.isFullGroup()
      ? 'This group is full...\n'
      : 'Click the reactions to sign up!\n';

    this.group.forEach(member => {
      description += `${member.instanceRole.emoji} `;
      description += member.user.toString();
      description += member.user.id === this.owner.id ? ` ${groupOwner}` : '';
      description += '\n'
    });

    return description;
  }
}
