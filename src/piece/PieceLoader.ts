import fs from "fs/promises";
import { basename, extname, sep } from "path";
import { RefractClient } from "../RefractClient";
import { HandlerMetadata } from "../handlers/PieceHandler";
import { Constructor } from "../types/utility";
import { Piece, PieceContext } from "./Piece";
import { Plugin } from "../plugins/Plugin";
import { Constants } from "../constants";
import { runHooks } from "../hooks/hooks";

export class PieceLoader {
  public client: RefractClient;
  public supportedExtensions = [".js", ".cjs"];
  public unsupportedExtensions = [".d.ts", ".map"];

  public constructor(client: RefractClient) {
    this.client = client;

    if (
      Reflect.has(process, Symbol.for("ts-node.register.instance")) ||
      process.env.TS_NODE_ENV ||
      "bun" in process.versions
    ) {
      this.supportedExtensions.push(".ts", ".cts");
    }
  }

  public async load(root: string, path: string): Promise<Piece | null> {
    const Piece = this.import(path);
    if (!Piece) return null;
    const context: PieceContext = {
      client: this.client,
      name: basename(path, extname(path)),
      path,
      root,
    };
    const piece = new Piece(context);

    const metadata: HandlerMetadata[] =
      Reflect.getMetadata(Constants.Metadata.Handlers, piece.constructor) ?? [];

    for (const data of metadata) {
      piece[data.propertyKey] = (piece[data.propertyKey] as any).bind(piece);
      this.client.handlers.get(data.handler).register(piece, data as any);
    }

    if (!piece.enabled) return null;

    await runHooks(piece, Constants.Hooks.PiecePreLoad);

    if (!piece.enabled) {
      await piece.unload();
      this.client.logger.debug(`Piece ${piece.name} was disabled by a hook.`);
    }

    if (this.client.store.has(piece.name)) {
      await this.client.store.get(piece.name)!.unload();
      this.client.logger.debug(
        `Piece ${piece.name} already exists, replacing it.`,
      );
    }

    this.client.store.set(piece.name, piece);
    this.client.logger.debug(
      `Piece ${piece.name} loaded with ${metadata.length} handler(s).`,
    );

    await runHooks(piece, Constants.Hooks.PieceLoad);

    return piece;
  }

  public async loadPath(root: string) {
    for await (const path of this.walk(root)) {
      await this.load(root, path);
    }
  }

  public async unload(piece: Piece) {
    this.client.store.delete(piece.name);
    const handlers: HandlerMetadata[] =
      Reflect.getMetadata(Constants.Metadata.Handlers, piece.constructor) ?? [];
    for (const data of handlers) {
      this.client.handlers.get(data.handler).unregister(piece, data as any);
    }
    await runHooks(piece, Constants.Hooks.PieceUnload);
  }

  public async unloadPlugin(plugin: Plugin) {
    for (const piece of this.client.store.values()) {
      if (piece.pluginId === plugin.name) {
        await this.unload(piece);
      }
    }
  }

  public filterPath(path: string) {
    for (const ext of this.unsupportedExtensions) {
      if (path.endsWith(ext)) return false;
    }
    for (const ext of this.supportedExtensions) {
      if (path.endsWith(ext)) return true;
    }
    return false;
  }

  public async *walk(root: string): AsyncIterableIterator<string> {
    const paths = await fs.readdir(root).catch(() => []);
    for (const path of paths) {
      const fullPath = `${root}${sep}${path}`;
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        yield* this.walk(fullPath);
      } else if (stats.isFile()) {
        if (!this.filterPath(fullPath)) continue;
        yield fullPath;
      }
    }
  }

  public import(path: string): Constructor<Piece> | null {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      let mod = require(path);
      delete require.cache[require.resolve(path)];
      if (!mod) return null;
      if (mod.default) mod = mod.default;
      if (mod.prototype instanceof Piece) {
        return mod;
      }
      return null;
    } catch (e) {
      this.client.logger.warn(e);
      return null;
    }
  }
}
