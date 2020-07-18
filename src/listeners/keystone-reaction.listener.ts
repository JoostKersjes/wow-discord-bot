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
      this.handleKeystoneReaction(reaction, user);
    }

    reaction.users.remove(user);
  }

  private handleKeystoneReaction(reaction: MessageReaction, user: User): void {
    const { message } = reaction;
    const emoji = reaction.emoji.toString();

    const keystone = Keystone.getFromFile(message.id);
    if (!keystone) {
      return;
    }

    if (emoji === '❌' && keystone.group.members.some(member => member.userId === user.id)) {
      if (keystone.group.getLeader().userId === user.id) {
        keystone.delete();
      }
    }

    const selectedRole = keystone.getAvailableRoles().find(role => role.hasAlias(emoji));
    if (selectedRole) {
      keystone.group.signUp(user, selectedRole);

      message.edit(null, keystone.buildMessage());

      if (!keystone.getAvailableRoles().some(role => role.hasAlias(emoji))) {
        reaction.remove();
      }
    }

    keystone.saveAsFile();
  }

  private skipEvent(reaction: MessageReaction, user: User): boolean {
    const { message } = reaction;

    return (
      user.bot ||
      message.author.id !== this.client.user.id ||
      isAfter(this.lastResetDate(), message.createdTimestamp)
    );
  }

  private isKeystoneMessage(reaction: MessageReaction): boolean {
    return reaction.message.author.id === this.client.user.id;
  }

  private lastResetDate(): Date {
    const currentDate = new Date();

    const tuesday = startOfWeek(currentDate, { weekStartsOn: 2 });
    tuesday.setHours(9);

    if (isAfter(currentDate, tuesday)) {
      return tuesday;
    }

    return subDays(tuesday, 7);
  }
}
