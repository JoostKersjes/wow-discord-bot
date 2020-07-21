import { InstanceRole } from './instance-role.model';
import { Type } from 'class-transformer';

export class GroupMember {
  @Type(() => InstanceRole)
  readonly instanceRole: InstanceRole;

  readonly userId: string;

  readonly leader: boolean;

  static withData(role: InstanceRole, userId: string, leader: boolean): GroupMember {
    return new this(role, userId, leader);
  }

  static emptySlots(role: InstanceRole, amount: number): GroupMember[] {
    return new Array(amount).fill(new this(role));
  }

  constructor(instanceRole: InstanceRole, userId: string | null = null, leader: boolean = false) {
    this.instanceRole = instanceRole;
    this.userId = userId;
    this.leader = leader;
  }
}
