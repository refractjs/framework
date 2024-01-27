import { ButtonInteraction } from "discord.js";
import { Constants } from "../constants";
import { ButtonHandlerMetadata } from "../handlers/ButtonHandler";
import { HandlerMetadata } from "../handlers/PieceHandler";
import { XOR } from "../types/utility";

export type ButtonOptions = XOR<
  {
    customId: string;
  },
  {
    filter: (interaction: ButtonInteraction) => Promise<boolean> | boolean;
  }
>;

export function Button(options: ButtonOptions): MethodDecorator {
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

    const handler: ButtonHandlerMetadata = {
      filter,
      propertyKey,
      handler: "button",
    };
    handlers.push(handler);

    Reflect.defineMetadata(
      Constants.Metadata.Handlers,
      handlers,
      target.constructor,
    );
  };
}
