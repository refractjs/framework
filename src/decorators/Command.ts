import {
  ApplicationCommandOptionType,
  SlashCommandChannelOption,
  SlashCommandNumberOption,
  SlashCommandStringOption,
} from "discord.js";
import { CommandHandlerMetadata } from "../handlers/CommandHandler";
import { HandlerMetadata } from "../handlers/PieceHandler";

export interface CommandOptions {
  name: string;
  description: string;
  group?: string;
  subcommand?: string;
  nsfw?: boolean;
  dmPermissions?: boolean | null | undefined;
  defaultMemberPermissions?: string | number | bigint | null | undefined;
}

export function Command(options: CommandOptions): MethodDecorator {
  return (target, propertyKey) => {
    if (!Reflect.hasMetadata("refract:handlers", target.constructor)) {
      Reflect.defineMetadata("refract:handlers", [], target.constructor);
    }

    const handlers = Reflect.getMetadata(
      "refract:handlers",
      target.constructor
    ) as HandlerMetadata[];

    const handler: CommandHandlerMetadata = {
      name: options.name,
      description: options.description,
      group: options.group ?? null,
      subcommand: options.subcommand ?? null,
      defaultMemberPermissions: options.defaultMemberPermissions,
      dmPermissions: options.dmPermissions,
      nsfw: options.nsfw ?? false,
      propertyKey,
      handler: "command",
    };
    handlers.push(handler);

    Reflect.defineMetadata("refract:handlers", handlers, target.constructor);
  };
}

export interface SlashCommandOptionMetadata<
  T extends ApplicationCommandOptionType,
  D extends SlashCommandOptionData
> {
  type: T;
  parameterIndex: number;
  data: D;
}

export interface SlashCommandOptionData {
  name: string;
  description: string;
  required?: boolean;
}

export type SlashCommandOptionDataUnion =
  | SlashCommandStringOptionData
  | SlashCommandNumberOptionData
  | SlashCommandIntegerOptionData
  | SlashCommandBooleanOptionData
  | SlashCommandChannelOptionData
  | SlashCommandRoleOptionData
  | SlashCommandUserOptionData
  | SlashCommandMentionableOptionData
  | SlashCommandAttachmentOptionData;

export interface SlashCommandStringOptionData extends SlashCommandOptionData {
  autocomplete?: boolean;
  choices?: SlashCommandStringOption["choices"];
  maxLength?: number;
  minLength?: number;
}

export interface SlashCommandNumberOptionData extends SlashCommandOptionData {
  autocomplete?: boolean;
  choices?: SlashCommandNumberOption["choices"];
  maxValue?: number;
  minValue?: number;
}

export interface SlashCommandIntegerOptionData extends SlashCommandOptionData {
  autocomplete?: boolean;
  choices?: SlashCommandNumberOption["choices"];
  maxValue?: number;
  minValue?: number;
}

export interface SlashCommandBooleanOptionData extends SlashCommandOptionData {}

export interface SlashCommandChannelOptionData extends SlashCommandOptionData {
  channelTypes: SlashCommandChannelOption["channel_types"];
}
export interface SlashCommandRoleOptionData extends SlashCommandOptionData {}

export interface SlashCommandUserOptionData extends SlashCommandOptionData {}

export interface SlashCommandMentionableOptionData
  extends SlashCommandOptionData {}
export interface SlashCommandAttachmentOptionData
  extends SlashCommandOptionData {}

function createOptionDecorator<D extends SlashCommandOptionData>(
  type: ApplicationCommandOptionType,
  data: D
): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    if (typeof propertyKey !== "string") {
      throw new Error("propertyKey must be a string");
    }
    if (!Reflect.hasMetadata("refract:slashOptions", target.constructor)) {
      Reflect.defineMetadata("refract:slashOptions", {}, target.constructor);
    }

    const slashOptions = Reflect.getMetadata(
      "refract:slashOptions",
      target.constructor
    ) as Record<
      string,
      SlashCommandOptionMetadata<any, SlashCommandOptionData>[]
    >;

    if (!slashOptions[propertyKey]) {
      slashOptions[propertyKey] = [];
    }

    slashOptions[propertyKey]?.push({
      type,
      parameterIndex,
      data,
    });

    Reflect.defineMetadata(
      "refract:slashOptions",
      slashOptions,
      target.constructor
    );
  };
}

export function StringOption(data: SlashCommandStringOptionData) {
  return createOptionDecorator<SlashCommandStringOptionData>(
    ApplicationCommandOptionType.String,
    data
  );
}

export function NumberOption(data: SlashCommandNumberOptionData) {
  return createOptionDecorator<SlashCommandNumberOptionData>(
    ApplicationCommandOptionType.Number,
    data
  );
}

export function IntegerOption(data: SlashCommandIntegerOptionData) {
  return createOptionDecorator<SlashCommandIntegerOptionData>(
    ApplicationCommandOptionType.Integer,
    data
  );
}

export function BooleanOption(data: SlashCommandBooleanOptionData) {
  return createOptionDecorator<SlashCommandBooleanOptionData>(
    ApplicationCommandOptionType.Boolean,
    data
  );
}

export function ChannelOption(data: SlashCommandChannelOptionData) {
  return createOptionDecorator<SlashCommandChannelOptionData>(
    ApplicationCommandOptionType.Channel,
    data
  );
}

export function RoleOption(data: SlashCommandRoleOptionData) {
  return createOptionDecorator<SlashCommandRoleOptionData>(
    ApplicationCommandOptionType.Role,
    data
  );
}

export function UserOption(data: SlashCommandUserOptionData) {
  return createOptionDecorator<SlashCommandUserOptionData>(
    ApplicationCommandOptionType.User,
    data
  );
}

export function MentionableOption(data: SlashCommandMentionableOptionData) {
  return createOptionDecorator<SlashCommandMentionableOptionData>(
    ApplicationCommandOptionType.Mentionable,
    data
  );
}

export function AttachmentOption(data: SlashCommandAttachmentOptionData) {
  return createOptionDecorator<SlashCommandAttachmentOptionData>(
    ApplicationCommandOptionType.Attachment,
    data
  );
}
