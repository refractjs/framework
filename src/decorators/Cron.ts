import { Constants } from "../constants";
import { CronHandlerMetadata } from "../handlers/CronHandler";
import { HandlerMetadata } from "../handlers/PieceHandler";

export interface CronOptions {
  time: string;
  beforeReady?: boolean;
  runOnInit?: boolean;
  timezone?: string;
}

export function Cron(options: CronOptions | string): MethodDecorator {
  const opts = typeof options === "string" ? { time: options } : options;
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

    const handler: CronHandlerMetadata = {
      time: opts.time,
      beforeReady: opts.beforeReady ?? false,
      runOnInit: opts.runOnInit ?? false,
      timezone: opts.timezone ?? null,
      propertyKey,
      handler: "cron",
    };
    handlers.push(handler);

    Reflect.defineMetadata(
      Constants.Metadata.Handlers,
      handlers,
      target.constructor,
    );
  };
}
