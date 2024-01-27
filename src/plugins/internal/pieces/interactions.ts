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

  @Listener({ name: "interactionCreate" })
  public async buttons(interaction: Interaction) {
    if (!interaction.isButton()) return;

    await this.client.handlers.get("button").run(interaction);
  }

  @Listener({ name: "interactionCreate" })
  public async selectMenus(interaction: Interaction) {
    if (!interaction.isAnySelectMenu()) return;

    await this.client.handlers.get("selectMenu").run(interaction);
  }

  @Listener({ name: "interactionCreate" })
  public async modals(interaction: Interaction) {
    if (!interaction.isModalSubmit()) return;

    await this.client.handlers.get("modal").run(interaction);
  }
}
