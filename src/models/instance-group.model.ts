import { Type } from 'class-transformer';
import { User } from 'discord.js';
import { GroupMember } from './group-member.model';
import { InstanceRole } from './instance-role.model';
import { Log } from './log.model';

export class InstanceGroup {
  @Type(() => GroupMember)
  members: GroupMember[];

  constructor(members: GroupMember[]) {
    this.members = members;
  }

  static newKeystoneGroup(leaderUser: User, leaderRole: InstanceRole): InstanceGroup {
    const leader = GroupMember.withData(leaderRole, leaderUser.id, true);

    return this.emptyKeystoneGroup(leader);
  }

  private static emptyKeystoneGroup(leader: GroupMember): InstanceGroup {
    const members = [
      ...GroupMember.emptySlots(InstanceRole.byRole('tank'), 1),
      ...GroupMember.emptySlots(InstanceRole.byRole('healer'), 1),
      ...GroupMember.emptySlots(InstanceRole.byRole('damage'), 3),
    ];

    const roleIndex = members.findIndex(
      member => member.instanceRole.name === leader.instanceRole.name,
    );

    members[roleIndex] = leader;

    return new this(members);
  }

  getLeader(): GroupMember {
    return this.members.find(member => member.leader);
  }

  signUp(user: User, role: InstanceRole): void {
    const member = GroupMember.withData(role, user.id, false);

    this.placeMemberIntoGroup(member);
  }

  changeRole(user: User, role: InstanceRole): void {
    const leaderFlag = this.members.find(member => member.userId === user.id)?.leader || false;
    const member = GroupMember.withData(role, user.id, leaderFlag);

    this.cancelSignUp(user);
    this.placeMemberIntoGroup(member);
  }

  cancelSignUp(user: User): InstanceRole {
    const index = this.members.findIndex(member => member.userId === user.id);
    const role = this.members[index].instanceRole;

    const deleted = this.members.splice(index, 1, ...GroupMember.emptySlots(role, 1));

    return deleted.pop().instanceRole;
  }

  private placeMemberIntoGroup(member: GroupMember): void {
    const emptySlotIndex = this.members.findIndex(
      item => item.userId === null && member.instanceRole.name === item.instanceRole.name,
    );

    if (-1 === emptySlotIndex) {
      Log.error(`No empty slots left for "${member.instanceRole.name}" role`);

      return;
    }

    this.members[emptySlotIndex] = member;
  }
}
