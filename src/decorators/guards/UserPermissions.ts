import {
  APIInteractionGuildMember,
  GuildMember,
  PermissionResolvable,
  PermissionsBitField,
} from "discord.js";

import { GuardError } from "../../errors/GuardError";
import { createCommandGuard } from "./createCommandGuard";

export const UserPermissions = (
  ...requiredPermissions: PermissionResolvable[]
) =>
  createCommandGuard((interaction) => {
    if (interaction.member) {
      const memberPermissions = (
        interaction.member as GuildMember | APIInteractionGuildMember
      ).permissions;

      if (
        typeof memberPermissions === "string" ||
        memberPermissions instanceof String
      ) {
        if (
          !requiredPermissions.some((permission) =>
            (memberPermissions as string).includes(permission.toString()),
          )
        ) {
          throw new GuardError({ guard: "UserPermissions", silent: true });
        }
      } else {
        if (
          !requiredPermissions.some((permission) =>
            (memberPermissions as Readonly<PermissionsBitField>).has(
              permission,
            ),
          )
        ) {
          throw new GuardError({ guard: "UserPermissions", silent: true });
        }
      }
    }
  });
