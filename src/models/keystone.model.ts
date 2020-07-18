import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

import { Type, serialize, deserialize } from 'class-transformer';
import { MessageEmbed } from 'discord.js';

import { InstanceGroup } from './instance-group.model';
import { User } from 'discord.js';
import { Dungeon } from './dungeon.model';
import { InstanceRole } from './instance-role.model';

export class Keystone {
  @Type(() => Dungeon)
  readonly dungeon: Dungeon;

  readonly level: number;

  @Type(() => InstanceGroup)
  readonly group: InstanceGroup;

  messageId: string | null = null;
  edited: boolean = false;

  static withData(owner: User, ownerRole: InstanceRole, dungeon: Dungeon, level: number): Keystone {
    return new this(dungeon, level, InstanceGroup.newKeystoneGroup(owner, ownerRole));
  }

  constructor(dungeon: Dungeon, level: number, group: InstanceGroup) {
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
    const embed = new MessageEmbed()
      .setTitle(this.getName())
      .setColor(this.isFullGroup() ? '#444444' : '#00ff00')
      .setDescription(this.getDescription());

    if (this.edited) {
      embed.setFooter('Last edited').setTimestamp();
    }

    return embed;
  }

  saveAsFile(): void {
    if (!this.messageId) {
      console.error(`Could not save Keystone! messageId: ${this.messageId}`);

      return;
    }

    const directory = join(__dirname, '..', 'data');
    const filePath = `${directory}/${this.messageId}.json`;

    mkdirSync(directory, { recursive: true });
    writeFileSync(filePath, serialize(this), { encoding: 'utf-8' });

    console.log('saved keystone');
  }

  delete(): void {
    // TODO: delete file and message
  }

  static getFromFile(messageId: string): Keystone | null {
    const directory = join(__dirname, '..', 'data');
    const filePath = `${directory}/${messageId}.json`;
    const fileData = readFileSync(filePath, { encoding: 'utf-8' });

    if (!fileData) {
      console.error(`Could not find file: ${filePath}`);

      return null;
    }

    return deserialize(Keystone, fileData);
  }

  private getDescription(): string {
    let description = this.isFullGroup()
      ? 'This group is full...\n\n'
      : 'Click the reactions to sign up!\n\n';

    this.group.members.forEach(member => {
      description += `${member.instanceRole.emoji} `;
      description += member.userId ? `<@${member.userId}>` : '';
      description += member.leader ? ` 🚩` : '';
      description += '\n\n';
    });

    return description;
  }
}
