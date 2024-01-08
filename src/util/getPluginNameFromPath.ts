import { sep } from "path";

const regex = new RegExp(`plugins${sep}(.+?)${sep}`);

export function getPluginNameFromPath(path: string): string {
  const match = regex.exec(path);
  if (match) {
    return match[1] ?? "";
  }
  return "";
}
