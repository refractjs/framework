import { ModalSubmitInteraction } from "discord.js";
import { Constants } from "../constants";
import { ModalHandlerMetadata } from "../handlers/ModalHandler";
import { HandlerMetadata } from "../handlers/PieceHandler";
import { XOR } from "../types/utility";

export type ModalOptions = XOR<
  {
    customId: string;
  },
  {
    filter: (interaction: ModalSubmitInteraction) => Promise<boolean> | boolean;
  }
>;

export function ModalSubmit(options: ModalOptions): MethodDecorator {
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

    const handler: ModalHandlerMetadata = {
      filter,
      propertyKey,
      handler: "modal",
    };
    handlers.push(handler);

    Reflect.defineMetadata(
      Constants.Metadata.Handlers,
      handlers,
      target.constructor,
    );
  };
}
