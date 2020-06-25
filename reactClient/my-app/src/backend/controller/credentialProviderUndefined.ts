export class CredentialProviderUndefined {

  getKey(): CryptoKey{
    throw new Error("No Credentials existing");
  }

  cleanUp(): Promise<void> {
    return Promise.resolve();
  }
}
