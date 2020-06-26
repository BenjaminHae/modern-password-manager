export interface ICredentialProvider {
  getKey(): CryptoKey;
  cleanUp(): Promise<void>;
}
