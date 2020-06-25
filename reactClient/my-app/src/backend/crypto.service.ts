import { CredentialService } from './credential.service';
import { CredentialProvider } from './controller/credentialProvider';
import { CryptedObject } from './models/cryptedObject';

export class CryptoService {

  constructor(private credentials: CredentialService) {
  }

  setCredentials(credentials: CredentialService) {
    this.credentials = credentials;
  }

  async decryptChar(crypt: CryptedObject, credentials: ICredentialProvider=this.credentials.credentialProvider): Promise<string> {
    let key = credentials.getKey()
    if (!key) {
      throw new Error("key is not defined")
    }
    let plaintext = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: crypt.iv,
      },
      key,
      crypt.ciphertext
    )
    return this.ab2str(plaintext);
  }

  async encryptChar(plaintext: string, iv = window.crypto.getRandomValues(new Uint8Array(12)), credentials: ICredentialProvider=this.credentials.credentialProvider): Promise<CryptedObject> {
    let key = credentials.getKey()
    if (!key) {
      throw new Error("key is not defined")
    }
    let ciphertext = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      this.str2ab(plaintext)
    )
    return new CryptedObject(iv, new Uint8Array(ciphertext));
  }


  private ab2str(buf: ArrayBuffer): string{
    return String.fromCharCode(...(new Uint16Array(buf)));
  }
  private str2ab(str: string): ArrayBuffer{
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return buf;
  }
}
