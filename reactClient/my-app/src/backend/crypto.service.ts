import { CredentialService } from './credential.service';
import { ICredentialProvider } from './controller/credentialProvider';
import { CryptedObject } from './models/cryptedObject';

const PADDING_SIZE = 64;

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
    return this.ab2str(this.removePadding(plaintext));
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
      this.addPadding(this.str2ab(plaintext), PADDING_SIZE)
    )
    return new CryptedObject(iv, new Uint8Array(ciphertext));
  }


  private ab2str(buf: ArrayBuffer): string{
    return String.fromCharCode(...(new Uint16Array(buf)));
  }

  private str2ab(str: string): ArrayBuffer {
    var bufView = new Uint16Array(str.length);
    for (var i=0, strLen=str.length; i < strLen; i++) {
      bufView[i] = str.charCodeAt(i);
    }
    return bufView.buffer;
  }

  private addPadding(buf: ArrayBuffer, length: number): ArrayBuffer {
    let bufLength = buf.byteLength/2;
    let padLength = Math.max(3, length - bufLength);
    let paddingBytes = new Uint16Array(padLength);
    paddingBytes[1] = 1;
    let paddedBuffer = new Uint16Array(bufLength + padLength);
    paddedBuffer.set(new Uint16Array(buf), 0);
    paddedBuffer.set(paddingBytes, bufLength);
    return paddedBuffer.buffer;
  }

  private removePadding(buf: ArrayBuffer): ArrayBuffer {
    function findPaddingStart(buf: Uint16Array): number {
      let lastOne = buf.lastIndexOf(1);
      console.log(lastOne);
      if (lastOne === 0) {
        return buf.length + 1;
      }
      if (lastOne === buf.length - 1) {
        return buf.length + 1
      }
      if (buf[lastOne - 1] !== 0) {
        return buf.length + 1
      }
      if (buf[lastOne + 1] !== 0) {
        return buf.length + 1
      }
      return lastOne - 1;
    }
    let length = findPaddingStart(new Uint16Array(buf));
    return buf.slice(0,2*length);
  }
}
