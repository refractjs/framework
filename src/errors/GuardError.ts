export interface GuardErrorOptions {
  guard: string;
  silent?: boolean;
  data?: any;
}

export class GuardError extends Error {
  public guard: string;
  public silent: boolean;
  public data: any;

  public constructor(options: GuardErrorOptions) {
    super(`GuardError: ${options.guard}`);
    this.guard = options.guard;
    this.silent = options.silent ?? false;
    this.data = options.data;
  }
}
