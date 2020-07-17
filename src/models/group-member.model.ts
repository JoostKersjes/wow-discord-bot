import { User } from 'discord.js';

import { InstanceRole } from './instance-role.model';
import { InstanceRoles } from './types';

export class GroupMember {
  static withData(role: InstanceRole, user: User, leader: boolean): GroupMember {
    return new this(role, user, leader);
  }

  static emptySlots(role: InstanceRoles, amount: number): GroupMember[] {
    return new Array(amount).fill(new this(InstanceRole.byRole(role)));
  }

  private constructor(
    readonly instanceRole: InstanceRole,
    readonly user: User | null = null,
    readonly leader: boolean = false,
  ) {}
}
