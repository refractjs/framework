export interface GuardErrorOptions {
  guard: string;
  silent?: boolean;
  message?: string;
  context?: any;
}

export class GuardError extends Error {
  public guard: string;
  public silent: boolean;
  public message: string;
  public context: any;

  public constructor(options: GuardErrorOptions) {
    super(`GuardError: ${options.guard}`);
    this.guard = options.guard;
    this.silent = options.silent ?? false;
    this.message = options.message ?? "";
    this.context = options.context ?? undefined;
  }
}
