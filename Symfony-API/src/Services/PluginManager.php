<?php
namespace App\Services;

class PluginManager
{
    private $plugins;
    public function __construct(iterable $plugins)
    {
        $this->plugins = $plugins;
    }

    public function pluginActionByParameter($action, $parameters) 
    {
        $results = array();
        foreach($this->plugins as $plugin) 
        {
            if (method_exists($plugin, $action))
            {
                array_push($results, $plugin->$action($parameters));
            }
        }
        return $results;
    }

    public function pluginActionPropagateParameter($action, $parameters)
    {
        foreach($this->plugins as $plugin) 
        {
            if (method_exists($plugin, $action))
            {
                $parameters = $plugin->$action($parameters);
            }
        }
        return $parameters;
    }
}
