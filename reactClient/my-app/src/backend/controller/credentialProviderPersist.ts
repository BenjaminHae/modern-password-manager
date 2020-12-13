import { ICredentialProvider } from './credentialProvider';
import { CredentialProviderPassword } from './credentialProviderPassword';
//todo make ciphers configurable
//todo create helper class for db

export interface IDecryptionKeys {
  localKey: CryptoKey;
  wrappedKey: ArrayBuffer;
  ivWrappedServerKey: ArrayBuffer;
  ivWrappedKey: ArrayBuffer;
  displayName?: string;
  credentialId?: ArrayBuffer;
  credentialIdString?: string;
}
interface IPersistingResult {
  wrappedServerKey: ArrayBuffer;
  keyIndex: number;
}
export interface IPersistingMechanism {
  storeKeys(decryptionKeys: IDecryptionKeys): Promise<number>;
  loadKeys(id: number): Promise<IDecryptionKeys>;
}
export default class CredentialProviderPersist extends CredentialProviderPassword implements ICredentialProvider {
  private serverKey?: CryptoKey;
  private localKey?: CryptoKey;

  readonly wrapKeyAlgorithm = { name: "AES-GCM", length: 256}

  constructor(private persistor: IPersistingMechanism) {
    super();
  }

  async generateFromPassword(password: string): Promise<CryptoKey> {
    const key = await this.generateFromPasswordWithExtractable(password, true);
    await this.preparePersistingKeys();
    return key;
  }

  async generateFromStoredKeys(encryptedServerKey: ArrayBuffer, keyId: number): Promise<CryptoKey> {
    const keys = await this.persistor.loadKeys(keyId);
    const serverKeyParams = { ...this.wrapKeyAlgorithm, iv: keys.ivWrappedServerKey};
    const keyParams = { ...this.wrapKeyAlgorithm, iv: keys.ivWrappedKey};
    keyParams["iv"] = keys.ivWrappedKey;
    const serverKey = await window.crypto.subtle.unwrapKey(
      "raw",
      encryptedServerKey,
      keys.localKey,
      serverKeyParams,
      this.wrapKeyAlgorithm,
      false,
      ["wrapKey", "unwrapKey"]
    ) as CryptoKey;
    this.key = await window.crypto.subtle.unwrapKey(
      "raw",
      keys.wrappedKey,
      serverKey,
      keyParams,
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

  async persistKey(): Promise<IPersistingResult> {
    if (!this.key || !this.localKey || !this.serverKey) {
      throw new Error("no key present");
    }
    const ivWrappedKey = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedKeyToStore = await window.crypto.subtle.wrapKey(
      "raw",
      this.key,
      this.serverKey,
      { name: "AES-GCM", iv: ivWrappedKey}
      );
    const ivWrappedServerKey = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedServerWrapKey = await window.crypto.subtle.wrapKey(
      "raw",
      this.serverKey,
      this.localKey,
      { name: "AES-GCM", iv: ivWrappedServerKey}
      );
    const keyId = await this.persistor.storeKeys({ localKey: this.localKey, wrappedKey: encryptedKeyToStore, ivWrappedKey: ivWrappedKey, ivWrappedServerKey: ivWrappedServerKey });
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
