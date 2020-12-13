import { ICredentialProvider } from './credentialProvider';
//todo make ciphers configurable

export class CredentialProviderPassword implements ICredentialProvider {
  protected key?: CryptoKey;

  readonly keyAlgorithm = { name: "AES-GCM", length: 256}
  readonly keyUsage: Array<KeyUsage> = ["encrypt","decrypt", "wrapKey", "unwrapKey"]

  async generateFromPassword(password: string): Promise<CryptoKey>{
    return this.generateFromPasswordWithExtractable(password, false);
  }

  protected async generateFromPasswordWithExtractable(password: string, extractable = false): Promise<CryptoKey>{
    const enc = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        {
          "name": "PBKDF2",
          //the next lines are a trick to get the typescript compiler to accept the type :/
          "generator": new Uint8Array(12),
          "prime": new Uint8Array(12),
        },
        false,
        ["deriveBits", "deriveKey"]
        )
    const key = await window.crypto.subtle.deriveKey(
            {"name": "PBKDF2", salt:new ArrayBuffer(0), "iterations": 100000, "hash": "SHA-256" },
            keyMaterial,
            this.keyAlgorithm,
            extractable,
            this.keyUsage
            )
    this.key = key;
    return key;
  }

  getKey(): CryptoKey{
    if (!this.key) {
      throw new Error("no key present");
    }
    return this.key;
  }

  cleanUp(): Promise<void>{
    this.key = undefined;
    return Promise.resolve();
  }
}
