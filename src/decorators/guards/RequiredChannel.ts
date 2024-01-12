import { GuardError } from "../../errors/GuardError";
import { createCommandGuard } from "./createCommandGuard";

export const RequiredChannel = (...requiredChannels: (string | string[])[]) => {
  const channelIds = requiredChannels.flat();
  return createCommandGuard((interaction) => {
    if (!channelIds.includes(interaction.channelId)) {
      throw new GuardError({
        guard: "RequiredChannel",
        message: "You can't use this command in this channel!",
        context: {
          channelIds,
        },
      });
    }
  });
};
