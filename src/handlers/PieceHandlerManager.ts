import { Collection } from "discord.js";
import { CommandHandler } from "./CommandHandler";
import { ListenerHandler } from "./ListenerHandler";
import { PieceHandler } from "./PieceHandler";
import { CronHandler } from "./CronHandler";
import { ButtonHandler } from "./ButtonHandler";
import { SelectMenuHandler } from "./SelectMenuHandler";
import { ModalHandler } from "./ModalHandler";

export interface Handlers {
  listener: ListenerHandler;
  command: CommandHandler;
  cron: CronHandler;
  button: ButtonHandler;
  selectMenu: SelectMenuHandler;
  modal: ModalHandler;
}

export class PieceHandlerManager extends Collection<string, PieceHandler> {
  public override get<T extends string & keyof Handlers>(name: T): Handlers[T] {
    const handler = super.get(name);
    return handler as Handlers[T];
  }

  public register(handler: PieceHandler) {
    this.set(handler.name, handler);
    return this;
  }

  public unregister(handler: PieceHandler) {
    this.delete(handler.name);
    return this;
  }
}
