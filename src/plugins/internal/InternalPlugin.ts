import { resolve } from "path";
import { RefractClient } from "../../RefractClient";
import { PluginLoad, PluginUnload } from "../../hooks/decorators";
import { Plugin } from "../Plugin";

export class InternalPlugin extends Plugin {
  public constructor(client: RefractClient) {
    super(client, {
      name: "internal",
      description: "The internal plugin.",
      intents: ["Guilds"],
    });
  }

  @PluginLoad()
  public async load() {
    this.client.loader.loadPath(resolve(__dirname, "pieces"));
  }

  @PluginUnload()
  public async unload() {
    this.client.loader.unloadPlugin(this);
  }
}
