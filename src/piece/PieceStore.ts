import { Collection } from "discord.js";
import { Piece } from "./Piece";

export class PieceStore extends Collection<string, Piece> {
  public resolve(piece: unknown) {
    if (piece instanceof Piece) return piece;
    else if (typeof piece === "string") return this.get(piece);
    else return undefined;
  }
}
