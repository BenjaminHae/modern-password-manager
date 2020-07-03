import { PluginSystem } from './PluginSystem';
import { BasePlugin } from './BasePlugin';
import { TagsPlugin } from './TagsPlugin/Tags';
import { CopyPlugin } from './CopyPlugin/Copy';

export const ActivatedPlugins:Array<new (pluginSystem: PluginSystem) => BasePlugin> = [TagsPlugin, CopyPlugin];
