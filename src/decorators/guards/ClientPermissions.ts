import { PermissionResolvable } from "discord.js";

import { GuardError } from "../../errors/GuardError";
import { createCommandGuard } from "./createCommandGuard";

export const ClientPermissions = (
  ...requiredPermissions: PermissionResolvable[]
) =>
  createCommandGuard(async (interaction) => {
    if (interaction.guild) {
      const me = await interaction.guild.members
        .fetch(interaction.client.user.id)
        .catch(() => null);

      if (
        !me ||
        !requiredPermissions.some((permission) =>
          me.permissions.has(permission),
        )
      ) {
        throw new GuardError({ guard: "ClientPermissions", silent: true });
      }
    }
  });
