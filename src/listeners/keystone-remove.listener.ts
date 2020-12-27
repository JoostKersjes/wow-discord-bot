import { Message } from 'discord.js';
import { Listener } from 'discord-akairo';

import { Keystone } from '../models';

export default class KeystoneRemoveListener extends Listener {
  constructor() {
    super('keystone-remove', {
      emitter: 'client',
      event: 'messageDelete',
      category: 'client',
    });
  }

  exec(message: Message): void {
    if (this.skipEvent(message)) {
      return;
    }

    const keystone = Keystone.getFromFile(message);

    if (keystone) {
      keystone.deleteSaveFile(message);
    }
  }

  skipEvent(message: Message): boolean {
    return message.author.id !== this.client.user.id || !Keystone.fileExists(message);
  }
}
