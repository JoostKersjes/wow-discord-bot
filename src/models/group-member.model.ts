import { InstanceRole } from './instance-role.model';
import { InstanceRoles } from './types';
import { Type } from 'class-transformer';

export class GroupMember {
  @Type(() => InstanceRole)
  readonly instanceRole: InstanceRole;

  readonly userId: string;

  readonly leader: boolean;

  static withData(role: InstanceRole, userId: string, leader: boolean): GroupMember {
    return new this(role, userId, leader);
  }

  static emptySlots(role: InstanceRoles, amount: number): GroupMember[] {
    return new Array(amount).fill(new this(InstanceRole.byRole(role)));
  }

  constructor(instanceRole: InstanceRole, userId: string | null = null, leader: boolean = false) {
    this.instanceRole = instanceRole;
    this.userId = userId;
    this.leader = leader;
  }
}
