import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Collection,
} from "discord.js";
import { RefractClient } from "../RefractClient";
import { Constants } from "../constants";
import { SlashCommandOptionMetadata } from "../decorators/Command";
import { GuardError } from "../errors/GuardError";
import { Piece } from "../piece/Piece";
import { HandlerMetadata, PieceHandler } from "./PieceHandler";
import { commandAsyncLocalStorage } from "../context/command";

export interface CommandHandlerMetadata extends HandlerMetadata {
  name: string;
  description: string;
  group: string | null;
  subcommand: string | null;
  nsfw: boolean;
  dmPermission: boolean | null | undefined;
  defaultMemberPermissions: string | number | bigint | null | undefined;
  passthrough: boolean;
  propertyKey: string | symbol;
  handler: "command";
}

export interface CommandEntry extends CommandHandlerMetadata {
  piece: Piece;
  options: SlashCommandOptionMetadata[];
}

export class CommandHandler extends PieceHandler {
  public commands: Collection<string, CommandEntry>;

  public constructor(client: RefractClient) {
    super(client, "command");

    this.commands = new Collection();
  }

  public async register(piece: Piece, options: CommandHandlerMetadata) {
    const entry: CommandEntry = {
      ...options,
      piece,
      options:
        Reflect.getMetadata(
          Constants.Metadata.CommandOptions,
          piece.constructor,
        )?.[options.propertyKey] ?? [],
    };

    this.commands.set(
      this.getId(entry.name, entry.group, entry.subcommand),
      entry,
    );
  }

  public async unregister(_piece: Piece, options: CommandHandlerMetadata) {
    this.commands.delete(
      this.getId(options.name, options.group, options.subcommand),
    );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    const entry = this.resolveEntry(
      interaction.commandName,
      interaction.options.getSubcommandGroup(false),
      interaction.options.getSubcommand(false),
    );

    if (!entry) {
      this.client.logger.debug("Unknown command received");
      return;
    }

    const args: [ChatInputCommandInteraction, ...unknown[]] = [interaction];
    for (const option of entry.options) {
      const value = this.resolveOption(
        interaction,
        option.data.name,
        option.type,
      );
      args[option.parameterIndex] = value ?? null;
    }

    commandAsyncLocalStorage.run({ interaction }, async () => {
      try {
        await entry.piece[entry.propertyKey](...args);
      } catch (e) {
        if (e instanceof GuardError) {
          this.client.logger.debug(
            `${e.guard} guard failed for @${interaction.user.username}`,
          );
          if (this.client.listenerCount("guardError")) {
            this.client.emit("guardError", interaction, e);
            return;
          } else {
            if (e.silent) return;
            await interaction.reply({ content: e.message }).catch(() => {});
          }
        } else {
          this.client.logger.error(e);
          await interaction
            .reply("An error occurred while running this command.")
            .catch(() => {});
        }
      }
    });
  }

  public resolveEntry(
    name: string,
    group: string | null,
    subcommand: string | null,
  ) {
    const ids = [name, group, subcommand].filter(Boolean);
    for (let i = ids.length; i > 0; i--) {
      const id = ids.slice(0, i).join(".");
      const entry = this.commands.get(id);
      if (entry && !entry.passthrough) return entry;
    }

    return null;
  }

  public getId(a: string, b?: string | null, c?: string | null) {
    return [a, b, c].filter(Boolean).join(".");
  }

  public resolveOption(
    interaction: ChatInputCommandInteraction,
    name: string,
    type: ApplicationCommandOptionType,
  ): unknown | null {
    switch (type) {
      case ApplicationCommandOptionType.String:
        return interaction.options.getString(name);
      case ApplicationCommandOptionType.Integer:
        return interaction.options.getInteger(name);
      case ApplicationCommandOptionType.Boolean:
        return interaction.options.getBoolean(name);
      case ApplicationCommandOptionType.User:
        return interaction.options.getUser(name);
      case ApplicationCommandOptionType.Channel:
        return interaction.options.getChannel(name);
      case ApplicationCommandOptionType.Role:
        return interaction.options.getRole(name);
      case ApplicationCommandOptionType.Mentionable:
        return interaction.options.getMentionable(name);
      case ApplicationCommandOptionType.Number:
        return interaction.options.getNumber(name);
      case ApplicationCommandOptionType.Attachment:
        return interaction.options.getAttachment(name);
    }
    return null;
  }
}
