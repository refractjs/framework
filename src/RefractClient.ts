import { Client, ClientOptions, User } from "discord.js";
import { LogLevel, Logger } from "./Logger";
import { CommandHandler } from "./handlers/CommandHandler";
import { ListenerHandler } from "./handlers/ListenerHandler";
import { PieceHandlerManager } from "./handlers/PieceHandlerManager";
import { PieceLoader } from "./piece/PieceLoader";
import { PieceStore } from "./piece/PieceStore";
import { PluginManager } from "./plugins/PluginManager";
import { ApplicationCommandRegistry } from "./registry/ApplicationCommandRegistry";
import { InternalPlugin } from "./plugins/internal/InternalPlugin";
import { CronHandler } from "./handlers/CronHandler";
import { ButtonHandler } from "./handlers/ButtonHandler";
import { SelectMenuHandler } from "./handlers/SelectMenuHandler";
import { ModalHandler } from "./handlers/ModalHandler";

export interface RefractClientOptions extends ClientOptions {
  logLevel?: LogLevel;
}

export class RefractClient extends Client {
  public logger: Logger;
  public owners: User[] = [];
  public plugins: PluginManager;
  public store: PieceStore;
  public handlers: PieceHandlerManager;
  public loader: PieceLoader;
  public registry: ApplicationCommandRegistry;

  public constructor(options: RefractClientOptions) {
    super(options);

    this.logger = Logger.create().setLevel(options.logLevel ?? LogLevel.info);
    this.plugins = new PluginManager(this);
    this.store = new PieceStore();
    this.handlers = new PieceHandlerManager();
    this.loader = new PieceLoader(this);
    this.registry = new ApplicationCommandRegistry(this);

    this.handlers
      .register(new ListenerHandler(this))
      .register(new CommandHandler(this))
      .register(new CronHandler(this))
      .register(new ButtonHandler(this))
      .register(new SelectMenuHandler(this))
      .register(new ModalHandler(this));

    this.plugins.register(new InternalPlugin(this));
  }

  public async start(token: string) {
    try {
      await this.plugins.loadAll();
    } catch (error) {
      this.logger.error(`Failed to load plugins:`);
      this.logger.error(error);
    }

    this.options.intents = this.options.intents.add(
      this.plugins.calculateIntents(),
    );

    try {
      await this.login(token);
    } catch (error) {
      this.logger.error(`Failed to connect to Discord:`);
      this.logger.error(error);
    }
  }
}
