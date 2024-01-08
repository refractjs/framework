import "reflect-metadata";

export interface Hook {
  name: string;
  propertyKey: string | symbol;
}

export function createHookDecorator(name: string) {
  return function () {
    return function (target, propertyKey) {
      if (!Reflect.hasMetadata("hooks", target)) {
        Reflect.defineMetadata("hooks", [], target);
      }

      const hooks = Reflect.getMetadata("hooks", target) as Hook[];

      hooks.push({ name, propertyKey });
      Reflect.defineMetadata("hooks", hooks, target);
    } as MethodDecorator;
  };
}

export function getHooks(target: object) {
  if (!Reflect.hasMetadata("hooks", target)) {
    return [];
  }

  return Reflect.getMetadata("hooks", target) as Hook[];
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
