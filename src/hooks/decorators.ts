import { Constants } from "../constants";
import { createHookDecorator } from "./hooks";

export const PluginRegister = createHookDecorator(
  Constants.Hooks.PluginRegister,
);
export const PluginUnregister = createHookDecorator(
  Constants.Hooks.PluginUnregister,
);
export const PluginLoad = createHookDecorator(Constants.Hooks.PluginLoad);
export const PluginUnload = createHookDecorator(Constants.Hooks.PluginUnload);

export const PiecePreLoad = createHookDecorator(Constants.Hooks.PiecePreLoad);
export const PieceLoad = createHookDecorator(Constants.Hooks.PieceLoad);
export const PieceUnload = createHookDecorator(Constants.Hooks.PieceUnload);
