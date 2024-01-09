import { Interaction } from "discord.js";
import { Listener } from "../../../decorators/Listener";
import { Piece, PieceContext } from "../../../piece/Piece";
import { CorePlugin } from "../CorePlugin";

export default class extends Piece<CorePlugin> {
  public constructor(context: PieceContext) {
    super(context, {
      name: "core.interactions",
    });
  }

  @Listener({ name: "interactionCreate" })
  public async commands(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    await this.client.handlers.get("command").run(interaction);
  }
}
