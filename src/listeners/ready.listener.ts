import { Listener } from 'discord-akairo';

export default class ReadyListener extends Listener {
  constructor() {
    super('ready', {
      emitter: 'client',
      event: 'ready',
      category: 'client',
    });
  }

  exec(): void {
    console.log(`${this.client.user.tag} is now online`);

    // TODO: Load messages since last reset into cache
  }
}
