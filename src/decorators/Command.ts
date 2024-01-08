// import { CommandHandlerMetadata } from "../handlers/CommandHandler";
// import { HandlerMetadata } from "../handlers/PieceHandler";

// export interface CommandOptions {}

// export function Command(options?: CommandOptions): MethodDecorator {
//   return (target, propertyKey) => {
//     if (!Reflect.hasMetadata("refract:handlers", target.constructor)) {
//       Reflect.defineMetadata("refract:handlers", [], target.constructor);
//     }

//     const handlers = Reflect.getMetadata(
//       "refract:handlers",
//       target
//     ) as HandlerMetadata[];

//     const handler: CommandHandlerMetadata = {
//       propertyKey,
//       handler: "command",
//     };
//     handlers.push(handler);

//     Reflect.defineMetadata("refract:handlers", handlers, target.constructor);
//   };
// }
