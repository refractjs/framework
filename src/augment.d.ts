import { Logger } from "./Logger";
import { PieceHandlerManager } from "./handlers/PieceHandlerManager";
import { PieceLoader } from "./piece/PieceLoader";
import { PieceStore } from "./piece/PieceStore";
import { PluginManager } from "./plugins/PluginManager";
import { ApplicationCommandRegistry } from "./registry/ApplicationCommandRegistry";

declare module "discord.js" {
  interface Client {
    logger: Logger;
    owners: User[];
    plugins: PluginManager;
    store: PieceStore;
    handlers: PieceHandlerManager;
    loader: PieceLoader;
    registry: ApplicationCommandRegistry;
  }

  interface ClientEvents {
    guardError: [interaction: ChatInputCommandInteraction, error: GuardError];
  }
}
