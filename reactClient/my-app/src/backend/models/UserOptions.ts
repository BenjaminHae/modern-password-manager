import { exists } from './JSONHelper';
import { FieldOptions, FieldOptionsFromJSON } from './fieldOptions';
export interface UserOptions {
  fields: Array<FieldOptions>;
}

export function UserOptionsFromJSON(json: any, defaultValues: UserOptions = {fields:[]}): UserOptions {
  if ((json === undefined) || (json === null)) {
    return json;
  }
  return {
    'fields': !exists(json, 'fields') ? defaultValues.fields : json['fields'].map((field: any) => FieldOptionsFromJSON(field)),
  };
}
