import { GuildChannel } from 'discord.js';
import { Listener } from 'discord-akairo';
import { TextChannel } from 'discord.js';
import { Keystone, Log } from '../models';

export default class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
      category: 'client',
    });
  }

  exec(): void {
    Log.notice(`${this.client.user.tag} is now online`);

    this.loadAllSavedKeystonesIntoCache();
  }

  private loadAllSavedKeystonesIntoCache(): void {
    this.client.guilds.cache.forEach(guild => {
      guild.channels.cache.forEach(channel => {
        if (!this.isTextChannel(channel)) {
          return;
        }

        this.getSavedKeystoneMessageIds(channel).forEach(messageId => {
          channel.messages.fetch(messageId, true);
        });
      });
    });
  }

  private isTextChannel(channel: GuildChannel): channel is TextChannel {
    return channel.type === 'text';
  }

  private getSavedKeystoneMessageIds(channel: TextChannel): string[] {
    return Keystone.getSavedKeystonesForChannel(channel).map(keystone => keystone.messageId);
  }
}
