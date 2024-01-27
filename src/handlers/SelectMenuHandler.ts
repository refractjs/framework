import { AnySelectMenuInteraction, Collection } from "discord.js";
import { RefractClient } from "../RefractClient";
import { Piece } from "../piece/Piece";
import { HandlerMetadata, PieceHandler } from "./PieceHandler";

export interface SelectMenuHandlerMetadata extends HandlerMetadata {
  filter: (interaction: AnySelectMenuInteraction) => Promise<boolean> | boolean;
  propertyKey: string | symbol;
  handler: "selectMenu";
}

export interface SelectMenuEntry extends SelectMenuHandlerMetadata {
  piece: Piece;
}

export class SelectMenuHandler extends PieceHandler {
  public selectMenus: Collection<SelectMenuHandlerMetadata, SelectMenuEntry>;

  public constructor(client: RefractClient) {
    super(client, "selectMenu");

    this.selectMenus = new Collection();
  }

  public async register(piece: Piece, options: SelectMenuHandlerMetadata) {
    const entry = {
      ...options,
      piece,
    };

    this.selectMenus.set(options, entry);
  }

  public async unregister(_piece: Piece, options: SelectMenuHandlerMetadata) {
    this.selectMenus.delete(options);
  }

  public async run(interaction: AnySelectMenuInteraction) {
    for (const [, entry] of this.selectMenus) {
      if (await entry.filter(interaction)) {
        entry.piece[entry.propertyKey](interaction);
      }
    }
  }
}
