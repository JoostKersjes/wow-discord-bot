import { Listener } from 'discord-akairo';
import { User } from 'discord.js';
import { MessageReaction } from 'discord.js';
import { isAfter, subDays, startOfWeek } from 'date-fns';
import { Keystone } from '../models';

export default class KeystoneReactionListener extends Listener {
  constructor() {
    super('keystone-reaction', {
      emitter: 'client',
      event: 'messageReactionAdd',
      category: 'client',
    });
  }

  exec(reaction: MessageReaction, user: User): void {
    if (this.skipEvent(reaction, user)) {
      return;
    }

    if (this.isKeystoneMessage(reaction)) {
      return this.handleKeystoneReaction(reaction, user);
    }

    reaction.users.remove(user);
  }

  private handleKeystoneReaction(reaction: MessageReaction, user: User): void {
    const { message } = reaction;
    const emoji = reaction.emoji.toString();

    const keystone = Keystone.getFromFile(message);
    if (!keystone) {
      return;
    }

    if (emoji === '❌' && keystone.group.members.some(member => member.userId === user.id)) {
      if (keystone.group.getLeader().userId !== user.id) {
        const role = keystone.group.cancelSignUp(user);

        message.react(role.emoji);
      }
    }

    const selectedRole = keystone.getAvailableRoles().find(role => role.hasAlias(emoji));
    if (selectedRole) {
      const previousRole = keystone.group.members.find(member => member.userId === user.id)
        ?.instanceRole;

      if (previousRole) {
        keystone.group.changeRole(user, selectedRole);

        message.react(previousRole.emoji);
      } else {
        keystone.group.signUp(user, selectedRole);
      }

      if (!keystone.getAvailableRoles().some(role => role.hasAlias(emoji))) {
        reaction.remove();
      }
    }

    message.edit(null, keystone.buildMessage());

    keystone.saveAsFile(message);

    reaction.users.remove(user);

    if (emoji === '🗑️' && keystone.group.getLeader().userId === user.id) {
      message.delete();
    }
  }

  private skipEvent(reaction: MessageReaction, user: User): boolean {
    const { message } = reaction;

    return (
      user.bot ||
      message.author.id !== this.client.user.id ||
      !Keystone.fileExists(message) ||
      isAfter(this.lastResetDate(), message.createdTimestamp)
    );
  }

  private isKeystoneMessage(reaction: MessageReaction): boolean {
    return reaction.message.author.id === this.client.user.id;
  }

  private lastResetDate(): Date {
    const currentDate = new Date();

    const wednesday = startOfWeek(currentDate, { weekStartsOn: 3 });
    wednesday.setHours(9);

    if (isAfter(currentDate, wednesday)) {
      return wednesday;
    }

    return subDays(wednesday, 7);
  }
}
