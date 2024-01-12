import { ChannelType as DiscordChannelType } from "discord.js";

import { GuardError } from "../../errors/GuardError";
import { createCommandGuard } from "./createCommandGuard";

export const ChannelType = (requiredChannelType: DiscordChannelType) =>
  createCommandGuard((interaction) => {
    if (
      interaction.channel &&
      interaction.channel.type !== requiredChannelType
    ) {
      throw new GuardError({ guard: "ChannelType", silent: true });
    }
  });
