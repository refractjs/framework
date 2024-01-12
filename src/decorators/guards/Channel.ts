import { GuildChannelResolvable, Snowflake } from "discord.js";

import { GuardError } from "../../errors/GuardError";
import { createCommandGuard } from "./createCommandGuard";

export const Channel = (
  ...requiredChannels: GuildChannelResolvable[] | string[]
) =>
  createCommandGuard((interaction) => {
    const interactionChannelId: Snowflake | null = interaction.channelId;

    if (
      !requiredChannels.some((channel) => {
        if (typeof channel === "string") {
          return channel === interactionChannelId;
        } else {
          return channel.id === interactionChannelId;
        }
      })
    ) {
      throw new GuardError({ guard: "Channel", silent: true });
    }
  });
