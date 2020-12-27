import { Command, ArgumentOptions } from 'discord-akairo';
import { GuildMember } from 'discord.js';
import { NewsChannel } from 'discord.js';
import { User, Role, Guild } from 'discord.js';
import { Message, TextChannel } from 'discord.js';

const allowedArguments: ArgumentOptions[] = [{ id: 'characterName', type: 'string' }];

interface Arguments {
  characterName: string;
}

export default class VerifyCommand extends Command {
  constructor() {
    super('verify', {
      aliases: ['verify', 'member'],
      args: allowedArguments,
      category: 'Public Commands',
      description: {
        content: 'Request a character to be verified. It must be in the guild.',
        usage: '!verify CHARACTER',
        examples: ['!verify Rundunn', '!member Dundunn'],
      },
      cooldown: 10000,
      ratelimit: 3,
    });
  }

  exec(message: Message, args: Arguments): void {
    const { characterName } = args;
    const { author, guild } = message;

    if (!this.isValidCharacterName(characterName)) {
      message.channel.send(`The given character name "${characterName}" is invalid`);
      return;
    }

    const guildMember = guild.member(author);
    const roles = guildMember.roles.cache;
    const memberRole = this.getMemberRole(guild);

    if (0 === roles.array().length) {
      this.addRoleToUser(memberRole, guildMember);
    }

    this.createVerificationRequestNotification(guild, author, characterName);
  }

  isValidCharacterName(name: string): boolean {
    return name.match(/^[A-Za-zÀ-ÖØ-öø-ÿ]{2,12}$/) !== null;
  }

  getMemberRole(guild: Guild): Role {
    const role = guild.roles.cache.find(role => role.name === 'Member');
    if (role) {
      return role;
    }

    throw new Error('This server does not have a "Member" role.');
  }

  addRoleToUser(role: Role, guildMember: GuildMember): void {
    guildMember.roles.add(role);
  }

  createVerificationRequestNotification(guild: Guild, user: User, characterName: string): void {
    const requestsChannel = this.getVerificationRequestsChannel(guild);

    requestsChannel
      .send(`${user} requested to verify:\n> ${characterName}`)
      .then(message => message.react('✅'));
  }

  getVerificationRequestsChannel(guild: Guild): TextChannel | NewsChannel {
    const channel = guild.channels.cache.find(
      channel => channel.isText() && channel.name === 'verification-requests',
    );

    if (channel && channel.isText()) {
      return channel;
    }

    throw new Error('This server does not have a #verification-requests channel.');
  }
}
