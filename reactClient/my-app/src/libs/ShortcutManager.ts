import React from 'react';
import Mousetrap, { ExtendedKeyboardEvent }from 'mousetrap';


export interface ShortcutEntry {
  shortcut: string,
  action: (e: ExtendedKeyboardEvent) => void,
  description: string,
  component: React.Component 
}

export default class ShortcutManager {
  private shortcuts: Array<ShortcutEntry>;
  
  constructor() {
    this.shortcuts = [];
  }

  addShortcut(entry: ShortcutEntry) {
    Mousetrap.bind(entry.shortcut, entry.action);
    this.shortcuts.push(entry);
  }

  removeShortcut(shortcut: string): void {
    const index = this.shortcuts.findIndex((element) => element.shortcut === shortcut);
    if (index > -1) {
      Mousetrap.unbind(shortcut);
      this.shortcuts.splice(index, 1);
    }
  }

  removeAllShortcuts(): void {
    for (let item of this.shortcuts) {
      Mousetrap.unbind(item.shortcut);
    }
    this.shortcuts.length = 0;
  }

  removeByComponent(component: React.Component): void {
    for (let item of this.shortcuts.filter((element) => element.component === component)) {
      Mousetrap.unbind(item.shortcut);
    }
    this.shortcuts = this.shortcuts.filter((element) => element.component !== component);
  }
}
