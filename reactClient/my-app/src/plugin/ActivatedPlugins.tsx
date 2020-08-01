import { PluginSystem } from './PluginSystem';
import { BasePlugin } from './BasePlugin';
import { TagsPlugin } from './TagsPlugin/Tags';
import { CopyPlugin } from './CopyPlugin/Copy';
import { SearchPlugin } from './SearchPlugin/Search';

export const ActivatedPlugins:Array<new (pluginSystem: PluginSystem) => BasePlugin> = [TagsPlugin, CopyPlugin, SearchPlugin];
