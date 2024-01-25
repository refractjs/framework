import { AsyncLocalStorage } from "async_hooks";
import { ChatInputCommandInteraction } from "discord.js";

export interface CommandAsyncContext {
  interaction: ChatInputCommandInteraction;
}

export const commandAsyncLocalStorage =
  new AsyncLocalStorage<CommandAsyncContext>();

export function getCommandAsyncContext(): CommandAsyncContext {
  const ctx = commandAsyncLocalStorage.getStore();
  if (!ctx)
    throw new Error("getCommandAsyncContext() called outside of command");
  return ctx;
}

export function getInteraction(): ChatInputCommandInteraction {
  return getCommandAsyncContext().interaction;
}
