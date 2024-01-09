import "reflect-metadata";
import { Constants } from "../constants";

export interface Hook {
  name: string;
  propertyKey: string | symbol;
}

export function createHookDecorator(name: string) {
  return function () {
    return function (target, propertyKey) {
      if (!Reflect.hasMetadata(Constants.Metadata.Hooks, target.constructor)) {
        Reflect.defineMetadata(
          Constants.Metadata.Hooks,
          [],
          target.constructor
        );
      }

      const hooks = Reflect.getMetadata(
        Constants.Metadata.Hooks,
        target.constructor
      ) as Hook[];

      hooks.push({ name, propertyKey });
      Reflect.defineMetadata(
        Constants.Metadata.Hooks,
        hooks,
        target.constructor
      );
    } as MethodDecorator;
  };
}

export function getHooks(target: object) {
  if (!Reflect.hasMetadata(Constants.Metadata.Hooks, target.constructor)) {
    return [];
  }

  return Reflect.getMetadata(
    Constants.Metadata.Hooks,
    target.constructor
  ) as Hook[];
}

export function getHooksByType(target: object, name: string) {
  return getHooks(target)
    .filter((hook) => hook.name === name)
    .map((hook) => hook.propertyKey);
}

export async function runHooks(
  target: object,
  name: string,
  ...args: unknown[]
) {
  const hooks = getHooksByType(target, name);

  for (const hook of hooks) {
    await (target as any)[hook](...args);
  }
}

export function runHooksSync(target: object, name: string, ...args: unknown[]) {
  const hooks = getHooksByType(target, name);

  for (const hook of hooks) {
    (target as any)[hook](...args);
  }
}
