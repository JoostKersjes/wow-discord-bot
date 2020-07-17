import { InstanceRoles } from './types';
import { EmojiResolvable } from 'discord.js';

export class InstanceRole {
  static byRole(role: InstanceRoles): InstanceRole {
    switch (role) {
      case 'tank':
        return this.tank();
      case 'healer':
        return this.healer();
      default:
      case 'damage':
        return this.damage();
    }
  }

  static byAlias(alias: string): InstanceRole {
    const roles: InstanceRole[] = [this.tank(), this.healer(), this.damage()];

    return roles.find(role => role.aliases.includes(alias));
  }

  private constructor(
    readonly name: string,
    readonly emoji: EmojiResolvable,
    readonly aliases: string[],
    readonly color: string,
  ) {}

  private static tank(): InstanceRole {
    return new this('Tank', '🛡️', ['t', 'tank', 'shield'], '#021b4f');
  }

  private static healer(): InstanceRole {
    return new this('Healer', '💚', ['h', 'healer', 'heal'], '#08604e');
  }

  private static damage(): InstanceRole {
    return new this('Damage', '⚔️', ['d', 'damage', 'dps', 'ranged', 'melee'], '#6b100d');
  }
}
