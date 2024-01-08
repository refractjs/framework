import { Client, User } from "discord.js";
import { Logger } from "./Logger";
import { PluginManager } from "./plugins/PluginMananger";
import { CorePlugin } from "./plugins/core/CorePlugin";
import { PieceStore } from "./piece/PieceStore";
import { PieceHandlerManager } from "./handlers/PieceHandlerManager";
import { ListenerHandler } from "./handlers/ListenerHandler";
import { PieceLoader } from "./piece/PieceLoader";
import { CommandHandler } from "./handlers/CommandHandler";

export class RefractClient extends Client {
  public logger: Logger;
  public owners: User[] = [];
  public plugins: PluginManager;
  public store: PieceStore;
  public handlers: PieceHandlerManager;
  public loader: PieceLoader;

  public constructor() {
    super({
      intents: [],
    });

    this.logger = Logger.create();
    this.plugins = new PluginManager(this);
    this.store = new PieceStore();
    this.handlers = new PieceHandlerManager();
    this.loader = new PieceLoader(this);

    this.handlers
      .register(new ListenerHandler(this))
      .register(new CommandHandler(this));

    this.plugins.register(new CorePlugin(this));
  }

  public async start(token: string) {
    try {
      await this.plugins.loadAll();
    } catch (error) {
      this.logger.error(`Failed to load plugins:`);
      this.logger.error(error);
    }

    this.options.intents.add(this.plugins.calculateIntents());

    try {
      await this.login(token);
    } catch (error) {
      this.logger.error(`Failed to connect to Discord:`);
      this.logger.error(error);
    }
  }
}
