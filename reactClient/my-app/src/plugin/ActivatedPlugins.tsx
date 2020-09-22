import { PluginSystem } from './PluginSystem';
import { BasePlugin } from './BasePlugin';
import { TagsPlugin } from './TagsPlugin/Tags';
import { CopyPlugin } from './CopyPlugin/Copy';
import { SearchPlugin } from './SearchPlugin/Search';
import BrowserExtensionPlugin from './BrowserExtensionPlugin/BrowserExtensionPlugin';

function activatedPlugins(): Array<new (pluginSystem: PluginSystem) => BasePlugin> { 
  let plugins: Array<new (pluginSystem: PluginSystem) => BasePlugin> = [TagsPlugin, CopyPlugin, SearchPlugin];
  if (process.env.ALLOW_BROWSER_EXTENSION === "true") {
    plugins.push(BrowserExtensionPlugin);
  }
  return plugins;
}

export default activatedPlugins;
