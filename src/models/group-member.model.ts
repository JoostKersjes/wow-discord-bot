import { Type } from 'class-transformer';
import { InstanceRole } from './instance-role.model';

export class GroupMember {
  @Type(() => InstanceRole)
  readonly instanceRole: InstanceRole;
  readonly userId: string;
  readonly leader: boolean;

  constructor(instanceRole: InstanceRole, userId: string | null = null, leader = false) {
    this.instanceRole = instanceRole;
    this.userId = userId;
    this.leader = leader;
  }

  static withData(role: InstanceRole, userId: string, leader: boolean): GroupMember {
    return new this(role, userId, leader);
  }

  static emptySlots(role: InstanceRole, amount: number): GroupMember[] {
    return new Array(amount).fill(new this(role));
  }
}
