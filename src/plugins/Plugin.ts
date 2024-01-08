import {
  BitFieldResolvable,
  GatewayIntentsString,
  IntentsBitField,
} from "discord.js";
import { RefractClient } from "../RefractClient";

export interface PluginOptions {
  name: string;
  description: string;
  intents: BitFieldResolvable<GatewayIntentsString, number>;
}
export abstract class Plugin {
  public client: RefractClient;
  public name: string;
  public description: string;
  public intents: number;

  public constructor(
    client: RefractClient,
    { name, description, intents }: PluginOptions
  ) {
    this.client = client;
    this.name = name;
    this.description = description;
    this.intents = IntentsBitField.resolve(intents);
  }
}
