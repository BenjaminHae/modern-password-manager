import React from 'react';
import Mousetrap, { ExtendedKeyboardEvent, MousetrapInstance } from 'mousetrap';


export interface ShortcutEntry {
  shortcut: string,
  action: (e: ExtendedKeyboardEvent) => void,
  description: string,
  component: React.Component 
}

export default class ShortcutManager {
  private shortcuts: Array<ShortcutEntry>;
  private mousetrap: MousetrapInstance;
  
  constructor() {
    this.mousetrap = new Mousetrap();
    this.shortcuts = [];
    const originalStopCallback = this.mousetrap.stopCallback;
    this.mousetrap.stopCallback = function(e, element, combo) {
      if (combo === "esc")
        return false;
      return originalStopCallback(e, element, combo);
    }
  }

  addShortcut(entry: ShortcutEntry) {
    this.mousetrap.bind(entry.shortcut, entry.action);
    this.shortcuts.push(entry);
  }

  removeShortcut(shortcut: string): void {
    const index = this.shortcuts.findIndex((element) => element.shortcut === shortcut);
    if (index > -1) {
      this.mousetrap.unbind(shortcut);
      this.shortcuts.splice(index, 1);
    }
  }

  removeAllShortcuts(): void {
    for (let item of this.shortcuts) {
      this.mousetrap.unbind(item.shortcut);
    }
    this.shortcuts.length = 0;
  }

  removeByComponent(component: React.Component): void {
    for (let item of this.shortcuts.filter((element) => element.component === component)) {
      this.mousetrap.unbind(item.shortcut);
    }
    this.shortcuts = this.shortcuts.filter((element) => element.component !== component);
  }
}
