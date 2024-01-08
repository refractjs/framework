import { RefractClient } from "../RefractClient";
import { Piece } from "../piece/Piece";
import { PieceHandler } from "./PieceHandler";
import { HandlerMetadata } from "./PieceHandler";

export interface CommandHandlerMetadata extends HandlerMetadata {
  propertyKey: string | symbol;
  handler: "command";
}

export class CommandHandler extends PieceHandler {
  public constructor(client: RefractClient) {
    super(client, "command");
  }
  public async register(piece: Piece, options: CommandHandlerMetadata) {}
  public async unregister(piece: Piece, options: CommandHandlerMetadata) {}
}
