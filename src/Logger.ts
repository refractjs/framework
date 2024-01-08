import { inspect } from "node:util";
import chalk, { ForegroundColor, BackgroundColor, Chalk } from "chalk";

export enum LogLevel {
  debug = 0,
  info = 1,
  warn = 2,
  error = 3,
}

export type ConsoleMethod = keyof ConsoleLike;

export interface ConsoleLike {
  log: (...args: unknown[]) => void;
  error: (...args: unknown[]) => void;
}

export class Logger {
  public level: LogLevel = LogLevel.info;
  public name?: string | undefined = undefined;

  public output: ConsoleLike = console;
  public chalk: Chalk = new chalk.Instance({ level: 3 });

  public setName(name?: string) {
    this.name = name;
    return this;
  }

  public setLevel(level: LogLevel) {
    this.level = level;
    return this;
  }

  public setOutput(console: ConsoleLike) {
    this.output = console;
    return this;
  }

  public setChalkLevel(level: chalk.Level) {
    this.chalk.level = level;
    return this;
  }

  private inspect(object: unknown) {
    if (typeof object === "string") return object;
    else return inspect(object);
  }

  private log(level: LogLevel, ...args: unknown[]) {
    if (level < this.level) return;
    const message = args.map(this.inspect).join(" ");
    const name = this.name ? `[${this.name}] ` : "";
    const lines = message
      .split("\n")
      .map((line) => `[${LogLevel[level]}] ${name}${line}`);
    const [color, background, method] = Logger.levels[level];
    for (const line of lines) {
      this.output[method](this.chalk[color][background](line));
    }
  }

  public debug(...args: unknown[]) {
    this.log(LogLevel.debug, ...args);
  }

  public info(...args: unknown[]) {
    this.log(LogLevel.info, ...args);
  }

  public warn(...args: unknown[]) {
    this.log(LogLevel.warn, ...args);
  }

  public error(...args: unknown[]) {
    this.log(LogLevel.error, ...args);
  }

  public static levels: Record<
    LogLevel,
    [typeof ForegroundColor, typeof BackgroundColor, ConsoleMethod]
  > = {
    [LogLevel.debug]: ["magenta", "bgBlack", "log"],
    [LogLevel.info]: ["white", "bgBlue", "log"],
    [LogLevel.warn]: ["yellow", "bgBlack", "error"],
    [LogLevel.error]: ["red", "bgBlack", "error"],
  };

  public static create(name?: string) {
    return new Logger().setName(name);
  }
}
