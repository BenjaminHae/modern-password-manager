import { IDecryptionKeys } from '../backend/controller/credentialProviderPersist';

export default class PersistDecryptionKey {
  readonly storageDbName = "localDecryptionKey";
  readonly storageDbVersion = 2;
  readonly storageKeysName ="keys";

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
          const db = event.target.result;
          const oldVersion = event.oldVersion;
          let upgradePromise = Promise.resolve();
          if (oldVersion < 1) {
            let objectStore = db.createObjectStore(this.storageKeysName, { autoIncrement: true });
            upgradePromise = upgradePromise.then(() => new Promise((resolve, reject) => {
              objectStore.transaction.oncomplete = () => {
                this.db = db;
                resolve();
              };
              }));
          }
          if (oldVersion < 2) {
            upgradePromise = upgradePromise.then(() => new Promise((resolve, reject) => {
              let transaction = db.transaction([this.storageKeysName], "readwrite");
              transaction.oncomplete = () => { resolve() };
              transaction.onerror = () => reject();
              let objectStore = transaction.objectStore(this.storageKeysName);
              objectStore.createIndex("displayName", "displayName", {unique: true});
              objectStore.createIndex("credentialId", "credentialIdString", {unique: true});
            }));
          }
          upgradePromise.then(()=> {
            resolve_db();
          })
          .catch(()=> { reject_db() });
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
      transaction.onerror = () => reject();
      const objectStore = transaction.objectStore(this.storageKeysName);
      const index = objectStore.index("credentialId");
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
