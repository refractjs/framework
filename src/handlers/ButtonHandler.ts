import { ButtonInteraction, Collection } from "discord.js";
import { RefractClient } from "../RefractClient";
import { Piece } from "../piece/Piece";
import { HandlerMetadata, PieceHandler } from "./PieceHandler";

export interface ButtonHandlerMetadata extends HandlerMetadata {
  filter: (interaction: ButtonInteraction) => Promise<boolean> | boolean;
  propertyKey: string | symbol;
  handler: "button";
}

export interface ButtonEntry extends ButtonHandlerMetadata {
  piece: Piece;
}

export class ButtonHandler extends PieceHandler {
  public buttons: Collection<ButtonHandlerMetadata, ButtonEntry>;

  public constructor(client: RefractClient) {
    super(client, "button");

    this.buttons = new Collection();
  }

  public async register(piece: Piece, options: ButtonHandlerMetadata) {
    const entry = {
      ...options,
      piece,
    };

    this.buttons.set(options, entry);
  }

  public async unregister(_piece: Piece, options: ButtonHandlerMetadata) {
    this.buttons.delete(options);
  }

  public async run(interaction: ButtonInteraction) {
    for (const [, entry] of this.buttons) {
      if (await entry.filter(interaction)) {
        entry.piece[entry.propertyKey](interaction);
      }
    }
  }
}
