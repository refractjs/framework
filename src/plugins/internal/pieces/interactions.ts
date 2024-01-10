import { Interaction } from "discord.js";
import { Listener } from "../../../decorators/Listener";
import { Piece, PieceContext } from "../../../piece/Piece";
import { InternalPlugin } from "../InternalPlugin";

export default class extends Piece<InternalPlugin> {
  public constructor(context: PieceContext) {
    super(context, {
      name: "internal.interactions",
    });
  }

  @Listener({ name: "interactionCreate" })
  public async commands(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    await this.client.handlers.get("command").run(interaction);
  }
}
