import { ICredentialProvider } from './credentialProvider';
import { CredentialProviderPassword } from './credentialProviderPassword';
//todo make ciphers configurable

interface IDecryptionKeys {
  localKey: CryptoKey;
  wrappedKey: ArrayBuffer;
}
interface IPersistingResult {
  wrappedServerKey: ArrayBuffer;
  keyIndex: number;
}
export class CredentialProviderPersist extends CredentialProviderPassword implements ICredentialProvider {
  private serverKey?: CryptoKey;
  private localKey?: CryptoKey;
  private db?: IDBDatabase;

  readonly wrapKeyAlgorithm = { name: "AES-GCM", length: 256}
  readonly storageDbName = "localDecryptionKey";
  readonly storageDbVersion = 1;
  readonly storageKeysName ="keys";

  async generateFromPassword(password: string): Promise<CryptoKey> {
    let key = this.generateFromPasswordWithExtractable(password, true);
    this.preparePersistingKeys();
    return key;
  }

  async generateFromStoredKeys(encryptedServerKey: ArrayBuffer, keyId: number): Promise<CryptoKey> {
    let keys = await this.loadKeys(keyId);
    let serverKey = await window.crypto.subtle.unwrapKey(
      "raw",
      encryptedServerKey,
      keys.localKey,
      this.wrapKeyAlgorithm,
      this.wrapKeyAlgorithm,
      false,
      ["wrapKey", "unwrapKey"]
    ) as CryptoKey;
    this.key = await window.crypto.subtle.unwrapKey(
      "raw",
      keys.wrappedKey,
      serverKey,
      this.wrapKeyAlgorithm,
      this.keyAlgorithm,
      false,
      this.keyUsage
    ) as CryptoKey;
    return this.key;
  }

  private async preparePersistingKeys() {
    this.localKey = await window.crypto.subtle.generateKey(
      this.wrapKeyAlgorithm,
      false, // not extractable
      ["wrapKey", "unwrapKey"]
    ) as CryptoKey;

    this.serverKey = await window.crypto.subtle.generateKey(
      this.wrapKeyAlgorithm,
      true, // extractable, for storing on the server after wrapping with localKey
      ["wrapKey", "unwrapKey"]
    ) as CryptoKey;
  }

  private initStorage(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      var request = window.indexedDB.open(this.storageDbName, this.storageDbVersion);
      request.onerror = () => reject();
      request.onsuccess = (event: any) => {
        if (event && event.target && "result" in event.target && event.target.result) {
          this.db = event.target.result;
          resolve();
        }
        else {
          reject();
        }
      };
      request.onupgradeneeded = (event: any) => {
        if (event && event.target && event.target.result) {
          let db = event.target.result;
          let objectStore = db.createObjectStore(this.storageKeysName, { autoIncrement: true });
          objectStore.transaction.oncomplete = () => {
            this.db = db;
            resolve();
          };
        }
      };
    })
  }

  private async storeKeys(decryptionKeys: IDecryptionKeys): Promise<number> {
    if (!this.db) {
      await this.initStorage();
    }
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject();
        return;
      }
      let transaction = this.db.transaction([this.storageKeysName], "readwrite");
      transaction.oncomplete = () => {};
      transaction.onerror = () => reject();
      let objectStore = transaction.objectStore(this.storageKeysName);
      let request = objectStore.add(decryptionKeys);
      request.onsuccess = (event: any) => resolve(event.target.result);
    });
  }

  async removeKeys(id: number): Promise<void> {
    if (!this.db) {
      await this.initStorage();
    }
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject();
        return;
      }
      let transaction = this.db.transaction([this.storageKeysName], "readwrite");
      transaction.oncomplete = () => {};
      transaction.onerror = () => reject();
      let objectStore = transaction.objectStore(this.storageKeysName);
      let request = objectStore.delete(id);
      request.onsuccess = () => resolve();
    });
  }

  private async loadKeys(id: number): Promise<IDecryptionKeys> {
    if (!this.db) {
      await this.initStorage();
    }
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject();
        return;
      }
      let transaction = this.db.transaction([this.storageKeysName], "readonly");
      transaction.oncomplete = () => {};
      transaction.onerror = () => reject();
      let objectStore = transaction.objectStore(this.storageKeysName);
      let request = objectStore.get(id);
      request.onerror = () => reject();
      request.onsuccess = () => resolve(request.result as IDecryptionKeys);
    });
  }

  async persistKey(): Promise<IPersistingResult> {
    if (!this.key || !this.localKey || !this.serverKey) {
      throw new Error("no key present");
    }
    let encryptedKeyToStore = await window.crypto.subtle.wrapKey(
      "raw",
      this.key,
      this.serverKey,
      { name: "AES-GCM", iv: window.crypto.getRandomValues(new Uint8Array(12))}
      );
    let encryptedServerWrapKey = await window.crypto.subtle.wrapKey(
      "raw",
      this.serverKey,
      this.localKey,
      { name: "AES-GCM", iv: window.crypto.getRandomValues(new Uint8Array(12))}
      );
    let keyId = await this.storeKeys({ localKey: this.localKey, wrappedKey: encryptedKeyToStore });
    await this.cleanUp();
    return { wrappedServerKey: encryptedServerWrapKey, keyIndex: keyId} ;
  }

  getKey(): CryptoKey{
    if (!this.key) {
      throw new Error("no key present");
    }
    return this.key;
  }

  cleanUp(): Promise<void> {
    this.localKey = undefined;
    this.serverKey = undefined;
    return super.cleanUp();
  }
}
