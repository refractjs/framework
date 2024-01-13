import { GuardError } from "../../errors/GuardError";
import { createCommandGuard } from "./createCommandGuard";

export const RequiredRole = (...requiredRoles: (string | string[])[]) => {
  const roleIds = requiredRoles.flat();
  return createCommandGuard((interaction) => {
    if (
      !interaction.inCachedGuild() ||
      !interaction.member.roles.cache.some((role) => roleIds.includes(role.id))
    ) {
      throw new GuardError({
        guard: "RequiredRole",
        message: "You don't have the required role to use this command!",
        context: {
          roleIds,
        },
      });
    }
  });
};
