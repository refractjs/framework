import { Constants } from "../constants";
import { ListenerHandlerMetadata } from "../handlers/ListenerHandler";
import { HandlerMetadata } from "../handlers/PieceHandler";

export interface ListenerOptions {
  name?: string;
  once?: boolean;
}

export function Listener(options?: ListenerOptions): MethodDecorator {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata(Constants.Metadata.Handlers, target.constructor)) {
      Reflect.defineMetadata(
        Constants.Metadata.Handlers,
        [],
        target.constructor
      );
    }

    const handlers = Reflect.getMetadata(
      Constants.Metadata.Handlers,
      target.constructor
    ) as HandlerMetadata[];

    const handler: ListenerHandlerMetadata = {
      name: options?.name ?? propertyKey.toString(),
      once: options?.once ?? false,
      propertyKey,
      handler: "listener",
    };
    handlers.push(handler);

    Reflect.defineMetadata(
      Constants.Metadata.Handlers,
      handlers,
      target.constructor
    );
  };
}
