import { exists } from './JSONHelper';

export interface FieldOptions {
    name: string;
    selector: string;
    visible: boolean;
    colNumber?: number;
    sortable?: boolean;
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
    'name': json['name'],
    'selector': json['selector'],
    'visible': json['visible'],
    'colNumber': !exists(json, 'colNumber') ? undefined : json['colNumber'],
    'sortable': !exists(json, 'sortable') ? undefined : json['sortable'],
  };
}
