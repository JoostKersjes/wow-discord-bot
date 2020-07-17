import { InstanceGroup } from './instance-group.model';
import { User } from 'discord.js';
import { Dungeon } from './dungeon.model';
import { InstanceRole } from './instance-role.model';
import { MessageEmbed } from 'discord.js';

export class Keystone {
  edited: boolean = false;

  static withData(owner: User, ownerRole: InstanceRole, dungeon: Dungeon, level: number): Keystone {
    return new this(owner, dungeon, level, InstanceGroup.newKeystoneGroup(owner, ownerRole));
  }

  private constructor(
    readonly owner: User,
    readonly dungeon: Dungeon,
    readonly level: number,
    public group: InstanceGroup,
  ) {}

  isFullGroup(): boolean {
    return this.group.members.every(member => member.user !== null);
  }

  getName(): string {
    return `+${this.level} ${this.dungeon.name}`;
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

  private getDescription(): string {
    let description = this.isFullGroup()
      ? 'This group is full...\n\n'
      : 'Click the reactions to sign up!\n\n';

    this.group.members.forEach(member => {
      description += `${member.instanceRole.emoji} `;
      description += member.user ? member.user.toString() : '';
      description += member.leader ? ` 🚩` : '';
      description += '\n\n';
    });

    return description;
  }
}
