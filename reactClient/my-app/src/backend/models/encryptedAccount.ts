import { CryptedObject } from './cryptedObject';
export class encryptedAccount {
    index: number;
    name: CryptedObject;
    password: CryptedObject;
    other: CryptedObject;

    constructor(index: number, name: CryptedObject, password: CryptedObject, other: CryptedObject) {
        this.index = index;
        this.name = name;
        this.password = password;
        this.other = other;
    }
}
