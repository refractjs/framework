import { RefractClient } from "../RefractClient";
import { Piece } from "../piece/Piece";
import { Handlers } from "./PieceHandlerManager";

export interface HandlerMetadata {
  propertyKey: string | symbol;
  handler: keyof Handlers;
}

export abstract class PieceHandler {
  public client: RefractClient;
  public name: string;

  public constructor(client: RefractClient, name: string) {
    this.client = client;
    this.name = name;
  }

  public abstract register(
    piece: Piece,
    options: HandlerMetadata
  ): Promise<unknown>;

  public abstract unregister(
    piece: Piece,
    options: HandlerMetadata
  ): Promise<unknown>;
}
