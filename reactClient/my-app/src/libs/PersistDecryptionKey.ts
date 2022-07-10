import { IDecryptionKeys } from '../backend/controller/credentialProviderPersist';

export interface IKeyInfo {
  id: number;
  displayName: string;
  lastUsed?: Date;
}

export default class PersistDecryptionKey {
  readonly storageDbName = "localDecryptionKey";
  readonly storageDbVersion = 3;
  readonly storageKeysName = "keys";
  readonly storageKeysCredentialIndex = "credentialId";
  readonly storageKeysUserIndex = "displayName";

  private db?: IDBDatabase;

  private initStorage(): Promise<void> {
    return new Promise<void>((resolve_db, reject_db) => {
      const request = window.indexedDB.open(this.storageDbName, this.storageDbVersion);
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

  async activatePersistence(): Promise<void> {
    if (navigator.storage && navigator.storage.persist && !await navigator.storage.persisted()) {
      await navigator.storage.persist();
    }
  }

  async storeKeys(decryptionKeys: IDecryptionKeys): Promise<number> {
    if (!this.db) {
      await this.initStorage();
    }
    await this.activatePersistence();
    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject();
        return;
      }
      const transaction = this.db.transaction([this.storageKeysName], "readwrite");
      transaction.onerror = () => reject();
      const objectStore = transaction.objectStore(this.storageKeysName);
      const request = objectStore.add(decryptionKeys);
      request.onsuccess = (event: any) => resolve(event.target.result);
    });
  }

  async removeKeys(id: number): Promise<void> {
    if (!this.db) {
      await this.initStorage();
    }
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject();
        return;
      }
      const transaction = this.db.transaction([this.storageKeysName], "readwrite");
      transaction.onerror = () => reject();
      const objectStore = transaction.objectStore(this.storageKeysName);
      const request = objectStore.delete(id);
      request.onsuccess = () => resolve();
    });
  }

  async indexByCredentialId(credentialId: string): Promise<void|number> {
    if (!this.db) {
      await this.initStorage();
    }
    return new Promise<void|number>((resolve, reject) => {
      if (!this.db) {
        reject();
        return;
      }
      const transaction = this.db.transaction([this.storageKeysName], "readonly");
      transaction.onerror = () => reject("indexdb transaction failed");
      const objectStore = transaction.objectStore(this.storageKeysName);
      const index = objectStore.index(this.storageKeysCredentialIndex);
      const request = index.getKey(credentialId);
      request.onerror = () => resolve();
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
      const transaction = this.db.transaction([this.storageKeysName], "readonly");
      transaction.onerror = () => reject();
      const objectStore = transaction.objectStore(this.storageKeysName);
      const request = objectStore.get(id);
      request.onerror = (e) => reject(e);
      request.onsuccess = () => resolve(request.result as IDecryptionKeys);
    });
  }

  async appendCredentialId(keyId: number, credentialId: ArrayBuffer, credentialIdString: string, displayName: string): Promise<void> {
    //attention: this does not update the current key!
    if (!this.db) {
      await this.initStorage();
    }
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject();
        return;
      }
      const transaction = this.db.transaction([this.storageKeysName], "readwrite");
      transaction.onerror = () => reject();
      const objectStore = transaction.objectStore(this.storageKeysName);
      objectStore.openCursor(keyId).onsuccess = (event: any) => {
        const cursor: IDBCursorWithValue = event.target.result;
        if (cursor) {
          const data = cursor.value;
          data.credentialId = credentialId;
          data.credentialIdString = credentialIdString;
          data.displayName = displayName;
          const updateRequest = cursor.update(data);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = (e) => reject(e);
        }
      };
    });
  }

  async getCredentialIds(): Promise<Array<ArrayBuffer>> {
    if (!this.db) {
      await this.initStorage();
    }
    return new Promise<Array<ArrayBuffer>>((resolve, reject) => {
      if (!this.db) {
        reject();
        return;
      }
      const transaction = this.db.transaction([this.storageKeysName], "readonly");
      transaction.onerror = () => reject();
      const objectStore = transaction.objectStore(this.storageKeysName);
      const request = objectStore.getAll();
      request.onerror = (e) => reject(e);
      request.onsuccess = () => {
        const keysWithId = request.result.filter(o => Object.prototype.hasOwnProperty.call(o, 'credentialId'));
        resolve(keysWithId.map(k => k.credentialId));
      }
    });
  }

  async clearAll(): Promise<void> {
    if (!this.db) {
      await this.initStorage();
    }
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject();
        return;
      }
      const transaction = this.db.transaction([this.storageKeysName], "readwrite");
      transaction.onerror = () => reject();
      const objectStore = transaction.objectStore(this.storageKeysName);
      const request = objectStore.clear();
      request.onsuccess = () => resolve();
    });
  }

  async getKeyList(): Promise<Array<IKeyInfo>> {
    if (!this.db) {
      await this.initStorage();
    }
    return new Promise<Array<IKeyInfo>>((resolve, reject) => {
      if (!this.db) {
        reject();
        return;
      }
      const transaction = this.db.transaction([this.storageKeysName], "readonly");
      transaction.onerror = () => reject("indexdb transaction failed");
      const objectStore = transaction.objectStore(this.storageKeysName);
      const index = objectStore.index(this.storageKeysCredentialIndex);

      const result: Array<IKeyInfo> = [];
      index.openCursor().onsuccess = (event: any) => {
        const cursor: IDBCursorWithValue = event.target.result;
        if (cursor) {
          const data = cursor.value;
          result.push({ id: cursor.primaryKey as number, displayName: data.displayName, lastUsed: data.lastUsed});
          cursor.continue();
        } else {
          resolve(result);
        }
      };
      index.openCursor().onerror = () => resolve([]);
    });
  }

  async setLastUsed(keyId: number, lastUsed: Date): Promise<void> {
    if (!this.db) {
      await this.initStorage();
    }
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject();
        return;
      }
      const transaction = this.db.transaction([this.storageKeysName], "readwrite");
      transaction.onerror = () => reject();
      const objectStore = transaction.objectStore(this.storageKeysName);
      objectStore.openCursor(keyId).onsuccess = (event: any) => {
        const cursor: IDBCursorWithValue = event.target.result;
        if (cursor) {
          const data = cursor.value;
          data.lastUsed = lastUsed;
          const updateRequest = cursor.update(data);
          updateRequest.onsuccess = () => resolve();
          updateRequest.onerror = (e) => reject(e);
        }
      };
    });
  }
}
