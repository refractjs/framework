import "reflect-metadata";

export interface Hook {
  name: string;
  propertyKey: string | symbol;
}

export function createHookDecorator(name: string) {
  return function () {
    return function (target, propertyKey) {
      if (!Reflect.hasMetadata("hooks", target.constructor)) {
        Reflect.defineMetadata("hooks", [], target.constructor);
      }

      const hooks = Reflect.getMetadata("hooks", target.constructor) as Hook[];

      hooks.push({ name, propertyKey });
      Reflect.defineMetadata("hooks", hooks, target.constructor);
    } as MethodDecorator;
  };
}

export function getHooks(target: object) {
  if (!Reflect.hasMetadata("hooks", target.constructor)) {
    return [];
  }

  return Reflect.getMetadata("hooks", target.constructor) as Hook[];
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (target as any)[hook](...args);
  }
}

export function runHooksSync(target: object, name: string, ...args: unknown[]) {
  const hooks = getHooksByType(target, name);

  for (const hook of hooks) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (target as any)[hook](...args);
  }
}
