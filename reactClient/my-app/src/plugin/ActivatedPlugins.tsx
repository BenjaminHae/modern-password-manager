import { PluginSystem } from './PluginSystem';
import { BasePlugin } from './BasePlugin';
import { TagsPlugin } from './TagsPlugin/Tags';

export const ActivatedPlugins:Array<new (pluginSystem: PluginSystem) => BasePlugin> = [TagsPlugin];
