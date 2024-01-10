import { Listener } from "../../../decorators/Listener";
import { Piece, PieceContext } from "../../../piece/Piece";
import { InternalPlugin } from "../InternalPlugin";

export default class extends Piece<InternalPlugin> {
  public constructor(context: PieceContext) {
    super(context, {
      name: "internal.ready",
    });
  }

  @Listener()
  public async ready() {
    this.client.logger.info(`Logged in as ${this.client.user?.tag}!`);

    const commands = this.client.registry.build();
    await this.client.application?.commands.set(commands);
  }
}
