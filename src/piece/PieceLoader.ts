import fs from "fs/promises";
import { basename, extname, sep } from "path";
import { Logger } from "../Logger";
import { RefractClient } from "../RefractClient";
import { HandlerMetadata } from "../handlers/PieceHandler";
import { Constructor } from "../types/utility";
import { Piece, PieceContext } from "./Piece";
import { Plugin } from "../plugins/Plugin";

export class PieceLoader {
  public client: RefractClient;

  private logger = Logger.create("Loader");

  public constructor(client: RefractClient) {
    this.client = client;
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
      Reflect.getMetadata("refract:handlers", piece.constructor) ?? [];

    for (const data of metadata) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      piece[data.propertyKey] = (piece[data.propertyKey] as any).bind(piece);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.client.handlers.get(data.handler).register(piece, data as any);
    }
    this.client.store.set(piece.name, piece);
    this.logger.debug(
      `Piece ${piece.name} loaded with ${metadata.length} handler(s).`
    );
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
      Reflect.getMetadata("refract:handlers", piece.constructor) ?? [];
    for (const data of handlers) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.client.handlers.get(data.handler).unregister(piece, data as any);
    }
  }

  public async unloadPlugin(plugin: Plugin) {
    for (const piece of this.client.store.values()) {
      if (piece.pluginId === plugin.name) {
        await this.unload(piece);
      }
    }
  }

  public async *walk(root: string): AsyncIterableIterator<string> {
    const paths = await fs.readdir(root).catch(() => []);
    for (const path of paths) {
      const fullPath = `${root}${sep}${path}`;
      const stats = await fs.stat(fullPath);
      if (stats.isDirectory()) {
        yield* this.walk(fullPath);
      } else if (stats.isFile()) {
        if (!path.endsWith(".js")) continue;
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
      this.client.logger.error(e);
      return null;
    }
  }
}
