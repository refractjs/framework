import { AnySelectMenuInteraction } from "discord.js";
import { Constants } from "../constants";
import { HandlerMetadata } from "../handlers/PieceHandler";
import { SelectMenuHandlerMetadata } from "../handlers/SelectMenuHandler";
import { XOR } from "../types/utility";

export type SelectMenuOptions = XOR<
  {
    customId: string;
  },
  {
    filter: (
      interaction: AnySelectMenuInteraction,
    ) => Promise<boolean> | boolean;
  }
>;

export function SelectMenu(options: SelectMenuOptions): MethodDecorator {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata(Constants.Metadata.Handlers, target.constructor)) {
      Reflect.defineMetadata(
        Constants.Metadata.Handlers,
        [],
        target.constructor,
      );
    }

    const handlers = Reflect.getMetadata(
      Constants.Metadata.Handlers,
      target.constructor,
    ) as HandlerMetadata[];

    const filter =
      options.filter ??
      ((interaction) => interaction.customId === options.customId);

    const handler: SelectMenuHandlerMetadata = {
      filter,
      propertyKey,
      handler: "selectMenu",
    };
    handlers.push(handler);

    Reflect.defineMetadata(
      Constants.Metadata.Handlers,
      handlers,
      target.constructor,
    );
  };
}
