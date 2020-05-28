export class CryptedObject {
  iv: ArrayBuffer;
  ciphertext: ArrayBuffer;
  constructor(iv: ArrayBuffer, ciphertext: ArrayBuffer) {
    this.iv = iv;
    this.ciphertext = ciphertext;
  }
  static fromBase64JSON(encodedObject: string): CryptedObject {
    let encObject = JSON.parse(encodedObject);
    return new CryptedObject(CryptedObject._base64ToArrayBuffer(encObject.iv), CryptedObject._base64ToArrayBuffer(encObject.ciphertext));
  }
  toBase64JSON(): string {
    return JSON.stringify({"iv": CryptedObject._BufferToBase64(this.iv), "ciphertext": CryptedObject._BufferToBase64(this.ciphertext)});
  }
  static _BufferToBase64(buffer: ArrayBuffer): string {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa(binary);
  }
  static _base64ToArrayBuffer(base64: string): ArrayBuffer {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
   return bytes.buffer;
  }
}
