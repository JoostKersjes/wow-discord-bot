import { readFileSync, writeFileSync, mkdirSync, unlinkSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

import { Type, serialize, deserialize } from 'class-transformer';
import { MessageEmbed, User, Message, TextChannel } from 'discord.js';

import { Dungeon } from './dungeon.model';
import { InstanceGroup } from './instance-group.model';
import { InstanceRole } from './instance-role.model';

export class Keystone {
  readonly ownerId: string;

  @Type(() => Dungeon)
  readonly dungeon: Dungeon;

  readonly level: number;

  @Type(() => InstanceGroup)
  readonly group: InstanceGroup;

  messageId: string | null = null;

  static withData(owner: User, ownerRole: InstanceRole, dungeon: Dungeon, level: number): Keystone {
    return new this(owner.id, dungeon, level, InstanceGroup.newKeystoneGroup(owner, ownerRole));
  }

  constructor(ownersId: string, dungeon: Dungeon, level: number, group: InstanceGroup) {
    this.ownerId = ownersId;
    this.dungeon = dungeon;
    this.level = level;
    this.group = group;
  }

  isFullGroup(): boolean {
    return this.group.members.every(member => member.userId !== null);
  }

  getName(): string {
    return `+${this.level} ${this.dungeon.name}`;
  }

  getAvailableRoles(): InstanceRole[] {
    return this.group.members
      .filter((member, index, array) => null === member.userId && array.indexOf(member) === index)
      .map(member => member.instanceRole);
  }

  buildMessage(): MessageEmbed {
    return new MessageEmbed()
      .setTitle(this.getName())
      .setColor(this.isFullGroup() ? '#444444' : '#00ff00')
      .setThumbnail(this.dungeon.image)
      .setDescription(this.getDescription());
  }

  saveAsFile(message: Message): void {
    if (!message) {
      console.error('Could not save Keystone!');

      return;
    }

    const directory = Keystone.getSaveDirectoryFromMessage(message);
    const filePath = Keystone.getSaveFilePath(message);

    mkdirSync(directory, { recursive: true });
    writeFileSync(filePath, serialize(this), { encoding: 'utf-8' });

    console.log('saved keystone');
  }

  deleteSaveFile(message: Message): void {
    unlinkSync(Keystone.getSaveFilePath(message));

    console.log('deleted keystone');
  }

  static getFromFile(message: Message): Keystone | null {
    const filePath = Keystone.getSaveFilePath(message);
    const fileData = readFileSync(filePath, { encoding: 'utf-8' });

    if (!fileData) {
      console.error(`Could not find file: ${filePath}`);

      return null;
    }

    return deserialize(Keystone, fileData);
  }

  static getSavedKeystonesForChannel(textChannel: TextChannel): Keystone[] {
    const directory = this.getSaveDirectory(textChannel.guild.id, textChannel.id);
    if (!existsSync(directory)) {
      return [];
    }

    try {
      const saveFiles = readdirSync(directory)?.map(fileName => join(directory, fileName));

      return saveFiles.map(filePath =>
        deserialize(Keystone, readFileSync(filePath, { encoding: 'utf-8' })),
      );
    } catch (error) {
      console.error(error.message);
      return [];
    }
  }

  private getDescription(): string {
    let description = this.isFullGroup()
      ? 'This group is full...\n'
      : 'Click the reactions to **sign up!**\n';

    description += 'You can click the `X` reaction cancel your registration.\n\n';

    this.group.members.forEach(member => {
      description += `${member.instanceRole.emoji} `;
      description += member.userId ? `<@${member.userId}>` : '';
      description += member.leader ? ` 🚩` : '';
      description += '\n\n';
    });

    return description;
  }

  private static getSaveDirectoryFromMessage(message: Message): string {
    return this.getSaveDirectory(message.guild.id, message.channel.id);
  }

  private static getSaveDirectory(guildId: string, channelId: string) {
    return join(__dirname, '..', 'data', guildId, channelId);
  }

  private static getSaveFilePath(message: Message): string | null {
    return join(Keystone.getSaveDirectoryFromMessage(message), `${message.id}.json`);
  }
}
