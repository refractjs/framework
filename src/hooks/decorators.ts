import { createHookDecorator } from "./hooks";

export const PluginRegister = createHookDecorator("plugin:register");
export const PluginUnregister = createHookDecorator("plugin:unregister");
export const PluginLoad = createHookDecorator("plugin:load");
export const PluginUnload = createHookDecorator("plugin:unload");
