import { GroupMember } from './group-member.model';
import { User } from 'discord.js';
import { InstanceRole } from './instance-role.model';

export class InstanceGroup {
  members: GroupMember[];

  static newKeystoneGroup(leaderUser: User, leaderRole: InstanceRole): InstanceGroup {
    const leader = GroupMember.withData(leaderRole, leaderUser, true);

    return this.emptyKeystoneGroup(leader);
  }

  signUp(user: User, role: InstanceRole): void {
    const member = GroupMember.withData(role, user, false);

    this.placeMemberIntoGroup(member);
  }

  private placeMemberIntoGroup(member: GroupMember): void {
    const emptySlotIndex = this.members.findIndex(
      item => item.user === null && member.instanceRole.name === item.instanceRole.name,
    );

    if (-1 === emptySlotIndex) {
      throw Error(`No empty slots left for "${member.instanceRole.name}" role`);
    }

    this.members[emptySlotIndex] = member;
  }

  private constructor(members: GroupMember[]) {
    this.members = members;
  }

  private static emptyKeystoneGroup(leader: GroupMember): InstanceGroup {
    const members = [
      ...GroupMember.emptySlots('tank', 1),
      ...GroupMember.emptySlots('healer', 1),
      ...GroupMember.emptySlots('damage', 3),
    ];

    const roleIndex = members.findIndex(
      member => member.instanceRole.name === leader.instanceRole.name,
    );

    members[roleIndex] = leader;

    return new this(members);
  }
}
