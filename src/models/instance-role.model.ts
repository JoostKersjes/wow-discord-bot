import { InstanceRoles } from './types';

export class InstanceRole {
  readonly name: string;
  readonly emoji: string;
  readonly aliases: string[];
  readonly color: string;

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

    return roles.find(role => role.hasAlias(alias));
  }

  hasAlias(alias: string) {
    return this.aliases.includes(alias);
  }

  constructor(name: string, emoji: string, aliases: string[], color: string) {
    this.name = name;
    this.emoji = emoji;
    this.aliases = aliases;
    this.color = color;
  }

  private static tank(): InstanceRole {
    return new this('Tank', '🛡️', ['🛡️', 't', 'tank', 'shield'], '#021b4f');
  }

  private static healer(): InstanceRole {
    return new this('Healer', '💚', ['💚', 'h', 'healer', 'heal'], '#08604e');
  }

  private static damage(): InstanceRole {
    return new this('Damage', '⚔️', ['⚔️', 'd', 'damage', 'dps', 'ranged', 'melee'], '#6b100d');
  }
}
