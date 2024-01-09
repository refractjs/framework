import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Collection,
} from "discord.js";
import { RefractClient } from "../RefractClient";
import {
  SlashCommandOptionDataUnion,
  SlashCommandOptionMetadata,
} from "../decorators/Command";
import { Piece } from "../piece/Piece";
import { HandlerMetadata, PieceHandler } from "./PieceHandler";
import { Constants } from "../constants";

export interface CommandHandlerMetadata extends HandlerMetadata {
  name: string;
  description: string;
  group: string | null;
  subcommand: string | null;
  nsfw: boolean;
  dmPermissions: boolean | null | undefined;
  defaultMemberPermissions: string | number | bigint | null | undefined;
  propertyKey: string | symbol;
  handler: "command";
}

export interface CommandEntry extends CommandHandlerMetadata {
  piece: Piece;
  options: SlashCommandOptionMetadata<any, SlashCommandOptionDataUnion>[];
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
          piece.constructor
        )?.[options.propertyKey] ?? [],
    };

    this.commands.set(
      this.getId(entry.name, entry.group, entry.subcommand),
      entry
    );
  }
  public async unregister(_piece: Piece, options: CommandHandlerMetadata) {
    this.commands.delete(
      this.getId(options.name, options.group, options.subcommand)
    );
  }

  public async run(interaction: ChatInputCommandInteraction) {
    const entry = this.resolveEntry(
      interaction.commandName,
      interaction.options.getSubcommandGroup(false),
      interaction.options.getSubcommand(false)
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
        option.type
      );
      args[option.parameterIndex] = value ?? null;
    }

    try {
      await entry.piece[entry.propertyKey](...args);
    } catch (e) {
      this.client.logger.error(e);
      interaction
        .reply("An error occurred while running this command.")
        .catch(() => {});
    }
  }

  public resolveEntry(
    name: string,
    group: string | null,
    subcommand: string | null
  ) {
    if (group) {
      return (
        this.commands.get(this.getId(name, group, subcommand)) ||
        this.commands.get(this.getId(name, group)) ||
        this.commands.get(this.getId(name))
      );
    } else {
      return (
        this.commands.get(this.getId(name, subcommand)) ||
        this.commands.get(this.getId(name))
      );
    }
  }

  public getId(a: string, b?: string | null, c?: string | null) {
    return [a, b, c].filter(Boolean).join(".");
  }

  public resolveOption(
    interaction: ChatInputCommandInteraction,
    name: string,
    type: ApplicationCommandOptionType
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
