import { join } from 'path';
import { AkairoClient, CommandHandler, ListenerHandler } from 'discord-akairo';

declare module 'discord-akairo' {
  interface AkairoClient {
    commandHandler: CommandHandler;
    listenerHandler: ListenerHandler;
  }
}

interface BotOptions {
  token: string;
  owners?: string | string[];
  prefix?: string;
}

export class BotClient extends AkairoClient {
  config: BotOptions;
  commandHandler: CommandHandler;
  listenerHandler: ListenerHandler;

  constructor(config: BotOptions) {
    super({
      ownerID: config.owners,
    });

    this.config = config;

    this.commandHandler = new CommandHandler(this, {
      directory: join(__dirname, '..', 'commands'),
      prefix: config?.prefix || '!',
      allowMention: true,
      commandUtil: true,
      commandUtilLifetime: 3e5,
      defaultCooldown: 6e4,
      ignorePermissions: config?.owners,
    });

    this.listenerHandler = new ListenerHandler(this, {
      directory: join(__dirname, '..', 'listeners'),
    });
  }

  async start(): Promise<string> {
    await this._init();
    return this.login(this.config.token);
  }

  private async _init(): Promise<void> {
    this.commandHandler.useListenerHandler(this.listenerHandler);
    this.listenerHandler.setEmitters({
      commandHandler: this.commandHandler,
      listenerHandler: this.listenerHandler,
      process,
    });

    this.commandHandler.loadAll();
    this.listenerHandler.loadAll();
  }
}
