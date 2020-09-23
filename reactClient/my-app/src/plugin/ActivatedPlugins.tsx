import { PluginSystem } from './PluginSystem';
import { BasePlugin } from './BasePlugin';
import { TagsPlugin } from './TagsPlugin/Tags';
import { CopyPlugin } from './CopyPlugin/Copy';
import { SearchPlugin } from './SearchPlugin/Search';
import BrowserExtensionPlugin from './BrowserExtensionPlugin/BrowserExtensionPlugin';
import OpenURLPlugin from './OpenURLPlugin/Open';

function activatedPlugins(): Array<new (pluginSystem: PluginSystem) => BasePlugin> { 
  const plugins: Array<new (pluginSystem: PluginSystem) => BasePlugin> = [TagsPlugin, CopyPlugin, SearchPlugin, OpenURLPlugin];
  if (process.env.REACT_APP_ALLOW_BROWSER_EXTENSION === "true") {
    plugins.push(BrowserExtensionPlugin);
  }
  return plugins;
}

export default activatedPlugins;
