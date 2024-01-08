import { RefractClient } from "../RefractClient";
import { Piece } from "../piece/Piece";
import { PieceHandler } from "./PieceHandler";
import { HandlerMetadata } from "./PieceHandler";

export interface ListenerHandlerMetadata extends HandlerMetadata {
  name: string;
  once: boolean;
  propertyKey: string | symbol;
  handler: "listener";
}

export class ListenerHandler extends PieceHandler {
  public constructor(client: RefractClient) {
    super(client, "listener");
  }
  public async register(piece: Piece, options: ListenerHandlerMetadata) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.client.on(options.name as any, piece[options.propertyKey] as any);
  }
  public async unregister(piece: Piece, options: ListenerHandlerMetadata) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.client.off(options.name as any, piece[options.propertyKey] as any);
  }
}
