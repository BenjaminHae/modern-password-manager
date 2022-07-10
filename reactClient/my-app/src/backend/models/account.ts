import { CryptedObject } from './cryptedObject';

export class Account {
    public index: number;
    public name: string;
    public enpassword: CryptedObject;
    public other: {[index: string]:string};
    public file: any;

    constructor(index: number, name: string, enpassword: CryptedObject) {
        this.index = index;
        this.name = name;
        this.enpassword = enpassword;
        this.other = {};
        this.file = null;
    }

    clearOther(): void {
        this.other = {};
    }
    clearVisibleOther(): void {
        for (const item in this.other) {
            if (item.substring(0,1) !== "_") {
                delete this.other[item];
            }
        }
    }
    get availableOthers(): Array<string> {
        const availableOthers = [];
        for (const otherName in this.other) {
            availableOthers.push(otherName);
        }
        return availableOthers;
    }
    getOtherJSON(): string {
        return JSON.stringify(this.other);
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    addEncryptedFile(name: string, fkey: any): void {
        this.file = { "name":"", "key": fkey };
        //return self.encryptionWrapper.decryptChar(name)
        //    .then(function(decryptedName) {
        //        self.file.name = decryptedName;
        //        return self.file;
        //    });
    }
    hasFile(): boolean {
        return 'file' in this;
    }
}
