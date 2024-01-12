import { GuildMember, RoleResolvable } from "discord.js";

import { GuardError } from "../../errors/GuardError";
import { createCommandGuard } from "./createCommandGuard";

export const UserRoles = (...requiredRoles: RoleResolvable[] | string[]) =>
  createCommandGuard((interaction) => {
    if (interaction.member && interaction.member instanceof GuildMember) {
      const memberRoles = interaction.member.roles.cache;

      if (!requiredRoles.some((role) => memberRoles.has(role.toString()))) {
        throw new GuardError({ guard: "UserRoles", silent: true });
      }
    }
  });
