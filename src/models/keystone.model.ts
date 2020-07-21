import { readFileSync, writeFileSync, mkdirSync, unlinkSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

import { Type, serialize, deserialize } from 'class-transformer';
import { MessageEmbed, User, Message, TextChannel } from 'discord.js';

import { Dungeon } from './dungeon.model';
import { InstanceGroup } from './instance-group.model';
import { InstanceRole } from './instance-role.model';
import { format, isToday, isTomorrow } from 'date-fns';

export class Keystone {
  readonly ownerId: string;

  @Type(() => Dungeon)
  readonly dungeon: Dungeon;

  readonly level: number;

  @Type(() => InstanceGroup)
  readonly group: InstanceGroup;

  @Type(() => Date)
  startTime: Date;

  messageId: string | null = null;
  userDescription: string;

  static withData(owner: User, ownerRole: InstanceRole, dungeon: Dungeon, level: number): Keystone {
    return new this(owner.id, dungeon, level, InstanceGroup.newKeystoneGroup(owner, ownerRole));
  }

  constructor(ownersId: string, dungeon: Dungeon, level: number, group: InstanceGroup) {
    this.ownerId = ownersId;
    this.dungeon = dungeon;
    this.level = level;
    this.group = group;
  }

  setUserDescription(description: string) {
    this.userDescription = description;
  }

  setStartTime(startTime: Date) {
    this.startTime = startTime;
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
      .setDescription(this.buildEmbedDescription());
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

  static getMostRecentForUser(user: User, textChannel: TextChannel): Keystone | null {
    const keystones = this.getSavedKeystonesForChannel(textChannel).filter(
      key => key.ownerId === user.id,
    );
    const messages = textChannel.messages.cache.filter(message =>
      keystones.map(key => key.messageId).includes(message.id),
    );
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const lastMessage = messages.first();

    return keystones.find(keystone => lastMessage.id === keystone.messageId);
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

  private buildEmbedDescription(): string {
    let description = this.isFullGroup()
      ? 'This group is full...\n'
      : 'Click the reactions to **sign up!**\n';

    description += 'You can click the `X` reaction cancel your registration.\n\n';

    if (this.userDescription) {
      description += `**Note:** _${this.userDescription}_\n\n`;
    }

    this.group.members.forEach(member => {
      description += `${member.instanceRole.emoji} `;
      description += member.userId ? `<@${member.userId}>` : '';
      description += member.leader ? ` 🚩` : '';
      description += '\n\n';
    });

    if (this.startTime) {
      const day = isToday(this.startTime)
        ? 'Today'
        : isTomorrow(this.startTime)
        ? 'Tomorrow'
        : format(this.startTime, 'EEEE');

      description += `**When?** ${day} @ ${format(this.startTime, 'kk:mm')} Server Time`;
    }

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
