export class CsvConverter {
  private data: {[index: string]:string} = {};
  public availableFields: Array<string> = [];
  private headerMapping: Map<string, string | null> = new Map<string, string | null>();

  getHeaderMappings(): Map<string, string | null> {
    return this.headerMapping;
  }

  getKeyMappedTo(findValue: string): string | null {
    let keyFound: string = "";
    let found: boolean = false;
    this.headerMapping.forEach((value, key) => {
      if (findValue === value) {
        keyFound = key;
        found = true;
      }
    });
    if (!found) {
      return null;
    }
    return keyFound;
  }

  setHeaderMapping(csvName: string, internalName: string|null): boolean {
    let duplicates = false;
    this.headerMapping.forEach((value, key) => {
        if (value) {
          if (value === internalName) {
            duplicates = true;
          }
        }
      });
    if (duplicates) {
        console.log("duplicate: "+ csvName + " -> " + internalName);
        return false;
    }
    this.headerMapping.set(csvName, internalName);
    return true;
  }

  autoHeaderMapping(headers: Array<string>): void {
    let toMap = ["name", "password"];
    if (this.availableFields) {
      toMap = toMap.concat(this.availableFields);
    }
    for (let item of headers) {
      if (toMap.includes(item)) {
        this.setHeaderMapping(item, item);
      }
      else {
        this.setHeaderMapping(item, null);
      }
    }
  }

  createAccountFromData(data: {[index: string]:string}): {[index: string]:string} {
    let fields: {[index: string]:string} = {};
    let mappedTo = this.getKeyMappedTo("password");
    if (!mappedTo) {
      throw new Error("Password not selected");
    }
    fields["password"] = data[mappedTo];
    mappedTo = this.getKeyMappedTo("username");
    if (!mappedTo) {
      throw new Error("Username not selected");
    }
    fields["username"] = data[mappedTo];
    for (let item in this.availableFields) {
      let key = this.getKeyMappedTo(item);
      if (key) {
        fields[item] = data[key];
      }
    }
    return fields;
  }

  createAccounts(data: Array<{[index: string]:string}>): Array<{[index: string]:string}> {
    return data.map((row: {[index: string]:string}) => {
      return this.createAccountFromData(row);
    });
  }
}
