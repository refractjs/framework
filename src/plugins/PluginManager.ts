import { Collection } from "discord.js";
import { RefractClient } from "../RefractClient";
import { runHooks, runHooksSync } from "../hooks/hooks";
import { Plugin } from "./Plugin";
import { Constants } from "../constants";

export class PluginManager extends Collection<string, Plugin> {
  public client: RefractClient;

  public constructor(client: RefractClient) {
    super();
    this.client = client;
  }

  public calculateIntents() {
    let intents = 0;
    for (const plugin of this.values()) {
      intents |= plugin.intents;
    }
    return intents;
  }

  public register(plugin: Plugin) {
    this.set(plugin.name, plugin);
    runHooksSync(plugin, Constants.Hooks.PluginRegister);
    this.client.logger.info(`Plugin ${plugin.name} registered.`);
    return this;
  }

  public unregister(plugin: Plugin) {
    this.delete(plugin.name);
    runHooksSync(plugin, Constants.Hooks.PluginUnregister);
    this.client.logger.info(`Plugin ${plugin.name} unregistered.`);
    return this;
  }

  public async load(plugin: Plugin) {
    await runHooks(plugin, Constants.Hooks.PluginLoad);
  }

  public async unload(plugin: Plugin) {
    await runHooks(plugin, Constants.Hooks.PluginUnload);
  }

  public async loadAll() {
    const promises = [];
    for (const plugin of this.values()) {
      promises.push(this.load(plugin));
    }
    await Promise.all(promises);
  }

  public async unloadAll() {
    const promises = [];
    for (const plugin of this.values()) {
      promises.push(this.unload(plugin));
    }
    await Promise.all(promises);
  }
}
