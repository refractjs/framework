import { basename, relative, sep } from "path";
import { RefractClient } from "../RefractClient";
import { Plugin } from "../plugins/Plugin";
import { getPluginNameFromPath } from "../util/getPluginNameFromPath";

export class PieceLocation {
  public readonly full: string;
  public readonly root: string;

  public constructor(full: string, root: string) {
    this.full = full;
    this.root = root;
  }

  public get relative() {
    return relative(this.root, this.full);
  }

  public get directories() {
    return this.relative.split(sep).slice(0, -1);
  }

  public get name() {
    return basename(this.full);
  }

  public toJSON(): PieceLocationJSON {
    return {
      directories: this.directories,
      full: this.full,
      name: this.name,
      relative: this.relative,
      root: this.root,
    };
  }
}

export interface PieceLocationJSON {
  directories: string[];
  full: string;
  name: string;
  relative: string;
  root: string;
}

export interface PieceContext {
  root: string;
  path: string;
  name: string;
  client: RefractClient;
}

export interface PieceOptions {
  name: string;
  enabled?: boolean;
  plugin?: string;
}
export type PieceResolvable = Piece | string;

export class Piece<TPlugin extends Plugin = Plugin> {
  public client: RefractClient;
  public name: string;
  public enabled: boolean;
  public location: PieceLocation;
  public pluginId: string;
  [key: string | symbol]: any;

  public constructor(context: PieceContext, options: PieceOptions) {
    this.client = context.client;
    this.location = new PieceLocation(context.path, context.root);
    this.name = options.name ?? context.name;
    this.enabled = options.enabled ?? true;
    this.pluginId = options.plugin ?? getPluginNameFromPath(context.path);
  }

  public get plugin() {
    return this.client.plugins.get(this.pluginId)! as TPlugin;
  }

  public async unload() {
    await this.client.loader.unload(this);
    this.enabled = false;
  }

  public async reload() {
    await this.client.loader.load(this.location.root, this.location.name);
  }

  public toJSON(): PieceJSON {
    return {
      location: this.location.toJSON(),
      name: this.name,
      enabled: this.enabled,
    };
  }

  public toString() {
    return `${this.constructor.name}<${this.name}>`;
  }
}

export interface PieceJSON {
  location: PieceLocationJSON;
  name: string;
  enabled: boolean;
}
