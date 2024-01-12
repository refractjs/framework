import { PermissionResolvable, PermissionsBitField } from "discord.js";

import { GuardError } from "../../errors/GuardError";
import { createCommandGuard } from "./createCommandGuard";
import { getReadablePermissions } from "../../util/permissions";

export const ClientPermissions = (
  ...requiredPermissions: PermissionResolvable[]
) => {
  const required = new PermissionsBitField(requiredPermissions);
  return createCommandGuard((interaction) => {
    if (!interaction.appPermissions) {
      throw new GuardError({
        guard: "ClientPermissions",
        message: "I don't have permissions to run this command!",
      });
    }

    const missing = interaction.appPermissions.missing(required);
    if (missing.length) {
      throw new GuardError({
        guard: "ClientPermissions",
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
