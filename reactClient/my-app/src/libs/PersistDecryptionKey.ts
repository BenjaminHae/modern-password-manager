import { IDecryptionKeys } from '../backend/controller/credentialProviderPersist';

export default class PersistDecryptionKey {
  readonly storageDbName = "localDecryptionKey";
  readonly storageDbVersion = 3;
  readonly storageKeysName = "keys";
  readonly storageKeysCredentialIndex = "credentialId";
  readonly storageKeysUserIndex = "displayName";

  private db?: IDBDatabase;

  private initStorage(): Promise<void> {
    return new Promise<void>((resolve_db, reject_db) => {
      var request = window.indexedDB.open(this.storageDbName, this.storageDbVersion);
      request.onerror = () => reject_db();
      request.onsuccess = (event: any) => {
        if (event && event.target && "result" in event.target && event.target.result) {
          this.db = event.target.result;
          resolve_db();
        }
        else {
          reject_db();
        }
      };
      request.onupgradeneeded = (event: any) => {
        if (event && event.target && event.target.result) {
          console.log(`Database upgrade needed: ${event.oldVersion} to ${event.newVersion}`);
          const db = event.target.result;
          const upgradeTransaction = event.target.transaction;
          let objectStore: IDBObjectStore;
          if (!db.objectStoreNames.contains(this.storageKeysName)) {
            console.log(`Creating object store: ${this.storageKeysName}`);
            objectStore = db.createObjectStore(this.storageKeysName, { autoIncrement: true });
          }
          else {
            objectStore = upgradeTransaction.objectStore(this.storageKeysName);
          }
          if (!objectStore.indexNames.contains(this.storageKeysCredentialIndex)) {
            console.log(`Creating index: ${this.storageKeysCredentialIndex}`);
            objectStore.createIndex(this.storageKeysCredentialIndex, "credentialIdString", {unique: true});
          }
          if (!objectStore.indexNames.contains(this.storageKeysUserIndex)) {
            console.log(`Creating index: ${this.storageKeysUserIndex}`);
            objectStore.createIndex(this.storageKeysUserIndex, "displayName", {unique: true});
          }
        }
      };
    })
  }

  async storeKeys(decryptionKeys: IDecryptionKeys): Promise<number> {
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

  async indexByCredentialId(credentialId: string): Promise<undefined|number> {
    if (!this.db) {
      await this.initStorage();
    }
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject();
        return;
      }
      const transaction = this.db.transaction([this.storageKeysName], "readonly");
      transaction.oncomplete = () => {};
      transaction.onerror = () => reject("indexdb transaction failed");
      const objectStore = transaction.objectStore(this.storageKeysName);
      const index = objectStore.index(this.storageKeysCredentialIndex);
      const request = index.getKey(credentialId);
      request.onerror = (e) => resolve();
      request.onsuccess = () => resolve(request.result as number);
    });
  }

  async loadKeys(id: number): Promise<IDecryptionKeys> {
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
      request.onerror = (e) => reject(e);
      request.onsuccess = () => resolve(request.result as IDecryptionKeys);
    });
  }

  async appendCredentialId(keyId: number, credentialId: ArrayBuffer, credentialIdString: string, displayName: string): Promise<void> {
    //attention: this does not update the current key!
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
      const objectStore = transaction.objectStore(this.storageKeysName);
      const request = objectStore.get(keyId);
      request.onerror = (e) => reject(e);
      request.onsuccess = () => {
        let keys = request.result;
        keys.credentialId = credentialId;
        keys.credentialIdString = credentialIdString;
        keys.displayName = displayName;
        const updateRequest = objectStore.put(keys);
        updateRequest.onsuccess = () => resolve();
        updateRequest.onerror = (e) => reject(e);
      }
    });
  }

  async getCredentialIds(): Promise<Array<ArrayBuffer>> {
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
      let request = objectStore.getAll();
      request.onerror = (e) => reject(e);
      request.onsuccess = () => {
        const keysWithId = request.result.filter(o => o.hasOwnProperty('credentialId'));
        resolve(keysWithId.map(k => k.credentialId));
      }
    });
  }

}
