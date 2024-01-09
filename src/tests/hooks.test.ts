import { Constants } from "../constants";
import {
  createHookDecorator,
  getHooks,
  getHooksByType,
  runHooks,
  runHooksSync,
} from "../hooks/hooks";

const testHook = createHookDecorator("hook:test");

class Test {
  public count = 0;

  @testHook()
  public method1() {
    this.count++;
  }

  public method2() {
    this.count++;
  }
}

describe("Hooks", () => {
  test("should set metadata to class", () => {
    const test = new Test();
    const hooks = Reflect.getMetadata(
      Constants.Metadata.Hooks,
      test.constructor
    );
    expect(hooks).toEqual([{ name: "hook:test", propertyKey: "method1" }]);
  });

  test("should get hooks", () => {
    const test = new Test();
    const hooks = getHooks(test);
    expect(hooks).toEqual([{ name: "hook:test", propertyKey: "method1" }]);
  });

  test("should get hooks by type", () => {
    const test = new Test();
    const hooks = getHooksByType(test, "hook:test");
    expect(hooks).toEqual(["method1"]);
  });

  test("should run hooks async", async () => {
    const test = new Test();
    expect(test.count).toBe(0);
    await runHooks(test, "hook:test");
    await runHooks(test, "hook:test");
    await runHooks(test, "hook:test");
    expect(test.count).toBe(3);
  });

  test("should run hooks sync", () => {
    const test = new Test();
    expect(test.count).toBe(0);
    runHooksSync(test, "hook:test");
    runHooksSync(test, "hook:test");
    runHooksSync(test, "hook:test");
    expect(test.count).toBe(3);
  });

  test("should not run hooks", async () => {
    const test = new Test();
    expect(test.count).toBe(0);
    await runHooks(test, "hook:nonexistent");
    expect(test.count).toBe(0);
  });
});
