import { GuardError } from "../../errors/GuardError";
import { createCommandGuard } from "./createCommandGuard";

export const OwnerOnly = () =>
  createCommandGuard((interaction) => {
    if (!interaction.client.owners.some((r) => r.id === interaction.user.id))
      throw new GuardError({ guard: "OwnerOnly", silent: true });
  });
