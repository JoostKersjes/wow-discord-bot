import { InstanceRoles } from './types';

export class InstanceRole {
  constructor(
    readonly name: string,
    readonly emoji: string,
    readonly aliases: string[],
    readonly color: string,
  ) {}

  static list(): InstanceRole[] {
    return [this.tank(), this.healer(), this.damage()];
  }

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

  private static tank(): InstanceRole {
    return new this('tank', '🛡️', ['🛡️', 't', 'tank', 'shield'], '#021b4f');
  }

  private static healer(): InstanceRole {
    return new this('healer', '💚', ['💚', 'h', 'healer', 'heal'], '#08604e');
  }

  private static damage(): InstanceRole {
    return new this('damage', '⚔️', ['⚔️', 'd', 'damage', 'dps', 'ranged', 'melee'], '#6b100d');
  }

  hasAlias(alias: string): boolean {
    return this.aliases.includes(alias.toLowerCase());
  }
}
