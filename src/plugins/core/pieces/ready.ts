import { Listener } from "../../../decorators/Listener";
import { Piece, PieceContext } from "../../../piece/Piece";
import { CorePlugin } from "../CorePlugin";

export default class extends Piece<CorePlugin> {
  public constructor(context: PieceContext) {
    super(context, {
      name: "core.ready",
    });
  }

  @Listener()
  public async ready() {
    this.client.logger.info(`Logged in as ${this.client.user?.tag}!`);

    const commands = this.client.registry.build();
    await this.client.application?.commands.set([]);
    await this.client.application?.commands.set(commands);
  }
}
