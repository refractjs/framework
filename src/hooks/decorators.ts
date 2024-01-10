import { Constants } from "../constants";
import { createHookDecorator } from "./hooks";

export const PluginRegister = createHookDecorator(
  Constants.Hooks.PluginRegister
);
export const PluginUnregister = createHookDecorator(
  Constants.Hooks.PluginUnregister
);
export const PluginLoad = createHookDecorator(Constants.Hooks.PluginLoad);
export const PluginUnload = createHookDecorator(Constants.Hooks.PluginUnload);
