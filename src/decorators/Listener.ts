import { ListenerHandlerMetadata } from "../handlers/ListenerHandler";
import { HandlerMetadata } from "../handlers/PieceHandler";

export interface ListenerOptions {
  name?: string;
  once?: boolean;
}

export function Listener(options?: ListenerOptions): MethodDecorator {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata("refract:handlers", target.constructor)) {
      Reflect.defineMetadata("refract:handlers", [], target.constructor);
    }

    const handlers = Reflect.getMetadata(
      "refract:handlers",
      target
    ) as HandlerMetadata[];

    const handler: ListenerHandlerMetadata = {
      name: options?.name ?? propertyKey.toString(),
      once: options?.once ?? false,
      propertyKey,
      handler: "listener",
    };
    handlers.push(handler);

    Reflect.defineMetadata("refract:handlers", handlers, target.constructor);
  };
}
