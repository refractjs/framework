import { Collection, ModalSubmitInteraction } from "discord.js";
import { RefractClient } from "../RefractClient";
import { Piece } from "../piece/Piece";
import { HandlerMetadata, PieceHandler } from "./PieceHandler";

export interface ModalHandlerMetadata extends HandlerMetadata {
  filter: (interaction: ModalSubmitInteraction) => Promise<boolean> | boolean;
  propertyKey: string | symbol;
  handler: "modal";
}

export interface ModalEntry extends ModalHandlerMetadata {
  piece: Piece;
}

export class ModalHandler extends PieceHandler {
  public modals: Collection<ModalHandlerMetadata, ModalEntry>;

  public constructor(client: RefractClient) {
    super(client, "modal");

    this.modals = new Collection();
  }

  public async register(piece: Piece, options: ModalHandlerMetadata) {
    const entry = {
      ...options,
      piece,
    };

    this.modals.set(options, entry);
  }

  public async unregister(_piece: Piece, options: ModalHandlerMetadata) {
    this.modals.delete(options);
  }

  public async run(interaction: ModalSubmitInteraction) {
    for (const [, entry] of this.modals) {
      if (await entry.filter(interaction)) {
        entry.piece[entry.propertyKey](interaction);
      }
    }
  }
}
