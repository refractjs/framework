import { ChatInputCommandInteraction } from "discord.js";

export function createCommandGuard(
  check: (interaction: ChatInputCommandInteraction) => any,
): MethodDecorator {
  return function (
    _target: any,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const interaction = args[0] as ChatInputCommandInteraction;
      await check(interaction);
      return originalMethod.apply(this, args);
    };
  };
}
