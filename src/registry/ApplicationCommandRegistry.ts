import {
  ApplicationCommandOptionType,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from "discord.js";
import { RefractClient } from "../RefractClient";
import { SlashCommandOptionMetadata } from "../decorators/Command";
import { CommandEntry } from "../handlers/CommandHandler";

export class ApplicationCommandRegistry {
  public client: RefractClient;

  public constructor(client: RefractClient) {
    this.client = client;
  }

  public addOption(
    builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
    data: SlashCommandOptionMetadata
  ) {
    if (data.type === ApplicationCommandOptionType.String) {
      data;
    }
    switch (data.type) {
      case ApplicationCommandOptionType.Attachment:
        return builder.addAttachmentOption((option) =>
          option
            .setName(data.data.name)
            .setDescription(data.data.description)
            .setRequired(data.data.required ?? false)
        );
      case ApplicationCommandOptionType.Boolean:
        return builder.addBooleanOption((option) =>
          option
            .setName(data.data.name)
            .setDescription(data.data.description)
            .setRequired(data.data.required ?? false)
        );
      case ApplicationCommandOptionType.Channel:
        return builder.addChannelOption((option) =>
          option
            .setName(data.data.name)
            .setDescription(data.data.description)
            .setRequired(data.data.required ?? false)
            .addChannelTypes(...(data.data.channelTypes ?? []))
        );
      case ApplicationCommandOptionType.Integer:
        return builder.addIntegerOption((option) =>
          option
            .setName(data.data.name)
            .setDescription(data.data.description)
            .setRequired(data.data.required ?? false)
        );
      case ApplicationCommandOptionType.Mentionable:
        return builder.addMentionableOption((option) =>
          option
            .setName(data.data.name)
            .setDescription(data.data.description)
            .setRequired(data.data.required ?? false)
        );
      case ApplicationCommandOptionType.Number:
        return builder.addNumberOption((option) =>
          option
            .setName(data.data.name)
            .setDescription(data.data.description)
            .setRequired(data.data.required ?? false)
        );
      case ApplicationCommandOptionType.Role:
        return builder.addRoleOption((option) =>
          option
            .setName(data.data.name)
            .setDescription(data.data.description)
            .setRequired(data.data.required ?? false)
        );
      case ApplicationCommandOptionType.String:
        return builder.addStringOption((option) =>
          option
            .setName(data.data.name)
            .setDescription(data.data.description)
            .setRequired(data.data.required ?? false)
        );
    }
    return builder;
  }

  public buildCommand(command: CommandEntry) {
    const builder = new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description)
      .setDMPermission(command.dmPermission)
      .setDefaultMemberPermissions(command.defaultMemberPermissions)
      .setNSFW(command.nsfw);

    for (const option of command.options) {
      this.addOption(builder, option);
    }

    return builder;
  }

  public buildSubcommand(command: CommandEntry) {
    const builder = new SlashCommandSubcommandBuilder()
      .setName(command.subcommand!)
      .setDescription(command.description);

    for (const option of command.options) {
      this.addOption(builder, option);
    }

    return builder;
  }

  public build() {
    const commands: SlashCommandBuilder[] = [];
    const commandHandler = this.client.handlers.get("command");

    for (const command of commandHandler.commands.values()) {
      if (command.group || command.subcommand) continue;
      commands.push(this.buildCommand(command));
    }

    for (const groupCommand of commandHandler.commands.values()) {
      if (!groupCommand.group || groupCommand.subcommand) continue;
      const command = commands.find((c) => c.name === groupCommand.name);
      if (!command) continue;
      command.addSubcommandGroup((group) =>
        group
          .setName(groupCommand.group!)
          .setDescription(groupCommand.description)
      );
    }

    for (const subcommandCommand of commandHandler.commands.values()) {
      if (!subcommandCommand.subcommand) continue;
      const command = commands.find((c) => c.name === subcommandCommand.name);
      if (!command) continue;
      const group = (command.options as any[]).find(
        (option) =>
          option instanceof SlashCommandSubcommandGroupBuilder &&
          option.name === subcommandCommand.group
      ) as SlashCommandSubcommandGroupBuilder | undefined;
      if (!group) continue;
      group.addSubcommand(this.buildSubcommand(subcommandCommand));
    }

    return commands;
  }
}
