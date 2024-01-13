import { PermissionResolvable, PermissionsBitField } from "discord.js";

import { GuardError } from "../../errors/GuardError";
import { createCommandGuard } from "./createCommandGuard";
import { getReadablePermissions } from "../../util/permissions";

export const UserPermissions = (
  ...requiredPermissions: PermissionResolvable[]
) => {
  const required = new PermissionsBitField(requiredPermissions);
  return createCommandGuard((interaction) => {
    if (!interaction.memberPermissions) {
      throw new GuardError({
        guard: "UserPermissions",
        message: "You don't have permissions to run this command!",
      });
    }

    const missing = interaction.memberPermissions.missing(required);
    if (missing.length) {
      throw new GuardError({
        guard: "UserPermissions",
        message: `You are missing the following permissions: ${getReadablePermissions(
          missing,
        ).join(", ")}`,
        context: {
          missing,
        },
      });
    }
  });
};
