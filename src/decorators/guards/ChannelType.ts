import { ChannelType as DiscordChannelType } from "discord.js";

import { GuardError } from "../../errors/GuardError";
import { createCommandGuard } from "./createCommandGuard";

export const ChannelType = (
  requiredChannelType: (DiscordChannelType | DiscordChannelType[])[],
) => {
  const channelTypes = requiredChannelType.flat();
  createCommandGuard((interaction) => {
    if (
      !interaction.channel ||
      !channelTypes.includes(interaction.channel.type)
    ) {
      throw new GuardError({
        guard: "ChannelType",
        message: "You can't use this command in this channel!",
        context: {
          channelTypes,
        },
      });
    }
  });
};
