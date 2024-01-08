import { LogLevel, Logger } from "../Logger";

class FakeConsole {
  public logs: string[] = [];
  public errors: string[] = [];

  public log(...args: unknown[]) {
    this.logs.push(args.join(" "));
  }

  public error(...args: unknown[]) {
    this.errors.push(args.join(" "));
  }
}

describe("Logger", () => {
  let logger: Logger;
  let console: FakeConsole;

  beforeEach(() => {
    logger = new Logger();
    console = new FakeConsole();
    logger.setOutput(console);
    logger.setChalkLevel(0);
  });

  test("should be able to set the log level", () => {
    logger.setLevel(LogLevel.debug);
    expect(logger.level).toBe(LogLevel.debug);
  });

  test("should be able to set the chalk level", () => {
    logger.setChalkLevel(1);
    expect(logger.chalk.level).toBe(1);
  });

  test("should be able to set the output", () => {
    logger.setOutput(console);
    expect(logger.output).toBe(console);
  });

  test("should log debug messages without name", () => {
    logger.setLevel(LogLevel.debug);
    logger.debug("debug message 123");
    expect(console.logs).toEqual(["[debug] debug message 123"]);
  });

  test("should log debug messages with name", () => {
    logger.setLevel(LogLevel.debug).setName("custom name");
    logger.debug("debug message 123");
    expect(console.logs).toEqual(["[debug] [custom name] debug message 123"]);
  });

  test("should log info messages without name", () => {
    logger.setLevel(LogLevel.info);
    logger.info("info message 123");
    expect(console.logs).toEqual(["[info] info message 123"]);
  });

  test("should log info messages with name", () => {
    logger.setLevel(LogLevel.info).setName("custom name");
    logger.info("info message 123");
    expect(console.logs).toEqual(["[info] [custom name] info message 123"]);
  });

  test("should log warn messages without name", () => {
    logger.setLevel(LogLevel.warn);
    logger.warn("warn message 123");
    expect(console.errors).toEqual(["[warn] warn message 123"]);
  });

  test("should log warn messages with name", () => {
    logger.setLevel(LogLevel.warn).setName("custom name");
    logger.warn("warn message 123");
    expect(console.errors).toEqual(["[warn] [custom name] warn message 123"]);
  });

  test("should log error messages without name", () => {
    logger.setLevel(LogLevel.error);
    logger.error("error message 123");
    expect(console.errors).toEqual(["[error] error message 123"]);
  });

  test("should log error messages with name", () => {
    logger.setLevel(LogLevel.error).setName("custom name");
    logger.error("error message 123");
    expect(console.errors).toEqual(["[error] [custom name] error message 123"]);
  });

  test("should not log debug messages when level is info", () => {
    logger.setLevel(LogLevel.info);
    logger.debug("debug message 123");
    expect(console.logs).toEqual([]);
  });

  test("should not log info messages when level is warn", () => {
    logger.setLevel(LogLevel.warn);
    logger.info("info message 123");
    expect(console.logs).toEqual([]);
  });

  test("should not log warn messages when level is error", () => {
    logger.setLevel(LogLevel.error);
    logger.warn("warn message 123");
    expect(console.errors).toEqual([]);
  });

  test("should log info but not debug messages when level is info", () => {
    logger.setLevel(LogLevel.info);
    logger.debug("debug message 123");
    logger.info("info message 123");
    expect(console.logs).toEqual(["[info] info message 123"]);
  });

  test("should log warn but not info messages when level is warn", () => {
    logger.setLevel(LogLevel.warn);
    logger.info("info message 123");
    logger.warn("warn message 123");
    expect(console.logs).toEqual([]);
    expect(console.errors).toEqual(["[warn] warn message 123"]);
  });

  test("should log error but not warn messages when level is error", () => {
    logger.setLevel(LogLevel.error);
    logger.warn("warn message 123");
    logger.error("error message 123");
    expect(console.logs).toEqual([]);
    expect(console.errors).toEqual(["[error] error message 123"]);
  });

  test("should log multiple arguments", () => {
    logger.setLevel(LogLevel.debug);
    logger.debug("foo", "bar");
    expect(console.logs).toEqual(["[debug] foo bar"]);
  });

  test("should log objects", () => {
    logger.setLevel(LogLevel.debug);
    logger.debug({ foo: "bar" });
    expect(console.logs).toEqual(["[debug] { foo: 'bar' }"]);
  });

  test("should log multiple lines", () => {
    logger.setLevel(LogLevel.debug);
    logger.debug("foo\nbar");
    expect(console.logs).toEqual(["[debug] foo", "[debug] bar"]);
  });

  test("should log multiple lines with name", () => {
    logger.setLevel(LogLevel.debug).setName("custom name");
    logger.debug("foo\nbar");
    expect(console.logs).toEqual([
      "[debug] [custom name] foo",
      "[debug] [custom name] bar",
    ]);
  });
});
