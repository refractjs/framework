import { Collection } from "discord.js";
import { RefractClient } from "../RefractClient";
import { runHooks, runHooksSync } from "../hooks/hooks";
import { Plugin } from "./Plugin";

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
    runHooksSync(plugin, "plugin:register");
    this.client.logger.info(`Plugin ${plugin.name} registered.`);
    return this;
  }

  public unregister(plugin: Plugin) {
    this.delete(plugin.name);
    runHooksSync(plugin, "plugin:unregister");
    this.client.logger.info(`Plugin ${plugin.name} unregistered.`);
    return this;
  }

  public async load(plugin: Plugin) {
    await runHooks(plugin, "plugin:load");
  }

  public async unload(plugin: Plugin) {
    await runHooks(plugin, "plugin:unload");
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
