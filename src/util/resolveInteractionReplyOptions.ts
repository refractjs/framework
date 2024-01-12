import { EmbedBuilder, InteractionReplyOptions } from "discord.js";

export function resolveInteractionReplyOptions(
  data: any,
): InteractionReplyOptions | null {
  if (data instanceof Error) {
    return { content: data.toString() };
  } else if (data instanceof EmbedBuilder) {
    return { embeds: [data] };
  } else if (typeof data === "string") {
    return { content: data };
  }
  return null;
}
