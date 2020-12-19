import { exists } from './JSONHelper';

export interface FieldOptions {
    name: string;
    selector: string;
    visible: boolean;
    hint?: string;
    colNumber?: number;
    sortable?: boolean;
    hideInTable?: 'sm' | 'md' | 'lg' | number;
}

export function FieldOptionsFromJSON(json: any): FieldOptions {
  if ((json === undefined) || (json === null)) {
    return json;
  }
  const required = ["name", "selector", "visible"];
  for (const item of required) {
    if (!exists(json, item)) {
      throw new Error(`required key "${item}" is not present in field`);
    }
  }
  
  
  return {
    name: json['name'],
    selector: json['selector'],
    visible: json['visible'],
    hint: !exists(json, 'hint') ? undefined : json['hint'],
    colNumber: !exists(json, 'colNumber') ? undefined : json['colNumber'],
    sortable: !exists(json, 'sortable') ? undefined : json['sortable'],
    hideInTable: !exists(json, 'hideInTable') ? undefined : json['hideInTable'],
  };
}
